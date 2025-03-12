
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isBot: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isBot }) => {
  return (
    <div className={cn(
      "max-w-[80%] p-3 rounded-2xl mb-2",
      isBot 
        ? "bg-muted text-foreground self-start rounded-tl-none" 
        : "bg-furniture-accent text-furniture-dark self-end rounded-br-none"
    )}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ChatBubble;
