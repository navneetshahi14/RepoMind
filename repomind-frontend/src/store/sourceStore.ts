import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Source, RepoInfo } from "@/types";

interface SourceState {
  sources: Source[];
  repos: RepoInfo[];
  selectedSourceId: string | null;
  selectedRepoId: string | null;

  setSources: (sources: Source[]) => void;
  addSource: (source: Source) => void;
  removeSource: (id: string) => void;
  setSelectedSource: (id: string | null) => void;

  setRepos: (repos: RepoInfo[]) => void;
  addRepo: (repo: RepoInfo) => void;
  removeRepo: (id: string) => void;
  setSelectedRepo: (id: string | null) => void;
  updateRepo: (id: string, updates: Partial<RepoInfo>) => void;
}

export const useSourceStore = create<SourceState>()(
  persist(
    (set) => ({
      sources: [],
      repos: [],
      selectedSourceId: null,
      selectedRepoId: null,

      setSources: (sources) => set({ sources }),
      addSource: (source) =>
        set((state) => ({ sources: [source, ...state.sources] })),
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== id),
          selectedSourceId:
            state.selectedSourceId === id ? null : state.selectedSourceId,
        })),
      setSelectedSource: (id) => set({ selectedSourceId: id }),

      setRepos: (repos) => set({ repos }),
      addRepo: (repo) => set((state) => ({ repos: [repo, ...state.repos] })),
      removeRepo: (id) =>
        set((state) => ({
          repos: state.repos.filter((r) => r.id !== id),
          selectedRepoId:
            state.selectedRepoId === id ? null : state.selectedRepoId,
        })),
      setSelectedRepo: (id) => set({ selectedRepoId: id }),
      updateRepo: (id, updates) =>
        set((state) => ({
          repos: state.repos.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
    }),
    {
      name: "repomind-sources",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
