
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const ImagePreview = () => {
  // Временно используем плейсхолдер, в реальном приложении будет сгенерированное изображение
  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <AspectRatio ratio={16 / 9}>
        <div className="h-full w-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
              Сгенерированное изображение
            </div>
            <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
              (Визуализация изображения)
            </div>
          </div>
        </div>
      </AspectRatio>
      <div className="p-3 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Изображение DALL-E
        </div>
        <Button size="sm" variant="outline" className="h-8">
          <Download className="h-4 w-4 mr-1" />
          Скачать
        </Button>
      </div>
    </div>
  );
};
