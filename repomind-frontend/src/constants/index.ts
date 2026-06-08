export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "RepoMind",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "AI-Powered Multi-Source RAG Platform",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
} as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const SUPPORTED_FILE_TYPES = {
  pdf: { extensions: [".pdf"], mimeTypes: ["application/pdf"], label: "PDF" },
  markdown: {
    extensions: [".md", ".markdown"],
    mimeTypes: ["text/markdown", "text/x-markdown"],
    label: "Markdown",
  },
  text: {
    extensions: [".txt"],
    mimeTypes: ["text/plain"],
    label: "Text",
  },
} as const;

export const SUPPORTED_GITHUB_EXTENSIONS = [
  ".py",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".java",
  ".cpp",
  ".c",
  ".md",
  ".txt",
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const QUERY_KEYS = {
  sources: ["sources"] as const,
  chats: ["chats"] as const,
  chatHistory: (sessionId: string) => ["chat-history", sessionId] as const,
  repoInfo: (repoId: string) => ["repo-info", repoId] as const,
  apis: (repoId: string) => ["apis", repoId] as const,
  architecture: (repoId: string) => ["architecture", repoId] as const,
  readme: (repoId: string) => ["readme", repoId] as const,
  stats: ["stats"] as const,
} as const;

export const THEMES = {
  light: "light",
  dark: "dark",
  system: "system",
} as const;
