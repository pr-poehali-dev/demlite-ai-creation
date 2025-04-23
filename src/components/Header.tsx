
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Menu, X, Moon, Sun, ImageIcon, Code, FileText } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  clearChat: () => void;
  setActiveTab: (tab: string) => void;
}

const Header = ({ isDarkMode, setIsDarkMode, clearChat, setActiveTab }: HeaderProps) => {
  return (
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
  );
};

export default Header;
