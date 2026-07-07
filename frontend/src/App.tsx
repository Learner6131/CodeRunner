// import axios from "axios";
// import { Button } from "./components/ui/button";
// import "./index.css";
// import { useRef, useState } from "react";

// const BACKEND_URL = "http://localhost:3000";

// export function App() {
//   const textAreaRef = useRef<HTMLTextAreaElement>(null);
//   const [status, setStatus] = useState("");
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("cpp");

//   async function pollBackend(submissionId: string) {
//     const response = await axios.get(
//       `${BACKEND_URL}/submission/${submissionId}`,
//     );
//     if (response.data.submission.status !== "Processing") {
//       setStatus(response.data.submission.status);
//       setOutput(response.data.submission.output);
//       setError(response.data.submission.error);
//     } else {
//       // TODO : ADD EXPONENTIAL BACKOFF
//       await new Promise((r) => setTimeout(r, 3000));
//       pollBackend(submissionId);
//     }
//   }

//   return (
//     <div className="h-screen w-screen flex m-4">
//       <div className="flex-1 h-screen">
//         <div className="flex justify-between">
//           <div>
//             <Button
//               variant={selectedLanguage === "cpp" ? "destructive" : "outline"}
//               onClick={() => setSelectedLanguage("cpp")}
//             >
//               CPP
//             </Button>
//             <Button
//               variant={selectedLanguage === "js" ? "destructive" : "outline"}
//               onClick={() => setSelectedLanguage("js")}
//             >
//               JS
//             </Button>
//             <Button
//               variant={selectedLanguage === "py" ? "destructive" : "outline"}
//               onClick={() => setSelectedLanguage("py")}
//             >
//               Python
//             </Button>
//           </div>
//           <div>
//             <Button
//               onClick={async () => {
//                 setStatus("Processing");
//                 setOutput("");

//                 const response = await axios.post(`${BACKEND_URL}/submission`, {
//                   code: textAreaRef.current!.value,
//                   language: selectedLanguage,
//                 });

//                 pollBackend(response.data.id);
//               }}
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//         <textarea
//           ref={textAreaRef}
//           className="h-screen w-full border rounded m-4 p-4"
//           rows={500}
//         ></textarea>
//       </div>
//       <div className="flex-1 h-screen bg-green-300">
//         <div>{status}</div>
//         <div>{output}</div>
//         <div>{error}</div>
//       </div>
//     </div>
//   );
// }

// export default App;

/////////////////////////////////////////////////////////////////////////////////////////////

import { useState } from "react";

import Navbar from "./components/Navbar";
import Editor from "./components/Editor";
import Console from "./components/Console";
import StatusBar from "./components/StatusBar";

import { createSubmission, getSubmission } from "./services/submission";

export function App() {
  const [language, setLanguage] = useState("cpp");

  const [code, setCode] = useState(`#include <iostream>

using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`);

  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  async function pollSubmission(submissionId: string) {
    while (true) {
      const submission = await getSubmission(submissionId);

      if (submission.submission.status !== "Processing") {
        setStatus(submission.submission.status);
        setOutput(submission.submission.output ?? "");
        setError(submission.submission.error ?? "");
        setIsRunning(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  async function runCode() {
    try {
      setIsRunning(true);
      setStatus("Processing");
      setOutput("");
      setError("");

      const submission = await createSubmission(code, language);

      await pollSubmission(submission.id);
    } catch (err) {
      console.error(err);

      setStatus("Failed");
      setError("Unable to connect to the backend.");
      setIsRunning(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <Navbar
        language={language}
        setLanguage={setLanguage}
        runCode={runCode}
        isRunning={isRunning}
      />

      <div className="flex-1 overflow-hidden">
        <Editor language={language} code={code} setCode={setCode} />
      </div>

      <Console output={output} error={error} />

      <StatusBar status={status} />
    </div>
  );
}
