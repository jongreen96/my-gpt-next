import { Button } from '@/components/ui/button';
import prisma from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs';
import { MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function Conversations() {
  const { userId } = auth();
  if (!userId) throw Error('UserId Not Found');

  const allConversations = await prisma.conversations.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className='flex flex-col gap-2'>
      <Button size='icon' className='group-hover:hidden' asChild>
        <Link href='/chat'>
          <Plus size={20} className='group-hover:mr-2' />
          <p className='hidden group-hover:block'>New Conversation</p>
        </Link>
      </Button>

      <Button asChild className='hidden group-hover:flex'>
        <Link href='/chat'>
          <Plus size={20} className='group-hover:mr-2' />
          <p className='hidden group-hover:block'>New Conversation</p>
        </Link>
      </Button>

      {allConversations.map((conversation) => (
        <>
          <Button
            key={conversation.id}
            variant='secondary'
            asChild
            className='hidden justify-start text-white group-hover:flex'
          >
            <Link href={`/chat/${conversation.id}`}>
              <MessageSquare size={20} className='mr-2' />
              <p
                title={conversation.subject}
                className='max-w-48 overflow-hidden text-ellipsis'
              >
                {conversation.subject}
              </p>
            </Link>
          </Button>

          <Button
            key={conversation.id}
            variant='secondary'
            size='icon'
            asChild
            className='text-white group-hover:hidden'
          >
            <Link href={`/chat/${conversation.id}`}>
              <MessageSquare size={20} />
            </Link>
          </Button>
        </>
      ))}
    </div>
  );
}
