
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ImagePreview } from "@/components/ImagePreview";
import { CodeBlock } from "@/components/CodeBlock";
import { FileUpload } from "@/components/FileUpload";
import { generateTextResponse, generateImage, analyzeFile, MessageType } from "@/lib/openai";
import { SendHorizontal, Image as ImageIcon, Code, FileText, Sparkles, Menu, X, Moon, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
  
  const toggleImageGenMode = () => {
    setIsImageGen(!isImageGen);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const getImages = () => {
    return messages.filter(msg => msg.type === 'image' && msg.imageUrl);
  };

  const getCodes = () => {
    return messages.filter(msg => msg.type === 'code');
  };

  // Извлечение кода из сообщения с кодом
  const extractCodeFromMessage = (message: MessageType) => {
    const parts = message.content.split('```');
    if (parts.length >= 3) {
      const codeBlockRegex = /^([\w-]+)?\n([\s\S]+)$/;
      const match = parts[1].match(codeBlockRegex);
      
      const language = match?.[1] || 'text';
      const code = match?.[2] || parts[1];
      
      return { language, code };
    }
    return { language: 'text', code: message.content };
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      {/* Шапка */}
      <header className="p-4 border-b flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-indigo-500 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            DEMLITE AI
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
            Ваш универсальный AI-ассистент
          </span>
          <div className="flex items-center gap-2 ml-2">
            <Switch 
              id="dark-mode" 
              checked={isDarkMode} 
              onCheckedChange={setIsDarkMode} 
            />
            <Label htmlFor="dark-mode" className="sr-only">Темная тема</Label>
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-2">
                <div className="font-medium text-sm">DEMLITE AI Меню</div>
                <Separator />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={clearChat}
                >
                  <X className="h-4 w-4 mr-2" />
                  Очистить чат
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("images")}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Галерея изображений
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("code")}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Сниппеты кода
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("files")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Загрузка файлов
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

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
            </TabsContent>

            <TabsContent value="images" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getImages().length > 0 ? (
                    getImages().map((msg, i) => (
                      <ImagePreview key={i} imageUrl={msg.imageUrl} />
                    ))
                  ) : (
                    <div className="col-span-full text-center p-8">
                      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Нет сгенерированных изображений
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        Попросите DEMLITE AI сгенерировать изображение, и оно появится здесь.
                      </p>
                      <Button 
                        onClick={() => {
                          setIsImageGen(true);
                          setActiveTab("chat");
                          if (textareaRef.current) {
                            textareaRef.current.focus();
                          }
                        }}
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Создать изображение
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ScrollArea className="flex-1 p-4">
                {getCodes().length > 0 ? (
                  getCodes().map((msg, i) => {
                    const { language, code } = extractCodeFromMessage(msg);
                    return (
                      <div key={i} className="mb-6">
                        <CodeBlock code={code} language={language} />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-8">
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Code className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Нет сниппетов кода
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                      Попросите DEMLITE AI написать код, и он появится здесь.
                    </p>
                    <Button 
                      onClick={() => {
                        setActiveTab("chat");
                        setInput("Напиши пример кода для ");
                        if (textareaRef.current) {
                          textareaRef.current.focus();
                        }
                      }}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Создать код
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ScrollArea className="flex-1 p-4">
                <FileUpload onUpload={handleFileUpload} />
                <div className="mt-8">
                  <h3 className="font-medium text-base text-gray-700 dark:text-gray-300 mb-2">
                    Как это работает?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Загрузите текстовый файл, и DEMLITE AI проанализирует его содержимое:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Анализ кода и предложение улучшений</li>
                    <li>Суммаризация длинных текстов</li>
                    <li>Извлечение полезной информации из документов</li>
                    <li>Ответы на вопросы по содержимому файла</li>
                  </ul>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Форма ввода сообщения */}
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
            <div className="flex mt-3 text-xs text-gray-500 dark:text-gray-400 gap-4 justify-center md:justify-start">
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
        </div>
      </div>
    </div>
  );
};

export default Index;
