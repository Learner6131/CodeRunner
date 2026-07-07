import { createClient } from "redis";
import fs from "fs";
import { spawn } from "child_process";
import { prisma } from "./db";
import path from "path";
import { DockerExecutor } from "./executor/DockerExecutor";

type ExecutionResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

const executor = new DockerExecutor();
const client = createClient();

// Remove machine-specific absolute paths from compiler/runtime output
function sanitizePathOutput(s: string) {
  if (!s) return s;
  // Replace absolute paths (Windows or POSIX) with their basenames
  return s.replace(/(?:[A-Za-z]:)?[\\/][^:\n]*/g, (m) => path.basename(m));
}

// send the results
async function sendResult(submissionId: string, result: ExecutionResult) {
  if (result.exitCode === -100) {
    await prisma.submissions.update({
      where: {
        id: submissionId,
      },
      data: {
        status: "Failure",
        error: "Time Limit Exceeded",
      },
    });

    return;
  }

  if (result.exitCode === 0) {
    await prisma.submissions.update({
      where: {
        id: submissionId,
      },
      data: {
        status: "Success",
        output: result.stdout,
      },
    });

    return;
  }

  await prisma.submissions.update({
    where: {
      id: submissionId,
    },
    data: {
      status: "Failure",
      error: sanitizePathOutput(result.stderr),
    },
  });
}

