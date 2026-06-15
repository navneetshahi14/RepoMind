"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Project } from "@/types";
import { projectService } from "@/services/projectService";

interface ProjectState {
  projects: Project[];
  currentproject_id: string | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchProjects: () => Promise<Project[]>;
  createProject: (name: string, description?: string) => Promise<Project>;
  selectProject: (id: string | null) => void;
  deleteProject: (id: string) => Promise<void>;
  ensureDefaultProject: () => Promise<Project>;
  clear: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentproject_id: null,
      isLoading: false,
      error: null,
      hasFetched: false,

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const projects = await projectService.listProjects();
          set({ projects, isLoading: false, hasFetched: true });

          // If currentproject_id points at a project that's gone, clear it.
          const { currentproject_id } = get();
          if (
            currentproject_id &&
            !projects.some((p) => p.id === currentproject_id)
          ) {
            set({ currentproject_id: projects[0]?.id ?? null });
          }

          return projects;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to load projects";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      createProject: async (name, description) => {
        set({ isLoading: true, error: null });
        try {
          const project = await projectService.createProject({
            name,
            description,
          });
          set((state) => ({
            projects: [project, ...state.projects],
            currentproject_id: state.currentproject_id ?? project.id,
            isLoading: false,
            hasFetched: true,
          }));
          return project;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to create project";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      selectProject: (id) => set({ currentproject_id: id }),

      deleteProject: async (id) => {
        try {
          await projectService.deleteProject(id);
          set((state) => {
            const remaining = state.projects.filter((p) => p.id !== id);
            return {
              projects: remaining,
              currentproject_id:
                state.currentproject_id === id
                  ? (remaining[0]?.id ?? null)
                  : state.currentproject_id,
            };
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to delete project";
          set({ error: message });
          throw err;
        }
      },

      /**
       * Guarantees there is a project selected. If the user has none,
       * create a default "My Project" so the rest of the app (upload,
       * chat, github) always has a project_id to bind to.
       */
      ensureDefaultProject: async () => {
        const { currentproject_id, projects } = get();
        const current = projects.find((p) => p.id === currentproject_id);
        if (current) return current;

        // Try a fetch first in case projects haven't been loaded yet.
        let available = projects;
        if (get().projects.length === 0) {
          try {
            available = await get().fetchProjects();
          } catch {
            available = [];
          }
        }

        if (available.length > 0) {
          set({ currentproject_id: available[0].id });
          return available[0];
        }

        // No projects at all — create a default one.
        const project = await get().createProject(
          "My Project",
          "Default project"
        );
        return project;
      },

      clear: () =>
        set({
          projects: [],
          currentproject_id: null,
          isLoading: false,
          error: null,
          hasFetched: false,
        }),
    }),
    {
      name: "repomind-projects",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentproject_id: state.currentproject_id,
        // Don't persist the full projects list — refetch on mount.
        // Just remember the last-selected id so the user lands back
        // in the same project after a refresh.
      }),
    }
  )
);
