
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging 
          ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <File className="h-10 w-10 text-indigo-400 dark:text-indigo-300 mx-auto mb-3" />
      <h3 className="font-medium mb-1">Загрузите файл</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Перетащите файл сюда или нажмите для выбора
      </p>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        className="border-indigo-200 dark:border-indigo-800"
      >
        <Upload className="h-4 w-4 mr-2" />
        Выбрать файл
      </Button>
    </div>
  );
};
