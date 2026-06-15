import { api, handleAPIError } from "./api";
import type { ChatMessage, ChatSession } from "@/types";

/**
 * Payload for /chat/ (non-streaming) and /chat/stream.
 * Backend scopes the search to the chat session's project, so we
 * don't need to pass source_id / source_type here.
 */
export interface ChatRequest {
  sessionId: string;
  question: string;
  model?: string;
}

export interface ChatResponse {
  answer: string;
  messageId: string;
  sessionId: string;
  sources: Array<{
    id: string;
    chunkId: string;
    path: string;
    file: string;
    excerpt: string;
  }>;
}

export const chatService = {
  /**
   * Server-issued chat session for a project. Returns the created
   * session row (with the real id, timestamps, etc.). The caller
   * (typically ChatWindow) then sets it on the chatStore.
   */
  async createChatSession(
    project_id: string,
    title?: string,
  ): Promise<ChatSession> {
    try {
      const response = await api.post<ChatSession>("/chat/sessions", {
        project_id:project_id,
        title: title ?? null,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * All chat sessions for the current user, newest first. Used by
   * the chat sidebar to list history.
   */
  async listMySessions(): Promise<ChatSession[]> {
    try {
      const response = await api.get<ChatSession[]>("/chat/sessions");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * All chat sessions in a single project (newest first).
   */
  async listProjectSessions(project_id: string): Promise<ChatSession[]> {
    try {
      const response = await api.get<ChatSession[]>(
        `/chat/sessions/project/${project_id}`,
      );
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Delete a chat session (and its messages via cascade). 204 on success.
   */
  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Load a session's message history. Backend exposes this as
   * GET /messages/{session_id} (the /messages router). We map the
   * backend's snake_case + uppercase role to the frontend's
   * ChatMessage shape.
   */
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get<
        Array<{
          id: string;
          session_id: string;
          role: string;
          content: string;
          model?: string | null;
          created_at: string;
        }>
      >(`/messages/${sessionId}`);
      return response.data.map((m) => ({
        id: m.id,
        role: m.role.toLowerCase() as ChatMessage["role"],
        content: m.content,
        timestamp: m.created_at,
        model: m.model ?? undefined,
      }));
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Non-streaming RAG answer. Returns the full answer and the
   * citation sources the backend attached to the assistant message.
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>("/chat/", {
        sessionId: request.sessionId,
        question: request.question,
        model: request.model,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Streaming RAG answer. Hits /chat/stream which now returns a plain
   * text/plain body (token deltas concatenated). The caller passes in
   * callbacks for chunks / completion / error and an AbortSignal to
   * cancel mid-stream.
   */
  async streamChat(
    request: ChatRequest,
    callbacks: {
      onChunk: (chunk: string) => void;
      onComplete?: () => void;
      onError?: (error: Error) => void;
    },
    signal?: AbortSignal,
  ): Promise<void> {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("repomind_token")
          : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            session_id: request.sessionId,
            question: request.question,
            model: request.model,
          }),
          signal,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Buffer so we can decode utf-8 boundaries that straddle chunks.
      let pending = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });
        // Flush the buffer in one go; the server doesn't use any
        // framing protocol, so we just push the whole accumulated
        // text after each chunk read. Simpler than guessing split
        // points, and tokens typically arrive fast enough to feel
        // like a stream.
        if (pending) {
          callbacks.onChunk(pending);
          pending = "";
        }
      }
      // Flush any trailing bytes that the decoder may have buffered.
      const tail = decoder.decode();
      if (tail) callbacks.onChunk(tail);

      callbacks.onComplete?.();
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // Caller treats abort as a clean stop, not an error.
        return;
      }
      callbacks.onError?.(error as Error);
    }
  },
};
