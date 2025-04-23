
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 text-gray-100 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 border-b border-gray-700">
        <span>{language}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="h-8 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Копировать
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
};
