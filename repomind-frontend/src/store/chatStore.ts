import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SourceType, ChatMessage } from "@/types";
import { generateId } from "@/lib/utils";

/**
 * One chat thread. Sessions are server-issued (POST /chat/sessions
 * returns a row with a real UUID + timestamps); the client never mints
 * an id locally anymore.
 */
export interface ChatSessionMeta {
  id: string;
  project_id: string;
  title: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface ChatState {
  /**
   * The source the user picked in the chat page sidebar. The chat
   * itself is project-scoped (RAG searches the whole project), but
   * the UI still surfaces the active source as a visual anchor.
   */
  activeSource: {
    id: string;
    name: string;
    type: SourceType;
  } | null;
  currentSessionId: string | null;
  messages: ChatMessage[];
  streamingMessageId: string | null;
  isStreaming: boolean;
  /**
   * Sessions the current user has opened in this project. Cached for
   * the sidebar. Hydrated from /chat/sessions on demand.
   */
  sessions: ChatSessionMeta[];

  setActiveSource: (source: {
    id: string;
    name: string;
    type: SourceType;
  } | null) => void;
  setSession: (sessionId: string | null) => void;
  setSessions: (sessions: ChatSessionMeta[]) => void;
  upsertSession: (session: ChatSessionMeta) => void;
  removeSession: (sessionId: string) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  appendToMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  /**
   * Replace local messages with the server's history for a session.
   * Used when the user switches to an existing session.
   */
  loadHistory: (sessionId: string, messages: ChatMessage[]) => void;
  setStreamingMessage: (id: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activeSource: null,
      currentSessionId: null,
      messages: [],
      streamingMessageId: null,
      isStreaming: false,
      sessions: [],

      setActiveSource: (source) => set({ activeSource: source }),

      setSession: (sessionId) =>
        set({
          currentSessionId: sessionId,
          // Clear any stale messages; the caller is expected to fetch
          // history next.
          messages: [],
          streamingMessageId: null,
          isStreaming: false,
        }),

      setSessions: (sessions) => set({ sessions }),

      upsertSession: (session) =>
        set((state) => {
          const idx = state.sessions.findIndex((s) => s.id === session.id);
          if (idx === -1) {
            return { sessions: [session, ...state.sessions] };
          }
          const next = state.sessions.slice();
          next[idx] = { ...next[idx], ...session };
          return { sessions: next };
        }),

      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          // If we just deleted the active session, drop the pointer.
          currentSessionId:
            state.currentSessionId === sessionId
              ? null
              : state.currentSessionId,
          messages:
            state.currentSessionId === sessionId ? [] : state.messages,
        })),

      addMessage: (message) => {
        const id = generateId();
        const newMessage: ChatMessage = {
          ...message,
          id,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
        return id;
      },

      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),

      appendToMessage: (id, content) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content: msg.content + content } : msg
          ),
        })),

      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        })),

      clearMessages: () => set({ messages: [] }),

      loadHistory: (sessionId, messages) =>
        set({
          currentSessionId: sessionId,
          messages,
          streamingMessageId: null,
          isStreaming: false,
        }),

      setStreamingMessage: (id) => set({ streamingMessageId: id }),

      setIsStreaming: (isStreaming) => set({ isStreaming }),
    }),
    {
      name: "repomind-chat",
      storage: createJSONStorage(() => localStorage),
      // Only persist the bare minimum: which session the user was on
      // (so a reload keeps them in the same thread) and the active
      // source visual. Messages and the sessions cache are
      // server-owned and re-hydrated on mount.
      partialize: (state) => ({
        activeSource: state.activeSource,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
