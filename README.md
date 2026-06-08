# 🧠 RepoMind

> **AI-Powered Multi-Source RAG Platform** — Chat with your PDFs and GitHub repositories, discover APIs, analyze architecture, and auto-generate READMEs.

RepoMind is a full-stack monorepo that combines **Retrieval-Augmented Generation (RAG)**, **GitHub repo analysis**, **API discovery**, **architecture diagramming**, and **Stripe-backed subscriptions** into a single product. Drop a PDF, connect a GitHub repo, and start asking questions — RepoMind indexes the content, retrieves the most relevant chunks, and answers with citations.

---

## ✨ Features

- 📄 **PDF Upload & Q&A** — Upload PDFs; they are chunked, embedded, and stored in a vector DB for retrieval-augmented chat.
- 🐙 **GitHub Repo Integration** — Connect any public/private repo; RepoMind clones it, indexes the source files, and answers code-level questions.
- 💬 **RAG Chat with Citations** — Streaming answers grounded in source chunks, with inline citations.
- 🔍 **API Discovery** — Auto-extract REST/HTTP endpoints from a repo's source code.
- 🏗️ **Architecture Analysis** — Generate architecture diagrams (Mermaid) from the repo structure.
- 📝 **README Generation** — Auto-generate a structured README for a connected repo.
- 🔐 **Authentication** — Email/password + OAuth (JWT-based).
- 💳 **Billing & Subscriptions** — Stripe Checkout + webhooks for plan upgrades (Pro tier).
- 📊 **Usage Limits** — Per-user usage tracking with plan-based caps.
- 🎨 **Modern UI** — Next.js 15 + React 19 + Radix UI + Tailwind + Mermaid + Framer Motion.

---

## 🧱 Architecture

```
RepoGPT/
├── repomind-backend/      # FastAPI + LangChain + Qdrant + PostgreSQL
└── repomind-frontend/     # Next.js 15 + React 19 + TypeScript + Tailwind
```

### Request Flow (RAG Chat)

```
User → Next.js UI → FastAPI /chat
                          ↓
                  Chat Service
                          ↓
              Embedding Service (OpenAI / HF / Ollama)
                          ↓
                  Qdrant Vector Search
                          ↓
                  Retrieved Chunks (with citations)
                          ↓
              LLM Service (OpenAI / Ollama)
                          ↓
                  Streamed Answer → UI
```

---

## 🛠️ Tech Stack

### Backend (`repomind-backend/`)
| Layer | Tools |
|---|---|
| **API** | FastAPI, Uvicorn |
| **AI / RAG** | LangChain, LangChain-OpenAI, LangChain-Ollama, LangChain-HuggingFace |
| **LLMs** | OpenAI, Ollama (local), HuggingFace |
| **Embeddings** | sentence-transformers, OpenAI |
| **Vector DB** | Qdrant |
| **PDF Parsing** | pypdf, pymupdf, pdfplumber |
| **GitHub** | gitpython, PyGithub |
| **Database** | PostgreSQL (via SQLAlchemy + psycopg2) |
| **Auth** | python-jose (JWT), passlib[bcrypt] |
| **Billing** | Stripe (Checkout, Webhooks, Subscriptions) |

### Frontend (`repomind-frontend/`)
| Layer | Tools |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19 RC, TypeScript |
| **Styling** | Tailwind CSS, tailwindcss-animate, class-variance-authority, tailwind-merge |
| **UI** | Radix UI primitives, lucide-react, framer-motion, sonner |
| **State** | Zustand, TanStack Query |
| **Forms** | react-hook-form, zod |
| **Markdown** | react-markdown, remark-gfm, react-syntax-highlighter, mermaid |
| **Charts** | recharts |
| **HTTP** | axios |

---

## 📂 Project Structure

### Backend
```
repomind-backend/
├── app/
│   ├── api/                # HTTP routers
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── billing.py
│   │   ├── upload.py
│   │   ├── chat.py
│   │   ├── github.py
│   │   ├── github_chat.py
│   │   ├── api_discovery.py
│   │   ├── architecture.py
│   │   └── readme.py
│   ├── services/           # Business logic
│   │   ├── llm_service.py
│   │   ├── embedding_service.py
│   │   ├── retrieval_service.py
│   │   ├── chat_service.py
│   │   ├── prompt_service.py
│   │   ├── chunking_service.py
│   │   ├── pdf_service.py
│   │   ├── qdrant_service.py
│   │   ├── github_service.py
│   │   ├── user_service.py
│   │   ├── analyzer/       # Repo analyzers
│   │   ├── auth/           # JWT + password + auth
│   │   ├── billing/        # Stripe
│   │   ├── limits/         # Usage caps
│   │   └── loader/         # GitHub repo cloner
│   ├── models/             # SQLAlchemy ORM models
│   ├── schema/             # Pydantic schemas
│   ├── database/           # DB connection, base, dependency
│   ├── middleware/         # Auth middleware
│   └── memory/             # In-memory session store
├── repos/                  # Cloned GitHub repos (runtime)
├── uploads/                # Uploaded PDFs (runtime)
├── main.py                 # FastAPI entry point
├── requirements.txt
└── .env
```

