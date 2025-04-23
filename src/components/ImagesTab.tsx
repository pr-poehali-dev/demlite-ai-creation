
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { ImagePreview } from "@/components/ImagePreview";
import { MessageType } from "@/lib/openai";

interface ImagesTabProps {
  messages: MessageType[];
  setIsImageGen: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const ImagesTab = ({ messages, setIsImageGen, setActiveTab, textareaRef }: ImagesTabProps) => {
  const getImages = () => {
    return messages.filter(msg => msg.type === 'image' && msg.imageUrl);
  };

  const handleCreateImage = () => {
    setIsImageGen(true);
    setActiveTab("chat");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
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
              onClick={handleCreateImage}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Создать изображение
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ImagesTab;
