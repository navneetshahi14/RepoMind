import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserPreferences } from "@/types";

interface UIState extends UserPreferences {
  sidebarOpen: boolean;
  isUploading: boolean;
  uploadProgress: number;
  commandOpen: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setModel: (model: "llama3" | "phi3" | "gpt-4") => void;
  toggleStreaming: () => void;
  toggleShowSources: () => void;
  toggleCompactMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setCommandOpen: (open: boolean) => void;
  resetUpload: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      model: "llama3",
      streamingEnabled: true,
      showSources: true,
      compactMode: false,
      sidebarOpen: true,
      isUploading: false,
      uploadProgress: 0,
      commandOpen: false,

      setTheme: (theme) => set({ theme }),
      setModel: (model) => set({ model }),
      toggleStreaming: () =>
        set((state) => ({ streamingEnabled: !state.streamingEnabled })),
      toggleShowSources: () =>
        set((state) => ({ showSources: !state.showSources })),
      toggleCompactMode: () =>
        set((state) => ({ compactMode: !state.compactMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setUploading: (isUploading) => set({ isUploading }),
      setUploadProgress: (uploadProgress) => set({ uploadProgress }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      resetUpload: () => set({ isUploading: false, uploadProgress: 0 }),
    }),
    {
      name: "repomind-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        model: state.model,
        streamingEnabled: state.streamingEnabled,
        showSources: state.showSources,
        compactMode: state.compactMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
