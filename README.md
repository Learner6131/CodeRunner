# 🚀 CodeRunner

A production-inspired **Online Code Execution Platform** that allows users to write, compile, and execute code in multiple programming languages through a clean web interface.

Unlike traditional online compilers, CodeRunner is designed with a scalable backend architecture using a **Worker + Queue** model and executes user code inside **isolated Docker containers** for improved security.

---

## ✨ Features

### 💻 Code Editor

- Monaco Editor
- Syntax highlighting
- Multiple language support
- Input support (stdin)
- Output console
- Error console

### ⚙️ Supported Languages

- C++
- Python
- Java
- JavaScript

### 🚀 Execution Engine

- Queue-based execution
- Dedicated worker service
- Docker container execution
- Automatic compilation for compiled languages
- Runtime error handling
- Compilation error handling
- Standard input support
- Time Limit Exceeded (TLE) handling

### 🔒 Sandbox Features

- Docker-based isolation
- Separate container for every execution
- CPU limits
- Memory limits
- Process limits
- Network disabled
- Non-root execution
- Read-only filesystem

---

# 🏗️ Architecture

```
                   Client
                      │
                      ▼
              Express Backend
                      │
                      ▼
                Redis Queue
                      │
                      ▼
                 Worker Service
                      │
                      ▼
              Docker Executor
                      │
                      ▼
             Docker Container
                      │
        Compile → Execute → Output
                      │
                      ▼
               PostgreSQL Database
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Monaco Editor
- Tailwind CSS

## Backend

- Node.js
- Express
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Queue

- Redis

## Sandbox

- Docker

## Other

- Child Process API
- Bun Runtime

---

# 📂 Project Structure

```
CodeRunner/

├── frontend/
│
├── backend/
│
├── worker/
│   ├── executor/
│   ├── docker/
│   │    ├── cpp/
│   │    ├── python/
│   │    ├── java/
│   │    └── javascript/
│   ├── temp/
│   └── index.ts
│
└── README.md
```

---

# ⚙️ How It Works

```
User Writes Code
        │
        ▼
Frontend sends request
        │
        ▼
Backend stores submission
        │
        ▼
Redis Queue
        │
        ▼
Worker picks job
        │
        ▼
Create temporary workspace
        │
        ▼
Write source code
        │
        ▼
Start Docker container
        │
        ▼
Compile (if required)
        │
        ▼
Execute program
        │
        ▼
Capture stdout / stderr
        │
        ▼
Update database
        │
        ▼
Return result to client
```

---

# 🔒 Security

Every execution runs inside a dedicated Docker container.

Current security measures include:

- Isolated filesystem
- Non-root execution
- Disabled networking
- CPU limits
- Memory limits
- Process limits
- Read-only root filesystem
- Automatic cleanup

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Learner6131/CodeRunner.git

cd CodeRunner
```

---

## Install Dependencies

Backend

```bash
cd backend
bun install
```

Worker

```bash
cd worker
bun install
```

Frontend

```bash
cd frontend
bun install
```

---

## Configure Environment Variables

Create a `.env` file.

Example

```env
DATABASE_URL=
REDIS_URL=
```

---

## Start Redis

```bash
docker run -d -p 6379:6379 redis
```

---

## Build Docker Runner Images

Example (C++)

```bash
cd worker/docker/cpp

docker build -t cpp-runner .
```

Repeat for Python, Java and JavaScript runners.

---

## Run Backend

```bash
cd backend

bun run dev
```

---

## Run Worker

```bash
cd worker

bun run dev
```

---

## Run Frontend

```bash
cd frontend

bun run dev
```

---

# 📌 Current Features

- Multi-language execution
- Docker sandbox
- Input support
- Queue-based architecture
- Worker service
- Execution history
- Compilation errors
- Runtime errors
- TLE handling

---

# 🎯 Why This Project?

Most online code editors directly execute code on the host machine.

CodeRunner is designed around production-inspired backend principles:

- Worker architecture
- Redis queues
- Docker sandboxing
- Isolated execution
- Resource limits
- Scalable execution engine

The goal is to demonstrate backend engineering, distributed systems concepts, and secure code execution.

---

# 📸 Screenshots

> Add screenshots here.

- Home Page
- Monaco Editor
- Code Execution
- Compilation Error
- Runtime Error

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you found this project useful, consider giving it a star!
