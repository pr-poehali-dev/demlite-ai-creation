import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, ImageIcon, FileText, X } from "lucide-react";
import { useRef, useEffect } from "react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isImageGen: boolean;
  setIsImageGen: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
  clearChat: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const MessageInput = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading, 
  isImageGen, 
  setIsImageGen, 
  setActiveTab, 
  clearChat, 
  handleKeyDown 
}: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isImageGen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isImageGen]);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const toggleImageGenMode = () => {
    setIsImageGen(!isImageGen);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder={isImageGen 
              ? "Опишите изображение, которое хотите создать..." 
              : "Введите сообщение..."
            }
            className={`min-h-[60px] max-h-[150px] pr-12 border-indigo-100 dark:border-gray-600 focus-visible:ring-indigo-300 ${
              isImageGen 
                ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30" 
                : ""
            }`}
          />
          {isImageGen && (
            <div className="absolute right-2 top-2 px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Режим изображений
            </div>
          )}
        </div>
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !input.trim()}
          className="bg-indigo-500 hover:bg-indigo-600 self-end h-[60px] px-4"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex mt-3 text-xs text-gray-500 dark:text-gray-400 gap-4 justify-start flex-wrap">
        <button 
          className={`flex items-center gap-1 transition-colors ${
            isImageGen 
              ? "text-indigo-500 dark:text-indigo-400 font-medium" 
              : "hover:text-indigo-500 dark:hover:text-indigo-400"
          }`}
          onClick={toggleImageGenMode}
        >
          <ImageIcon className="h-3 w-3" /> 
          Генерация изображения
        </button>
        <button 
          className="flex items-center gap-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          onClick={() => {
            setActiveTab("files");
          }}
        >
          <FileText className="h-3 w-3" /> 
          Загрузка файла
        </button>
        <button 
          className="flex items-center gap-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          onClick={clearChat}
        >
          <X className="h-3 w-3" /> 
          Очистить чат
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