client.connect().then(async () => {
  while (1) {
    const response = await client.rPop("problems");
    if (!response) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    const parsedResponse = JSON.parse(response);
    const code = parsedResponse.code;
    const language = parsedResponse.language;
    const submissionId = parsedResponse.submissionId;
    console.log("processing question for user " + parsedResponse.userId);
    let finalOutput = "";
    let finalErr = "";

    //TODO: Add a timeout so that if the user code takes more than 5 seconds to execute
    // you change the status in the DB to TLE.

    if (language === "cpp") {
      // console.log("Running users c++ code");
      // const filePath = __dirname + "/code/a.cpp";
      // fs.writeFileSync(filePath, code);
      // const reponseCompiler = spawn("g++", [filePath, "-o", "./code/out"]);
      // let exitCodeCompiler = null;
      // let compilerErr = "";

      // reponseCompiler.stderr.on("data", (chunk) => {
      //   compilerErr += chunk.toString();
      // });

      // await new Promise<void>((resolve) => {
      //   reponseCompiler.on("exit", async (exitCode) => {
      //     exitCodeCompiler = exitCode;

      //     if (exitCode !== 0) {
      //       console.log("cpp compiler err");
      //       console.log(compilerErr);
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Failure",
      //           error: sanitizePathOutput(compilerErr),
      //         },
      //       });
      //     }
      //     resolve();
      //   });
      // });

      // if (exitCodeCompiler !== 0) {
      //   continue;
      // }

      // const response = spawn("./code/out");
      // response.stdout.on("data", (chunk) => {
      //   finalOutput += chunk.toString();
      // });
      // response.stderr.on("data", (chunk) => {
      //   finalErr += chunk.toString();
      // });

      // await new Promise<void>((resolve) => {
      //   response.on("exit", async (exitCode) => {
      //     console.log(exitCode);
      //     if (exitCode === 0) {
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Success",
      //           output: finalOutput,
      //         },
      //       });
      //     } else {
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Failure",
      //           error: sanitizePathOutput(finalErr),
      //         },
      //       });
      //     }
      //     resolve();
      //   });
      // });

      // sandboxing
      console.log("running cpp code ");
      const result = await executor.execute({
        language: "cpp",
        code,
        input: parsedResponse.input,
        submissionId,
      });

      sendResult(submissionId, result);
    }

    if (language === "js") {
      // const filePath = __dirname + "/code/a.js";
      // console.log("Running users js code");
      // fs.writeFileSync(filePath, code);
      // const response = spawn("node", [filePath]);

      // response.stdout.on("data", (chunk) => {
      //   finalOutput += chunk.toString();
      // });
      // response.stderr.on("data", (chunk) => {
      //   finalErr += chunk.toString();
      // });

      // await new Promise<void>((resolve) => {
      //   response.on("exit", async (exitCode) => {
      //     if (exitCode === 0) {
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Success",
      //           output: finalOutput,
      //         },
      //       });
      //     } else {
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Failure",
      //           error: sanitizePathOutput(finalErr),
      //         },
      //       });
      //     }
      //     resolve();
      //   });
      // });

      console.log("running js code ...");
      const result = await executor.execute({
        language: "javascript",
        code,
        input: parsedResponse.input,
        submissionId,
      });

      await sendResult(submissionId, result);
    }

    if (language === "py") {
      // const filePath = __dirname + "/code/a.py";
      // console.log("Running users python code");
      // fs.writeFileSync(filePath, code);
      // const response = spawn("python3", [filePath]);

      // response.stdout.on("data", (chunk) => {
      //   finalOutput += chunk.toString();
      // });
      // response.stderr.on("data", (chunk) => {
      //   finalErr += chunk.toString();
      // });

      // await new Promise<void>((resolve) => {
      //   response.on("exit", async (exitCode) => {
      //     if (exitCode === 0) {
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Success",
      //           output: finalOutput,
      //         },
      //       });
      //     } else {
      //       await prisma.submissions.update({
      //         where: {
      //           id: submissionId,
      //         },
      //         data: {
      //           status: "Failure",
      //           error: sanitizePathOutput(finalErr),
      //         },
      //       });
      //     }
      //     resolve();
      //   });
      // });

      console.log("running python code ...");
      const result = await executor.execute({
        language: "python",
        code,
        input: parsedResponse.input,
        submissionId,
      });

      sendResult(submissionId, result);
    }

    if (language === "java") {
      console.log("Running users JAVA code");

      //   const filePath = __dirname + "/code/Main.java";

      //   fs.writeFileSync(filePath, code);

      //   const responseCompiler = spawn("javac", [filePath]);

      //   let compilerErr = "";
      //   let exitCodeCompiler: number | null = null;

      //   responseCompiler.stderr.on("data", (chunk) => {
      //     compilerErr += chunk.toString();
      //   });

      //   await new Promise<void>((resolve) => {
      //     responseCompiler.on("exit", async (exitCode) => {
      //       exitCodeCompiler = exitCode;

      //       if (exitCode !== 0) {
      //         await prisma.submissions.update({
      //           where: {
      //             id: submissionId,
      //           },
      //           data: {
      //             status: "Failure",
      //             error: sanitizePathOutput(compilerErr),
      //           },
      //         });
      //       }

      //       resolve();
      //     });
      //   });

      //   if (exitCodeCompiler !== 0) {
      //     continue;
      //   }

      //   const response = spawn("java", ["-cp", __dirname + "/code", "Main"]);

      //   response.stdout.on("data", (chunk) => {
      //     finalOutput += chunk.toString();
      //   });

      //   response.stderr.on("data", (chunk) => {
      //     finalErr += chunk.toString();
      //   });

      //   await new Promise<void>((resolve) => {
      //     response.on("exit", async (exitCode) => {
      //       if (exitCode === 0) {
      //         await prisma.submissions.update({
      //           where: {
      //             id: submissionId,
      //           },
      //           data: {
      //             status: "Success",
      //             output: finalOutput,
      //           },
      //         });
      //       } else {
      //         await prisma.submissions.update({
      //           where: {
      //             id: submissionId,
      //           },
      //           data: {
      //             status: "Failure",
      //             error: sanitizePathOutput(finalErr),
      //           },
      //         });
      //       }

      //       resolve();
      //     });
      //   });
      // }

      // sandboxing
      const result = await executor.execute({
        language: "java",
        code,
        input: parsedResponse.input,
        submissionId,
      });

      await sendResult(submissionId, result);
    }
  }
});
