
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImagePreviewProps {
  imageUrl?: string;
}

export const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `demlite-ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm group hover:shadow-md transition-shadow duration-300">
      <AspectRatio ratio={1 / 1}>
        {imageUrl ? (
          <div className="relative h-full w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900">
                <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt="Сгенерированное изображение"
              className="h-full w-full object-cover transition-opacity duration-300"
              onLoad={() => setIsLoading(false)}
              style={{ opacity: isLoading ? 0 : 1 }}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
                  title="Увеличить"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-screen-md max-h-[90vh] flex items-center justify-center p-0 bg-transparent border-0">
                <img 
                  src={imageUrl} 
                  alt="Сгенерированное изображение в полном размере" 
                  className="max-h-[90vh] max-w-full rounded-lg shadow-xl" 
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                DEMLITE AI
              </div>
              <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
                Генерация изображения
              </div>
            </div>
          </div>
        )}
      </AspectRatio>
      <div className="p-3 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          AI-изображение
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8"
          onClick={handleDownload}
          disabled={!imageUrl}
        >
          <Download className="h-4 w-4 mr-1" />
          Скачать
        </Button>
      </div>
    </div>
  );
};
