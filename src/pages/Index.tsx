
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTextResponse, generateImage, analyzeFile, MessageType } from "@/lib/openai";
import Header from "@/components/Header";
import MessageInput from "@/components/MessageInput";
import ChatTab from "@/components/ChatTab";
import ImagesTab from "@/components/ImagesTab";
import CodeTab from "@/components/CodeTab";
import FilesTab from "@/components/FilesTab";

const Index = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    { role: 'assistant', content: 'Привет! Я DEMLITE AI - ваш универсальный помощник. Я могу отвечать на вопросы, генерировать изображения, писать код и анализировать файлы. Чем могу помочь?' }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageGen, setIsImageGen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: MessageType = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      let botResponse: MessageType;
      
      if (isImageGen) {
        botResponse = await generateImage(input);
        setActiveTab("images");
      } else {
        botResponse = await generateTextResponse([...messages, userMessage]);
        
        if (botResponse.type === 'code') {
          setActiveTab("code");
        }
      }
      
      setMessages(prev => [...prev, botResponse]);
      setIsImageGen(false);
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: `Загружен файл: ${file.name} (${Math.round(file.size / 1024)} КБ)` 
      }]);
      
      const response = await analyzeFile(file);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error("Ошибка при обработке файла:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Произошла ошибка при обработке файла. Пожалуйста, попробуйте еще раз.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: 'Чат очищен. Чем еще я могу помочь?' 
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      {/* Шапка */}
      <Header 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        clearChat={clearChat}
        setActiveTab={setActiveTab}
      />

      {/* Основное содержимое */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Левая панель с чатом */}
        <div className="flex-1 flex flex-col min-w-0 border-r dark:border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-[73px] z-10">
              <TabsList className="w-full justify-start h-12 px-2 bg-transparent">
                <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-gray-700">
                  Чат
                </TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-gray-700">
                  Изображения
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-gray-700">
                  Код
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-gray-700">
                  Файлы
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ChatTab messages={messages} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="images" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ImagesTab 
                messages={messages} 
                setIsImageGen={setIsImageGen} 
                setActiveTab={setActiveTab}
                textareaRef={textareaRef}
              />
            </TabsContent>

            <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <CodeTab 
                messages={messages} 
                setActiveTab={setActiveTab} 
                setInput={setInput}
                textareaRef={textareaRef}
              />
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <FilesTab handleFileUpload={handleFileUpload} />
            </TabsContent>
          </Tabs>

          {/* Форма ввода сообщения */}
          <MessageInput 
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            isImageGen={isImageGen}
            setIsImageGen={setIsImageGen}
            setActiveTab={setActiveTab}
            clearChat={clearChat}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
