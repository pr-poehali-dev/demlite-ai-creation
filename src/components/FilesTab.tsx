
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/FileUpload";

interface FilesTabProps {
  handleFileUpload: (file: File) => Promise<void>;
}

const FilesTab = ({ handleFileUpload }: FilesTabProps) => {
  return (
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
  );
};

export default FilesTab;
