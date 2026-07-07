import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  output: string;
  error: string;
}

export default function Console({ output, error }: Props) {
  const [activeTab, setActiveTab] = useState("output");

  useEffect(() => {
    if (error.trim()) {
      setActiveTab("error");
    } else {
      setActiveTab("output");
    }
  }, [error]);

  return (
    <div className="h-64 border-t border-zinc-800 bg-zinc-950 flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full flex-col"
      >
        <TabsList className="w-fit m-2">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="error">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="output" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <pre className="p-4 whitespace-pre-wrap break-words text-green-400 font-mono text-sm">
              {output || "No Output"}
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="error" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <pre className="p-4 whitespace-pre-wrap break-words text-red-400 font-mono text-sm">
              {error || "No Errors"}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
