# RepoMind

> AI-Powered Multi-Source RAG Platform for GitHub Repositories and PDF Documents.

RepoMind is a full-stack application that ingests code from GitHub repositories and content from PDF documents, then lets you ask natural-language questions about them. It is built around a Retrieval-Augmented Generation (RAG) pipeline with semantic search, persistent chat sessions, and LLM-powered repository analysis (summaries, tech-stack detection, architecture diagrams, explainers, and auto-generated READMEs).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Architecture Overview](#architecture-overview)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 📸 Screenshots

### Landing Page

<p align="center">
  <img src="assest/landing.png" width="100%">
</p>

<h2>🔐 Authentication</h2>

<p align="center">
  <img src="assest/signin.png" width="48%">
  <img src="assest/signup.png" width="48%">
</p>

<h2>📊 Dashboard</h2>

<p align="center">
  <img src="assest/dashboard.png" width="100%">
</p>

<h2>📂 Source Upload</h2>

<p align="center">
  <img src="assest/GithubUpload.png" width="48%">
  <img src="assest/uploadPdf.png" width="48%">
</p>

<h2>💬 Chat Interface</h2>

<p align="center">
  <img src="assest/chatpage.png" width="100%">
</p>

<h2>🧠 Repository Analysis</h2>

<p align="center">
  <img src="assest/chatSection.png" width="100%">
</p>

---

## Features

### Core

- **Multi-source ingestion** — Connect a GitHub repository (cloned, parsed, chunked, embedded) or upload a PDF document.
- **RAG-powered chat** — Ask questions in natural language and receive streamed answers grounded in the ingested source, with file/path citations.
- **Persistent chat sessions** — Multiple sessions per project, full message history, per-message citations.
- **Semantic search** — Vector similarity search (Qdrant) over chunked content; results are joined back to Postgres for source attribution.

### Repository Analysis

- **Repository summary** — One-shot prose overview of the entire project.
- **Tech-stack detection** — Identifies the languages, frameworks, and tooling used.
- **Architecture summary** — High-level architectural narrative for the project.
- **File explainer** — Generates an explanation for a single file given its path.
- **Folder explainer** — Generates an explanation for a whole directory.
- **README generator** — Produces a complete `README.md` draft for the project.

### Frontend / UX

- **Project-based scoping** — Each user has Projects, each Project contains Sources (GitHub repos or PDFs) and Chat Sessions.
- **Streaming chat UI** — Token-by-token rendering with citation cards, code highlighting, Markdown + Mermaid rendering.
- **Dashboard** — Stats, recent sources, project overview.
- **Dark mode** — Theme switcher via `next-themes`.
- **Responsive** — Built with Radix UI primitives and Tailwind CSS.

### Auth & Security

- **JWT-based authentication** — `HS256` tokens, 24-hour expiry, bearer-token middleware.
- **Bcrypt password hashing** — Via `passlib`.
- **Per-user isolation** — All resources (Projects, Sources, Sessions, Messages) are scoped to the authenticated user.

---

## Tech Stack

### Frontend

| Category         | Technology                                                            |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | Next.js 15 (App Router)                                               |
| Language         | TypeScript 5                                                          |
| UI Library       | React 19 RC                                                           |
| Styling          | Tailwind CSS 3 + `tailwindcss-animate`                                |
| Components       | Radix UI primitives, `class-variance-authority`, `lucide-react` icons |
| State Management | Zustand (with `persist` middleware), TanStack React Query             |
| Forms            | React Hook Form + Zod                                                 |
| Markdown / Code  | `react-markdown`, `remark-gfm`, `react-syntax-highlighter`, `mermaid` |
| Animations       | Framer Motion                                                         |
| Toasts           | Sonner                                                                |
| HTTP Client      | Axios                                                                 |
| File Uploads     | `react-dropzone`                                                      |

### Backend

| Category         | Technology                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Framework        | FastAPI (Python 3.13)                                                                                 |
| ASGI Server      | Uvicorn                                                                                               |
| ORM              | SQLAlchemy 2.0 (Declarative + `Mapped[...]`)                                                          |
| Migrations       | Alembic                                                                                               |
| Auth             | `python-jose` (JWT), `passlib[bcrypt]`                                                                |
| Validation       | Pydantic + `pydantic-settings`                                                                        |
| AI Orchestration | LangChain + `langchain-community` + `langchain-openai` + `langchain-ollama` + `langchain-huggingface` |
| LLM Providers    | OpenAI (`gpt-4o-mini`), Ollama (`llama3`), Google Gemini (`gemini-2.5-flash`)                         |
| Embeddings       | OpenAI `text-embedding-3-small`, Ollama `nomic-embed-text`, HuggingFace `sentence-transformers`       |
| Vector Database  | Qdrant (local or Qdrant Cloud)                                                                        |
| PDF Processing   | `PyMuPDF` (`fitz`), `pypdf`, `pdfplumber`                                                             |
| GitHub Ingestion | `GitPython`, `PyGithub`                                                                               |
| Streaming        | `sse-starlette`                                                                                       |
| Async Files      | `aiofiles`                                                                                            |
| Token Counting   | `tiktoken`                                                                                            |

### Database

| Component        | Technology                         |
| ---------------- | ---------------------------------- |
| Primary Database | PostgreSQL (via `psycopg2-binary`) |
| Vector Store     | Qdrant                             |

### Other Tools

- **dotenv** — `.env` loading
- **httpx** / **requests** — Outbound HTTP
- **numpy**, **pandas** — Data utilities
- **alembic** — Schema migrations

---

## Project Structure

```
RepoGPT/
├── repomind-backend/                  # FastAPI + Python backend
│   ├── main.py                        # FastAPI app entry, CORS, lifespan, router mount
│   ├── requirements.txt               # Python dependencies
│   ├── alembic.ini                    # Alembic config
│   ├── alembic/                       # DB migration versions
│   ├── .env                           # Environment variables (gitignored)
│   └── app/
│       ├── core/
│       │   ├── config.py              # Pydantic Settings (LLM, DB, Qdrant, JWT, Stripe)
│       │   └── security.py            # JWT encode/decode, bcrypt hashing
│       ├── database/
│       │   ├── base.py                # SQLAlchemy DeclarativeBase
│       │   ├── connection.py          # engine + SessionLocal
│       │   └── dependencies.py        # get_db() FastAPI dependency
│       ├── dependencies/
│       │   └── auth_dependency.py     # HTTPBearer → current_user
│       ├── enums/
│       │   └── enum.py                # SourceType, SourceStatus, FileType, MessageRole, ProjectStatus, JobStatus
│       ├── models/                    # SQLAlchemy ORM
│       │   ├── user_model.py
│       │   ├── project_model.py
│       │   ├── source_model.py
│       │   ├── file_node_model.py
│       │   ├── chunk_model.py
│       │   ├── embedding_model.py
│       │   ├── chat_session_model.py
│       │   ├── message_model.py
│       │   ├── citation_model.py
│       │   └── processing_job_model.py
│       ├── repositories/              # Thin CRUD layer
│       ├── routes/                    # FastAPI APIRouters
│       │   ├── auth_route.py
│       │   ├── project_route.py
│       │   ├── source_route.py
│       │   ├── chat_session_route.py
│       │   ├── message_route.py
│       │   ├── chat_route.py          # /chat/stream (SSE/streaming)
│       │   └── repository_route.py    # /repo/* analyzers
│       ├── schema/                    # Pydantic request/response models
│       ├── services/                  # Business logic
│       │   ├── auth_services.py
│       │   ├── project_service.py
│       │   ├── source_service.py
│       │   ├── chat_session_service.py
│       │   ├── message_service.py
│       │   ├── chat_service.py
│       │   ├── rag_service.py
│       │   ├── search_service.py      # Qdrant + Postgres join
│       │   ├── citation_service.py
│       │   ├── chunking_service.py
│       │   ├── file_tree_service.py
│       │   ├── save_file_nodes_service.py
│       │   ├── save_chunks_service.py
│       │   ├── process_source_service.py
│       │   ├── process_pdf_service.py
│       │   ├── upload_pdf_service.py
│       │   ├── embedding_service.py
│       │   ├── qdrant_service.py
│       │   ├── github_service.py      # Clone + tree + chunks + embeddings
│       │   ├── pdf_service.py
│       │   ├── repository_summary_service.py
│       │   ├── tech_stack_service.py
│       │   ├── architecture_service.py
│       │   ├── explain_file_service.py
│       │   ├── explain_folder_service.py
│       │   └── readme_service.py
│       ├── prompt/                    # LLM prompt templates
│       ├── providers/
│       │   ├── llm_provider.py        # Provider-agnostic LLM factory
│       │   └── embedding_provider.py
│       └── utils/
│           ├── file_utils.py
│           ├── git_utils.py
│           └── llm_utils.py
│
└── repomind-frontend/                 # Next.js 15 + TypeScript frontend
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── src/
        ├── app/                       # App Router pages
        │   ├── layout.tsx             # Root layout (fonts, providers, toaster)
        │   ├── page.tsx               # Landing page
        │   ├── dashboard/page.tsx
        │   ├── chat/page.tsx
        │   ├── upload/page.tsx
        │   ├── github/page.tsx
        │   ├── architecture/page.tsx
        │   ├── api-discovery/page.tsx
        │   ├── readme/page.tsx
        │   ├── pricing/page.tsx
        │   ├── signin/page.tsx
        │   └── signup/page.tsx
        ├── components/
        │   ├── chat/                  # ChatWindow, MessageBubble, CitationCard, MarkdownRenderer, CodeBlock
        │   ├── layout/                # AppLayout, AppSidebar, AppHeader
        │   ├── upload/                # UploadDropzone, SourceCard
        │   ├── github/                # RepositoryCard, APIList
        │   ├── dashboard/             # StatsCard, EmptyState, LoadingState
        │   ├── markdown/              # MarkdownViewer, MermaidViewer
        │   ├── landing/               # Hero, Features, Architecture, HowItWorks, Pricing, CTA, Header, Footer
        │   └── ui/                    # Radix-based primitives (button, card, dialog, dropdown, etc.)
        ├── features/auth/             # AuthShell, AuthForm, OAuthButtons
        ├── services/                  # API client wrappers
        │   ├── api.ts                 # Axios instance, token interceptor, error handler
        │   ├── authService.ts
        │   ├── chatService.ts         # Includes SSE streaming
        │   ├── githubService.ts
        │   ├── uploadService.ts
        │   ├── architectureService.ts
        │   ├── apiDiscoveryService.ts
        │   ├── readmeService.ts
        │   └── projectService.ts
        ├── store/                     # Zustand stores
        │   ├── authStore.ts
        │   ├── chatStore.ts
        │   ├── sourceStore.ts
        │   ├── projectStore.ts
        │   └── uiStore.ts
        ├── hooks/                     # useMounted, useAutoScroll, ThemeToggle, useProjectContext
        ├── providers/                 # QueryClient + ThemeProvider
        ├── lib/utils.ts
        ├── constants/
        ├── types/                     # Shared TypeScript interfaces
        └── ...
```

---

## Installation

### Prerequisites

- **Python** 3.13+
- **Node.js** 20+ and **npm** (or pnpm/yarn)
- **PostgreSQL** 14+ (running locally or remote)
- **Qdrant** — either the local in-memory/embedded Qdrant, Docker, or [Qdrant Cloud](https://cloud.qdrant.io/)
- **Ollama** (optional) — for local LLM/embedding inference
- **Git** — for cloning GitHub repositories
- API keys for at least one of: **OpenAI**, **Google Gemini**, or use **Ollama** locally

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/RepoGPT.git
cd RepoGPT
```

### 2. Backend setup

```bash
cd repomind-backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file (see "Environment Variables" below)
cp .env.example .env   # or create one manually
```

### 3. Frontend setup

```bash
cd ../repomind-frontend

# Install dependencies
npm install
# or: pnpm install / yarn install

# Create a .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 4. Database setup

Create a PostgreSQL database:

```sql
CREATE DATABASE repomind;
```

The backend runs `Base.metadata.create_all(engine)` on startup (lifespan hook), so tables will be auto-created. For production deployments, use the Alembic migrations:

```bash
cd repomind-backend
alembic upgrade head
```

### 5. Qdrant setup

**Option A — Qdrant Cloud (recommended for getting started):**

- Create a free cluster at [cloud.qdrant.io](https://cloud.qdrant.io/)
- Copy the cluster URL and API key into your `.env`

**Option B — Local Docker:**

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

Then set `QDRANT_URL=http://localhost:6333` in `.env`.

### 6. (Optional) Ollama setup

```bash
# Install Ollama from https://ollama.com/download
ollama pull llama3
ollama pull nomic-embed-text
```

---

## Usage

### Run the backend

```bash
cd repomind-backend
# Make sure venv is activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Run the frontend

```bash
cd repomind-frontend
npm run dev
```

The app will be available at `http://localhost:3000`.

### Typical user flow

1. **Sign up** at `/signup` (or sign in at `/signin`).
2. **Create a Project** from the dashboard.
3. **Add a source** — either:
   - Upload a PDF from the `/upload` page, or
   - Paste a GitHub repo URL from the `/github` page.
4. **Wait for ingestion** — the source status will move from `PENDING` → `PROCESSING` → `COMPLETED`.
5. **Chat** — open the chat page, start a session, and ask questions about your source. The model will answer with citations.
6. **Analyze** — visit `/architecture`, `/api-discovery`, or `/readme` to run LLM-powered analyses on the ingested project.

---

## API Endpoints

All routes are mounted in `repomind-backend/main.py`.

### Auth

| Method | Path             | Description                                  |
| ------ | ---------------- | -------------------------------------------- |
| `POST` | `/auth/register` | Register a new user, returns JWT             |
| `POST` | `/auth/login`    | Login, returns JWT                           |
| `GET`  | `/auth/me`       | Current authenticated user (Bearer required) |

### Projects

| Method   | Path                    | Description                  |
| -------- | ----------------------- | ---------------------------- |
| `POST`   | `/project/`             | Create a new project         |
| `GET`    | `/project/`             | List current user's projects |
| `GET`    | `/project/{project_id}` | Get a specific project       |
| `DELETE` | `/project/{project_id}` | Delete a project             |

### Sources

| Method | Path                            | Description                                 |
| ------ | ------------------------------- | ------------------------------------------- |
| `POST` | `/sources/`                     | Create a source record                      |
| `GET`  | `/sources/project/{project_id}` | List sources for a project                  |
| `POST` | `/sources/upload/pdf`           | Upload and ingest a PDF (`?project_id=...`) |

### Chat Sessions

| Method | Path                          | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| `POST` | `/chat/sessions`              | Create a chat session in a project |
| `GET`  | `/chat/sessions/{project_id}` | List sessions for a project        |

### Messages

| Method | Path                     | Description                       |
| ------ | ------------------------ | --------------------------------- |
| `POST` | `/messages/`             | Persist a message                 |
| `GET`  | `/messages/{session_id}` | Get message history for a session |

### Chat

| Method | Path           | Description                         |
| ------ | -------------- | ----------------------------------- |
| `POST` | `/chat/stream` | Streaming RAG answer (token deltas) |

### Repository Analyzers

| Method | Path                                      | Description                        |
| ------ | ----------------------------------------- | ---------------------------------- |
| `POST` | `/repo/summary`                           | Repository summary                 |
| `GET`  | `/repo/tech-stack`                        | Tech-stack detection               |
| `GET`  | `/repo/generate-readme`                   | README generator                   |
| `POST` | `/repo/{project_id}/explain-file`         | Explain a file (`{file_path}`)     |
| `POST` | `/repo/{project_id}/explain-folder`       | Explain a folder (`{folder_path}`) |
| `POST` | `/repo/{project_id}/architecture-summary` | Architecture summary               |

### Health

| Method | Path | Description           |
| ------ | ---- | --------------------- |
| `GET`  | `/`  | Banner / health check |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend (React 19)                │
│  App Router · Zustand · TanStack Query · Radix UI · Tailwind     │
│                                                                  │
│  Pages: dashboard, chat, upload, github, architecture,          │
│         api-discovery, readme, signin, signup                    │
└──────────────────┬───────────────────────────────────────────────┘
                   │  Axios / fetch (SSE)  ── Bearer JWT
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Python 3.13)                   │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  AuthN/AuthZ│  │  APIRouters  │  │  Service Layer         │  │
│  │  JWT (jose) │  │  /auth,      │  │  RAG, chat, search,    │  │
│  │  bcrypt     │  │  /project,   │  │  chunking, embedding,  │  │
│  │             │  │  /sources,   │  │  GitHub ingest, PDF,   │  │
│  │             │  │  /chat,      │  │  analyzers             │  │
│  │             │  │  /messages,  │  │                        │  │
│  │             │  │  /repo       │  │                        │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│           │                                       │              │
│           ▼                                       ▼              │
│  ┌──────────────────┐                ┌──────────────────────┐    │
│  │ Repositories     │                │ LLM Provider         │    │
│  │ (thin CRUD)      │                │ (OpenAI/Ollama/Gem.) │    │
│  └────────┬─────────┘                └──────────────────────┘    │
└───────────┼──────────────────────────────────────────────────────┘
            │
            ▼
   ┌────────────────────┐         ┌────────────────────────┐
   │  PostgreSQL        │         │  Qdrant Vector Store   │
   │  (Users, Projects, │◀──join──│  (embeddings: chunks,  │
   │   Sources, Chunks, │         │   cosine similarity)   │
   │   Sessions, Msgs,  │         │                        │
   │   Citations)       │         │                        │
   └────────────────────┘         └────────────────────────┘
```

### RAG request flow

```
User question
  → POST /chat/stream  (SSE / text stream)
  → chat_service.stream_chat_with_repository
      → search_service.semantic_search   (Qdrant similarity)
      → Postgres join on chunk_id        (resolve file paths + content)
      → rag_service.build_context        (assemble grounded prompt)
      → LLM streaming                    (OpenAI / Ollama / Gemini)
      → tokens streamed back to client
      → Citation rows persisted on completion
```

### Data model

```
User (1) ──< Project (1) ──< Source (1) ──< FileNode (1) ──< Chunk (1) ──< Citation
User (1) ──< ChatSession (1) ──< Message (1) ──< Citation
```

Each model has a `TimestampMixin` (`created_at`, `updated_at`) and a `UUIDMixin` (Postgres UUID, default `uuid4`).

---

## Screenshots

> Placeholder: drop screenshots of the landing page, dashboard, chat, and analyzer pages here.

| Landing                                  | Dashboard                                    |
| ---------------------------------------- | -------------------------------------------- |
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Chat (with citations)              | Architecture                                       |
| ---------------------------------- | -------------------------------------------------- |
| ![Chat](docs/screenshots/chat.png) | ![Architecture](docs/screenshots/architecture.png) |

| PDF Upload                             | GitHub Ingest                          |
| -------------------------------------- | -------------------------------------- |
| ![Upload](docs/screenshots/upload.png) | ![GitHub](docs/screenshots/github.png) |

---

## Environment Variables

### Backend — `repomind-backend/.env`

| Variable                      | Required           | Description                                                                         |
| ----------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| `SECRET_KEY`                  | ✅                 | JWT signing secret (use a strong random value in production)                        |
| `DATABASE_URL`                | ✅                 | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/repomind` |
| `QDRANT_URL`                  | ✅                 | Qdrant endpoint, e.g. `http://localhost:6333` or a Qdrant Cloud URL                 |
| `QDRANT_API_KEY`              | ⚠️ if Qdrant Cloud | Qdrant API key                                                                      |
| `LLM_PROVIDER`                | ❌                 | `ollama` (default), `openai`, or `gemini`                                           |
| `OPENAI_API_KEY`              | ⚠️ if using OpenAI | OpenAI API key                                                                      |
| `OPENAI_MODEL`                | ❌                 | Default `gpt-4o-mini`                                                               |
| `GOOGLE_API_KEY`              | ⚠️ if using Gemini | Google AI Studio API key                                                            |
| `GEMINI_MODEL`                | ❌                 | Default `gemini-2.5-flash`                                                          |
| `OLLAMA_HOST`                 | ❌                 | Default `http://localhost:11434`                                                    |
| `OLLAMA_MODEL`                | ❌                 | Default `llama3`                                                                    |
| `OLLAMA_TIMEOUT`              | ❌                 | Default `120` (seconds)                                                             |
| `EMBEDDING_PROVIDER`          | ❌                 | `ollama` (default), `openai`, or `huggingface`                                      |
| `OLLAMA_EMBEDDING_MODEL`      | ❌                 | Default `nomic-embed-text`                                                          |
| `OPENAI_EMBEDDING_MODEL`      | ❌                 | Default `text-embedding-3-small`                                                    |
| `HUGGINGFACE_EMBEDDING_MODEL` | ❌                 | e.g. `sentence-transformers/all-MiniLM-L6-v2`                                       |
| `STRIPE_SECRET_KEY`           | ❌                 | Reserved for future billing integration                                             |
| `STRIPE_WEBHOOK_SECRET`       | ❌                 | Reserved for future billing integration                                             |
| `PRO_PRICE_ID`                | ❌                 | Reserved for future billing integration                                             |

### Frontend — `repomind-frontend/.env.local`

| Variable                      | Required | Description                                                    |
| ----------------------------- | -------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`         | ✅       | Backend URL, e.g. `http://localhost:8000`                      |
| `NEXT_PUBLIC_APP_NAME`        | ❌       | Display name, default `RepoMind`                               |
| `NEXT_PUBLIC_APP_DESCRIPTION` | ❌       | Marketing copy, default `AI-Powered Multi-Source RAG Platform` |
| `NEXT_PUBLIC_WS_URL`          | ❌       | WebSocket URL (reserved)                                       |

---

## Contributing

Contributions are welcome. To get started:

1. **Fork** the repository.
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install pre-commit** (recommended)
   ```bash
   pip install pre-commit
   pre-commit install
   ```
4. **Make your changes**
   - Backend: follow PEP 8, add type hints, write docstrings.
   - Frontend: follow the existing TypeScript conventions, run `npm run lint` and `npm run type-check`.
5. **Test locally**
   - Backend: `uvicorn main:app --reload`
   - Frontend: `npm run dev`
6. **Commit & push**
   ```bash
   git commit -m "feat: describe your change"
   git push origin feature/your-feature-name
   ```
7. **Open a pull request** with a clear description of the change.

### Code style

- **Backend**: PEP 8, type hints, modular services. Each `routes/` file should stay thin; put logic in `services/`.
- **Frontend**: ESLint (Next.js config), strict TypeScript. Keep state in Zustand stores, server state in TanStack Query.

---

## License

This project is released under the **MIT License**. See [`LICENSE`](LICENSE) for the full text.

---

<sub>Built with FastAPI · Next.js · LangChain · Qdrant · PostgreSQL.</sub>
