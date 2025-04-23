
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { MessageType } from "@/lib/openai";
import { useRef, useEffect } from "react";

interface ChatTabProps {
  messages: MessageType[];
  isLoading: boolean;
}

const ChatTab = ({ messages, isLoading }: ChatTabProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((msg, i) => (
        <ChatMessage 
          key={i} 
          message={msg} 
        />
      ))}
      {isLoading && (
        <div className="flex justify-start mb-6 animate-pulse">
          <div className="flex gap-3 items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 shadow"></div>
            <div className="px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 rounded-tl-none shadow-sm">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default ChatTab;
