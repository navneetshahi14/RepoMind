import { api, handleAPIError } from "./api";
import type { ChatMessage, Citation } from "@/types";

export interface ChatRequest {
  question: string;
  document_id?: string;
  session_id?: string;
  source_id?: string;
  source_type?: string;
  repo_id?: string;
}

export interface ChatResponse {
  answer: string;
  sources?: Citation[];
  session_id?: string;
}

export const chatService = {
  async chatWithPDF(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>("/chat/", {
        question: request.question,
        document_id: request.document_id,
        session_id: request.session_id,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async chatWithRepo(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>("/github-chat/", {
        question: request.question,
        repo_id: request.repo_id,
        session_id: request.session_id,
        source_id: request.source_id,
        source_type: request.source_type,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async streamChat(
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
      onComplete?.();
    } catch (error) {
      onError?.(error as Error);
    }
  },

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get<ChatMessage[]>(
        `/chat/history/${sessionId}`
      );
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getChatSessions(): Promise<{ id: string; title: string }[]> {
    try {
      const response = await api.get("/chat/sessions");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
