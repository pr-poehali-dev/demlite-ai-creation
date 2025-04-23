
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, X } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive 
            ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20" 
            : "border-gray-300 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".txt,.md,.js,.ts,.jsx,.tsx,.html,.css,.json,.py,.rb,.java,.c,.cpp,.h,.cs,.php,.go,.rs,.swift"
        />
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="h-12 w-12 text-indigo-400 dark:text-indigo-300 mb-3" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Перетащите файл сюда или нажмите для выбора
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Поддерживаются текстовые файлы до 5 МБ
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md">
              <File className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(selectedFile.size / 1024)} КБ
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancelSelection}
              className="h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4 mr-1" />
              Отмена
            </Button>
            <Button 
              size="sm" 
              onClick={handleFileUpload}
              className="h-8 bg-indigo-500 hover:bg-indigo-600"
            >
              <UploadCloud className="h-4 w-4 mr-1" />
              Загрузить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
