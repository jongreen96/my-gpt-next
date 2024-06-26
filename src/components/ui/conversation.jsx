import { Loader2, LucideImage, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ConversationsSettings from '../conversationsSettings';
import { Button } from './button';

export default function Conversation({ conversation }) {
  return (
    <Button
      variant='secondary'
      asChild
      className='shrink-0 justify-start group-hover:flex'
    >
      <div className='flex'>
        <Link
          href={`/${conversation.type}/${conversation.id}`}
          className='flex grow overflow-clip'
        >
          {messageIcon(conversation.type)}
          <p
            title={conversation.subject}
            className='overflow-hidden text-ellipsis sm:hidden sm:max-w-48 sm:group-hover:block'
          >
            {conversation.subject || (
              <Loader2 size={20} className='animate-spin' />
            )}
          </p>
        </Link>
        <ConversationsSettings conversation={conversation} />
      </div>
    </Button>
  );
}

function messageIcon(type) {
  switch (type) {
    case 'chat':
      return (
        <MessageSquare
          size={20}
          className='mr-2 shrink-0 sm:mr-0 sm:group-hover:mr-2'
        />
      );
    case 'image':
      return (
        <LucideImage
          size={20}
          className='mr-2 shrink-0 sm:mr-0 sm:group-hover:mr-2'
        />
      );
    default:
      return (
        <Loader2
          size={20}
          className='mr-2 shrink-0 sm:mr-0 sm:group-hover:mr-2'
        />
      );
  }
}
