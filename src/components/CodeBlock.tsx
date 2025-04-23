
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error("Не удалось скопировать код:", err);
    }
  };

  const formatCode = (code: string) => {
    return code.split("\n").map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell text-gray-500 dark:text-gray-400 pr-4 text-right select-none">
          {i + 1}
        </span>
        <span className="table-cell">{line || " "}</span>
      </div>
    ));
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-900 text-gray-100 shadow-lg mb-4 group">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-sm font-mono">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4 mr-1 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          {copied ? "Скопировано" : "Копировать"}
        </Button>
      </div>
      <div className="overflow-x-auto p-4 text-sm font-mono">
        <div className="table">{formatCode(code)}</div>
      </div>
    </div>
  );
};