### Frontend
```
repomind-frontend/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Landing
│   │   ├── dashboard/
│   │   ├── chat/
│   │   ├── upload/
│   │   ├── github/
│   │   ├── architecture/
│   │   ├── api-discovery/
│   │   ├── readme/
│   │   ├── pricing/
│   │   ├── signin/
│   │   └── signup/
│   ├── components/
│   │   ├── landing/        # Hero, Features, Pricing, CTA, etc.
│   │   ├── layout/         # AppLayout, AppSidebar, AppHeader
│   │   ├── chat/           # ChatWindow, MessageBubble, MarkdownRenderer
│   │   ├── dashboard/      # StatsCard, EmptyState, LoadingState
│   │   ├── github/         # RepositoryCard, APIList
│   │   ├── markdown/       # MarkdownViewer, MermaidViewer
│   │   ├── upload/         # UploadDropzone, SourceCard
│   │   └── ui/             # Radix-based primitives
│   ├── features/auth/      # AuthShell, AuthForm, OAuthButtons
│   ├── services/           # API clients (api, auth, chat, github, ...)
│   ├── store/              # Zustand stores
│   ├── hooks/              # useMounted, useAutoScroll, ThemeToggle
│   ├── providers/
│   ├── lib/
│   ├── constants/
│   └── types/
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Python** 3.13+
- **Node.js** 20+ and **npm** / **pnpm** / **yarn**
- **PostgreSQL** (or any SQLAlchemy-compatible DB)
- **Qdrant** (local Docker or [Qdrant Cloud](https://cloud.qdrant.io))
- **OpenAI API key** (or run **Ollama** locally)
- **Stripe account** (for billing — optional in dev)

---

### 1️⃣ Backend Setup

```bash
cd repomind-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

Create `repomind-backend/.env`:
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=                       # leave empty for local

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/repomind

# Stripe (optional for dev)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRO_PRICE_ID=price_...
```

Start Qdrant (Docker):
```bash
docker run -p 6333:6333 qdrant/qdrant
```

Run the backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`.

---

### 2️⃣ Frontend Setup

```bash
cd repomind-frontend
npm install
```

Create `repomind-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_APP_NAME=RepoMind
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Multi-Source RAG Platform
```

Run the dev server:
```bash
npm run dev
```

App will be available at `http://localhost:3000`.

---

## 📜 Available Scripts

### Backend
| Command | Description |
|---|---|
| `uvicorn main:app --reload` | Run dev server with hot reload |
| `pip install -r requirements.txt` | Install dependencies |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Run dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint with ESLint |
| `npm run type-check` | TypeScript type check |

---

## 🔌 API Endpoints (Overview)

| Route | Purpose |
|---|---|
| `POST /auth/register` | Sign up |
| `POST /auth/login` | Sign in (returns JWT) |
| `GET  /user/me` | Current user |
| `PATCH /user/me` | Update profile |
| `POST /upload` | Upload a PDF source |
| `POST /chat` | RAG chat over indexed sources |
| `POST /github/connect` | Connect a GitHub repo |
| `POST /github/chat` | Chat over a connected repo |
| `POST /api-discovery` | Discover API endpoints in a repo |
| `POST /architecture` | Analyze repo architecture |
| `POST /readme` | Generate README for a repo |
| `POST /billing/checkout` | Create Stripe Checkout session |
| `POST /billing/webhook` | Stripe webhook receiver |

> Full schemas available at `http://localhost:8000/docs` (FastAPI auto-generated OpenAPI).

---

## 🗄️ Database Models

- **User** — account, auth, plan
- **Subscription** — Stripe subscription state
- **Usage** — per-user usage counters
- **Source** — uploaded PDFs / connected repos
- **ChatSession** — chat thread
- **Chat** — chat metadata
- **Message** — individual messages with citations

---

## 🧪 Development Notes

- **Venv & uploads/repos are gitignored** — they live in `repomind-backend/.gitignore`. Never commit `.env`.
- **React 19 RC** is pinned in the frontend — peer-dep warnings on install are expected.
- **Ollama fallback** — if you don't have an OpenAI key, the backend supports local models via `langchain-ollama`.
- **Mermaid diagrams** — architecture pages render diagrams client-side via `mermaid`.

---

## 🤝 Contributing

PRs welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT — see `LICENSE` (add one if not present).

---

Built with ❤️ using **FastAPI**, **LangChain**, **Qdrant**, **Next.js 15**, and **React 19**.
