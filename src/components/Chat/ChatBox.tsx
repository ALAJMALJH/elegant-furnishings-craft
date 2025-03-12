
import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you with our furniture collection today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const newUserMessage: Message = { role: 'user', content: message };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      // Get response from OpenAI via our Edge Function
      const response = await supabase.functions.invoke('chatbot', {
        body: { 
          message,
          chatHistory: messages
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to get response');
      }
      
      // Add bot response to chat
      const data = response.data as { response: string };
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: data.response }
      ]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast({
        title: "Something went wrong",
        description: "We couldn't get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-furniture-accent hover:bg-furniture-accent/90 text-furniture-dark z-50"
        >
          <MessageSquare size={24} />
        </Button>
      )}

      {/* Chat box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[450px] bg-background border border-border rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="p-3 bg-furniture-accent text-furniture-dark rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">AL AJMAL Furniture Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-furniture-dark hover:bg-furniture-accent/80 h-8 w-8 p-1">
              <X size={18} />
            </Button>
          </div>
          <Separator />
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index} 
                message={message.content} 
                isBot={message.role === 'assistant'} 
              />
            ))}
            {isLoading && (
              <ChatBubble 
                message="Thinking..." 
                isBot={true} 
              />
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 bg-background rounded-b-lg">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
