import prisma from '@/lib/db/prisma';
import { createClient } from '@supabase/supabase-js';
import { delay } from '../utils';

// ---------------------------------- Conversations ----------------------------------

export async function createConversation(
  id,
  userId,
  settings,
  subject = '',
  type = 'chat',
) {
  const result = await prisma.conversations.create({
    data: {
      id,
      settings,
      userId,
      subject,
      type,
    },
  });
  return result;
}

export async function getConversations(userId) {
  const conversations = await prisma.conversations.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  return conversations;
}

export async function getConversation(id, userId) {
  const conversation = await prisma.conversations.findUnique({
    where: {
      id,
      userId,
    },
  });
  return conversation;
}

export async function deleteConversation(conversationId, userId) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );

  const messages = await prisma.messages.findMany({
    where: {
      conversationId,
    },
  });

  messages.forEach((message) => {
    if (message.images?.length > 0) {
      message.images.forEach(async (image) => {
        supabase.storage
          .from('my-gpt-storage')
          .remove([image.split('my-gpt-storage/')[1]]);
      });
    }
  });

  await prisma.conversations.delete({
    where: {
      id: conversationId,
      userId,
    },
  });
}

export async function updateConversationSubject(
  conversationId,
  userId,
  subject,
) {
  await prisma.conversations.update({
    where: {
      id: conversationId,
      userId,
    },
    data: {
      subject,
    },
  });
}

// ---------------------------------- Messages ----------------------------------

export async function createMessages(
  id,
  messages,
  completion,
  reqTime,
  reqCost,
  resCost,
  images,
) {
  const result = await prisma.messages.createMany({
    data: [
      {
        conversationId: id,
        content:
          typeof messages[messages.length - 1].content === 'string'
            ? messages[messages.length - 1].content
            : messages[messages.length - 1].content[0].text,
        role: 'user',
        images: images.map((image) => image.url),
        createdAt: reqTime,
        credits: reqCost,
      },
      {
        conversationId: id,
        content: completion,
        role: 'assistant',
        createdAt: new Date(),
        credits: resCost,
      },
    ],
  });
  return result;
}

export async function createImageMessages(id, input, images, reqTime, resCost) {
  const result = await prisma.messages.createMany({
    data: [
      {
        conversationId: id,
        content: input,
        role: 'user',
        createdAt: reqTime,
        credits: 0,
      },
      {
        conversationId: id,
        content: '',
        role: 'assistant',
        images,
        createdAt: new Date(),
        credits: resCost,
      },
    ],
  });
}

export async function getMessages(conversationId) {
  const result = await prisma.messages.findMany({
    where: {
      conversationId,
    },
    select: {
      role: true,
      content: true,
      images: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return result;
}

// ---------------------------------- User ----------------------------------
export async function getUser(id, retryCount = 3) {
  const baseDelay = 1000; // 1 second base delay

  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const formattedUser = {
      id: user.id,
      credits: user.credits,
      settings: {
        model: user.model,
        imageModel: user.imageModel,
        max_tokens: user.max_tokens,
        temperature: user.temperature,
        response_format: user.response_format,
        frequency_penalty: user.frequency_penalty,
        presence_penalty: user.presence_penalty,
        top_p: user.top_p,
        system_message: user.system_message,
        high_res_vision: user.high_res_vision,
        n: user.n,
        size: user.size,
        style: user.style,
        quality: user.quality,
      },
    };

    return formattedUser;
  } catch (error) {
    if (retryCount > 0) {
      console.log(`User not found. Retrying... (${retryCount} attempts left)`);
      await delay(baseDelay * (4 - retryCount)); // Increasing delay
      return await getUser(id, retryCount - 1);
    } else {
      throw new Error('Maximum retry attempts reached. User not found.');
    }
  }
}

export async function decreaseUserCredits(userId, reqCost, resCost) {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      credits: {
        decrement: reqCost + resCost,
      },
    },
  });
}

export async function increaseUserCredits(userId, amount) {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      credits: {
        increment: amount * 10000,
      },
    },
  });
}

export async function updateUserSettings(userId, settings) {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      model: settings.model,
      imageModel: settings.imageModel,
      top_p: settings.top_p,
      system_message: settings.system_message,
      max_tokens: settings.max_tokens,
      response_format: settings.response_format,
      temperature: settings.temperature,
      presence_penalty: settings.presence_penalty,
      frequency_penalty: settings.frequency_penalty,
      high_res_vision: settings.high_res_vision,
      n: settings.n,
      size: settings.size,
      style: settings.style,
      quality: settings.quality,
    },
  });
}

export async function deleteUser(id) {
  const deletedUser = await prisma.users.delete({
    where: {
      id,
    },
  });

  const conversation = await prisma.conversations.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!conversation) return;

  const deletedMessages = await prisma.messages.deleteMany({
    where: {
      conversationId: conversation.id,
    },
  });

  const deletedConversations = await prisma.conversations.deleteMany({
    where: {
      userId: user.id,
    },
  });

  return {
    deletedUser,
    deletedMessages,
    deletedConversations,
  };
}

export async function createUser(id) {
  const result = await prisma.users.create({
    data: {
      id,
      credits: 100000,
    },
  });
  return result;
}

// ---------------------------------- Transactions ----------------------------------

export async function addTransaction(userId, total) {
  const result = await prisma.transactions.create({
    data: {
      userId,
      total,
      credits: total * 10000,
    },
  });
  return result;
}
