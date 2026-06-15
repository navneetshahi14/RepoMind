import { api, handleAPIError } from "./api";
import type { RepoInfo, SourceResponse } from "@/types";

export interface UploadRepoResponse {
  sourceId: string;
  status: string;
}

function toUiRepo(resp: SourceResponse): RepoInfo {
  const repoName = (resp.sourceUrl || "").split("/").filter(Boolean).pop() ||
    "Repository"

  return {
    id: resp.id,
    name: repoName.replace(/\.git$/, ""),
    url: resp.sourceUrl || "",
    files: resp.files,
    chunks: resp.chunks,
    status: (resp.status || "PENDING").toLowerCase() as
      | "processing"
      | "ready"
      | "error",
    createdAt: resp.createdAt,
  };
}

export const githubService = {
  /**
   * Clone + index a GitHub repository. The new backend route lives at
   * `/sources/connect/github?project_id=...` (added in Phase 5). For now
   * the call will 404 until that route is wired; the page is still
   * project-scoped and the user can pick a project from the sidebar.
   */
  async uploadRepo(
    repoUrl: string,
    project_id: string
  ): Promise<UploadRepoResponse> {
    try {
      const response = await api.post<{
        source_id: string;
        status: string;
      }>(
        `/sources/connect/github?project_id=${encodeURIComponent(project_id)}`,
        { repo_url: repoUrl }
      );
      return {
        sourceId: response.data.source_id,
        status: response.data.status,
      };
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /** Project-scoped repo listing. */
  async getRepos(project_id: string): Promise<RepoInfo[]> {
    try {
      const response = await api.get<SourceResponse[]>(
        `/project/${encodeURIComponent(project_id)}/sources`,
        { params: { type: "GITHUB" } }
      );
      return response.data.map(toUiRepo);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /** Delete a single repo Source. */
  async deleteRepo(sourceId: string): Promise<void> {
    try {
      await api.delete(`/sources/${encodeURIComponent(sourceId)}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Delete a whole Project (and all of its Sources / chats via cascade).
   * Distinct from `deleteRepo` (which only kills a single GitHub Source).
   */
  async deleteProject(project_id: string): Promise<void> {
    try {
      await api.delete(`/project/${encodeURIComponent(project_id)}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
