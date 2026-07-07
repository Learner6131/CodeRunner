import { Play, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  runCode: () => void | Promise<void>;
  isRunning: boolean;
}

export default function Navbar({
  language,
  setLanguage,
  runCode,
  isRunning,
}: Props) {
  return (
    <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-5 bg-zinc-900">
      <h1 className="text-xl font-bold text-white">🚀 CodeRunner</h1>

      <div className="flex items-center gap-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-800 text-white rounded-md px-3 py-2 border border-zinc-700"
        >
          <option value="cpp">C++</option>
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>

        <Button onClick={runCode} disabled={isRunning}>
          {isRunning ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
