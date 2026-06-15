"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";

/**
 * Mounts inside AppLayout. Whenever the user is authenticated, fetch
 * their projects and guarantee a project is selected. If they have
 * no projects, one is created automatically so the rest of the app
 * always has a project_id to bind to.
 *
 * Returns the current project_id (or null while loading).
 */
export function useProjectContext(): {
  project_id: string | null;
  isReady: boolean;
} {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentproject_id = useProjectStore((s) => s.currentproject_id);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const ensureDefaultProject = useProjectStore(
    (s) => s.ensureDefaultProject
  );
  const hasFetched = useProjectStore((s) => s.hasFetched);

  useEffect(() => {
    if (!isAuthenticated) {
      // Reset on logout.
      useProjectStore.getState().clear();
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (!hasFetched) {
          await fetchProjects();
        }
        if (cancelled) return;
        await ensureDefaultProject();
      } catch (err) {
        // Best-effort: pages will still render and the user can manually
        // trigger a project from the sidebar.
        console.warn("Project context setup failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, hasFetched, fetchProjects, ensureDefaultProject]);

  return {
    project_id: currentproject_id,
    isReady: !!currentproject_id,
  };
}
