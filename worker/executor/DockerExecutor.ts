import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export interface ExecuteOptions {
  language: "cpp" | "python" | "javascript" | "java";
  code: string;
  input?: string;
  submissionId: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class DockerExecutor {
  async execute(options: ExecuteOptions): Promise<ExecutionResult> {
    const tempDir = path.join(__dirname, "..", "temp", options.submissionId);

    fs.mkdirSync(tempDir, { recursive: true });

    try {
      let sourceFile = "";
      let image = "";

      switch (options.language) {
        case "cpp":
          sourceFile = "Main.cpp";
          image = "cpp-runner";
          break;

        case "python":
          sourceFile = "Main.py";
          image = "python-runner";
          break;

        case "javascript":
          sourceFile = "Main.js";
          image = "javascript-runner";
          break;

        case "java":
          sourceFile = "Main.java";
          image = "java-runner";
          break;
      }

      fs.writeFileSync(path.join(tempDir, sourceFile), options.code);
      fs.writeFileSync(path.join(tempDir, "input.txt"), options.input ?? "");

      let stdout = "";
      let stderr = "";

      const child = spawn("docker", [
        "run",

        "--rm",

        "--network=none",

        "--memory=256m",

        "--cpus=1",

        "--pids-limit=64",

        "--cap-drop=ALL",

        "--security-opt=no-new-privileges",

        "--read-only",

        "-v",
        `${tempDir}:/workspace`,

        image,
      ]);

      const timeout = 3000;

      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;

        child.kill("SIGKILL");
      }, timeout);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      const exitCode = await new Promise<number>((resolve) => {
        child.on("close", (code) => {
          clearTimeout(timer);
          resolve(code ?? -1);
        });
      });

      if (timedOut) {
        return {
          stdout: "",
          stderr: "Time Limit Exceeded",
          exitCode: -100,
        };
      }

      return {
        stdout,
        stderr,
        exitCode,
      };
    } finally {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      });
    }
  }
}
