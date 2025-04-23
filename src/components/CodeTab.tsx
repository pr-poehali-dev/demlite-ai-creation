
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { MessageType } from "@/lib/openai";

interface CodeTabProps {
  messages: MessageType[];
  setActiveTab: (tab: string) => void;
  setInput: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const CodeTab = ({ messages, setActiveTab, setInput, textareaRef }: CodeTabProps) => {
  const getCodes = () => {
    return messages.filter(msg => msg.type === 'code');
  };

  const extractCodeFromMessage = (message: MessageType) => {
    const parts = message.content.split('```');
    if (parts.length >= 3) {
      const codeBlockRegex = /^([\w-]+)?\n([\s\S]+)$/;
      const match = parts[1].match(codeBlockRegex);
      
      const language = match?.[1] || 'text';
      const code = match?.[2] || parts[1];
      
      return { language, code };
    }
    return { language: 'text', code: message.content };
  };

  const handleCreateCode = () => {
    setActiveTab("chat");
    setInput("Напиши пример кода для ");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <ScrollArea className="flex-1 p-4">
      {getCodes().length > 0 ? (
        getCodes().map((msg, i) => {
          const { language, code } = extractCodeFromMessage(msg);
          return (
            <div key={i} className="mb-6">
              <CodeBlock code={code} language={language} />
            </div>
          );
        })
      ) : (
        <div className="text-center p-8">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Code className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Нет сниппетов кода
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Попросите DEMLITE AI написать код, и он появится здесь.
          </p>
          <Button 
            onClick={handleCreateCode}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Code className="h-4 w-4 mr-2" />
            Создать код
          </Button>
        </div>
      )}
    </ScrollArea>
  );
};

export default CodeTab;
