
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ImagePreview } from "@/components/ImagePreview";
import { CodeBlock } from "@/components/CodeBlock";
import { FileUpload } from "@/components/FileUpload";
import { SendHorizontal, Image, Code, FileText, Sparkles } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, type?: 'text' | 'image' | 'code' }>>([
    { role: 'assistant', content: 'Привет! Я DEMLITE AI - ваш универсальный помощник. Я могу отвечать на вопросы, генерировать изображения, писать код и анализировать файлы. Чем могу помочь?' }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Добавить сообщение пользователя
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Симуляция ответа ассистента (в реальном приложении здесь будет API-запрос)
    setTimeout(() => {
      if (input.toLowerCase().includes("картинка") || input.toLowerCase().includes("изображение")) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Вот сгенерированное изображение:', 
          type: 'image' 
        }]);
        setActiveTab("images");
      } else if (input.toLowerCase().includes("код") || input.toLowerCase().includes("программа")) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Вот пример кода:\n```javascript\nfunction hello() {\n  console.log("Привет от DEMLITE AI!");\n}\n```', 
          type: 'code' 
        }]);
        setActiveTab("code");
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Я обработал ваш запрос: "${input}". В реальном приложении здесь будет настоящий ответ от AI.` 
        }]);
      }
      scrollToBottom();
    }, 1000);
    
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (file: File) => {
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `Загружен файл: ${file.name} (${Math.round(file.size / 1024)} КБ)` 
    }]);
    
    // Симуляция обработки файла
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Файл ${file.name} успешно обработан. В реальном приложении здесь будет анализ содержимого файла.` 
      }]);
      scrollToBottom();
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      {/* Шапка */}
      <header className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            DEMLITE AI
          </h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Ваш универсальный AI-ассистент
        </div>
      </header>

      {/* Основное содержимое */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Левая панель с чатом */}
        <div className="flex-1 flex flex-col min-w-0 border-r dark:border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b dark:border-gray-700">
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
                <div ref={messagesEndRef} />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="images" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImagePreview />
                  <ImagePreview />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ScrollArea className="flex-1 p-4">
                <CodeBlock 
                  code="// Пример кода\nfunction greet(name) {\n  return `Привет, ${name}!`;\n}\n\nconsole.log(greet('пользователь'));" 
                  language="javascript" 
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
              <ScrollArea className="flex-1 p-4">
                <FileUpload onUpload={handleFileUpload} />
                <div className="mt-4">
                  <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Загруженные файлы</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Пока нет загруженных файлов
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Форма ввода сообщения */}
          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Введите сообщение..."
                className="border-indigo-100 dark:border-gray-600 focus-visible:ring-indigo-300"
              />
              <Button onClick={handleSendMessage} className="bg-indigo-500 hover:bg-indigo-600">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex mt-2 text-xs text-gray-500 dark:text-gray-400 gap-4">
              <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <Image className="h-3 w-3" /> Генерация изображения
              </button>
              <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <Code className="h-3 w-3" /> Написание кода
              </button>
              <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <FileText className="h-3 w-3" /> Загрузка файла
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
