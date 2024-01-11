import ConversationsSettings from '@/components/conversationsSettings';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ConversationsMobile() {
  const { userId } = auth();
  if (!userId) throw Error('UserId Not Found');

  const allConversations = await prisma.conversations.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className='flex max-h-[75svh] flex-col gap-2 px-2 pb-5'>
      <Button asChild className='group-hover:flex'>
        <Link href='/chat'>
          <Plus size={20} className='group-hover:mr-2' />
          <p className='group-hover:block'>New Conversation</p>
        </Link>
      </Button>

      <div className='no-scrollbar flex flex-col gap-2 overflow-scroll'>
        {allConversations.map((conversation) => (
          <div key={conversation.id}>
            <Button
              variant='secondary'
              asChild
              className='justify-start group-hover:flex'
            >
              <div className='w-full'>
                <Link
                  href={`/chat/${conversation.id}`}
                  className='grow overflow-hidden'
                >
                  <p
                    title={conversation.subject}
                    className='max-w-full overflow-hidden text-ellipsis'
                  >
                    {conversation.subject || (
                      <Loader2 size={20} className='animate-spin' />
                    )}
                  </p>
                </Link>
                <ConversationsSettings conversation={conversation} />
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
