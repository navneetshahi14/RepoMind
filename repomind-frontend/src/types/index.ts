export type SourceType = "pdf" | "github" ;

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  chunks: number;
  createdAt: string;
  size?: number;
  url?: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sources?: Citation[];
  isStreaming?: boolean;
  model?: string;
}

export interface Citation {
  id: string;
  file: string;
  path: string;
  page?: number;
  score: number;
  excerpt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  sourceId: string;
  sourceType: SourceType;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface RepoInfo {
  id: string;
  name: string;
  url: string;
  files: number;
  chunks: number;
  status: "processing" | "ready" | "error";
  createdAt: string;
  description?: string;
  language?: string;
  stars?: number;
}

export interface APIEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  route: string;
  file: string;
  path: string;
  description?: string;
  parameters?: string[];
  lineNumber?: number;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: "module" | "service" | "database" | "external";
  path?: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureAnalysis {
  overview: string;
  explanation: string;
  diagram: string;
  dependencies: ArchitectureNode[];
  edges: ArchitectureEdge[];
  metrics: {
    modules: number;
    services: number;
    databases: number;
    externals: number;
  };
}

export interface ReadmeConfig {
  projectName: string;
  description: string;
  includeInstallation: boolean;
  includeUsage: boolean;
  includeAPI: boolean;
  includeArchitecture: boolean;
  includeContributing: boolean;
  tone: "professional" | "casual" | "technical";
}

export interface GeneratedReadme {
  content: string;
  generatedAt: string;
  config: ReadmeConfig;
}

export interface DashboardStats {
  totalSources: number;
  totalChats: number;
  totalMessages: number;
  totalRepos: number;
  recentActivity: number;
}

export interface UploadProgress {
  file: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  model: "llama3" | "phi3" | "gpt-4";
  streamingEnabled: boolean;
  showSources: boolean;
  compactMode: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  user: User;
}
