import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SourceType, ChatMessage, Citation, UserPreferences } from "@/types";
import { generateId } from "@/lib/utils";

interface ChatState {
  activeSource: {
    id: string;
    name: string;
    type: SourceType;
  } | null;
  currentSession: string | null;
  messages: ChatMessage[];
  streamingMessageId: string | null;
  isStreaming: boolean;

  setActiveSource: (source: {
    id: string;
    name: string;
    type: SourceType;
  } | null) => void;
  startSession: () => string;
  setSession: (sessionId: string | null) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  appendToMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  setStreamingMessage: (id: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  loadMessages: (messages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      activeSource: null,
      currentSession: null,
      messages: [],
      streamingMessageId: null,
      isStreaming: false,

      setActiveSource: (source) => set({ activeSource: source }),

      startSession: () => {
        const id = generateId();
        set({ currentSession: id, messages: [] });
        return id;
      },

      setSession: (sessionId) => set({ currentSession: sessionId }),

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

      setStreamingMessage: (id) => set({ streamingMessageId: id }),

      setIsStreaming: (isStreaming) => set({ isStreaming }),

      loadMessages: (messages) => set({ messages }),
    }),
    {
      name: "repomind-chat",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeSource: state.activeSource,
        currentSession: state.currentSession,
        messages: state.messages,
      }),
    }
  )
);
