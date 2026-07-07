import MonacoEditor from "@monaco-editor/react";

interface Props {
  language: string;
  code: string;
  setCode: (code: string) => void;
}

const languageMap: Record<string, string> = {
  cpp: "cpp",
  c: "c",
  js: "javascript",
  ts: "typescript",
  py: "python",
  java: "java",
};

export default function Editor({ language, code, setCode }: Props) {
  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={languageMap[language] || language}
        value={code}
        onChange={(value) => setCode(value ?? "")}
        onMount={(editor) => {
          editor.focus();
        }}
        options={{
          readOnly: false,
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
          fontSize: 15,
          fontFamily: "JetBrains Mono",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
