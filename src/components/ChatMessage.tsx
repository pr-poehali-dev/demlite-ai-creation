
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { MessageType } from "@/lib/openai";

interface ChatMessageProps {
  message: MessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    if (message.type === 'image') {
      return (
        <>
          <p className="mb-3">{message.content}</p>
          {message.imageUrl ? (
            <img 
              src={message.imageUrl} 
              alt="Generated image" 
              className="rounded-lg w-full max-w-md mx-auto shadow-lg" 
            />
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">Загрузка изображения...</p>
            </div>
          )}
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
            <p className="mb-3">{parts[0]}</p>
            <CodeBlock code={code} language={language} />
            {parts[2] && <p className="mt-3">{parts[2]}</p>}
          </>
        );
      }
      
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
    
    return <p className="whitespace-pre-wrap">{message.content}</p>;
  };
  
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : ''} animate-fade-in`}>
      {!isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 shadow">
          <Bot className="h-5 w-5 text-white" />
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : ''}`}>
        <div className={`px-5 py-3 rounded-2xl text-sm shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none' 
            : 'bg-white dark:bg-gray-800 rounded-tl-none'
        }`}>
          {renderContent()}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">
          {isUser ? 'Вы' : 'DEMLITE AI'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
      
      {isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-700 dark:to-indigo-800 shadow">
          <User className="h-5 w-5 text-indigo-700 dark:text-white" />
        </Avatar>
      )}
    </div>
  );
};
