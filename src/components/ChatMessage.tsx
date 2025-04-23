
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { ImagePreview } from "./ImagePreview";

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'image' | 'code';
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    if (message.type === 'image') {
      return (
        <>
          <p className="mb-2">{message.content}</p>
          <ImagePreview />
        </>
      );
    } else if (message.type === 'code') {
      const parts = message.content.split('```');
      if (parts.length >= 3) {
        const codeBlockRegex = /^([\w-]+)?\n([\s\S]+)$/;
        const match = parts[1].match(codeBlockRegex);
        
        const language = match?.[1] || 'text';
        const code = match?.[2] || parts[1];
        
        return (
          <>
            <p className="mb-2">{parts[0]}</p>
            <CodeBlock code={code} language={language} />
            {parts[2] && <p className="mt-2">{parts[2]}</p>}
          </>
        );
      }
      
      return <p>{message.content}</p>;
    }
    
    return <p>{message.content}</p>;
  };
  
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900">
          <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : ''}`}>
        <div className={`px-4 py-2 rounded-xl text-sm ${
          isUser 
            ? 'bg-indigo-500 text-white rounded-tr-none' 
            : 'bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-800 rounded-tl-none'
        }`}>
          {renderContent()}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isUser ? 'Вы' : 'DEMLITE AI'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900">
          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
        </Avatar>
      )}
    </div>
  );
};
