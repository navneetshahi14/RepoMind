import { api, handleAPIError } from "./api";
import type { RepoInfo } from "@/types";

export interface UploadRepoRequest {
  repo_url: string;
}

export interface UploadRepoResponse {
  repo_id: string;
  files: number;
  chunks: number;
}

export const githubService = {
  async uploadRepo(repoUrl: string): Promise<UploadRepoResponse> {
    try {
      const response = await api.post<UploadRepoResponse>("/github/upload", {
        repo_url: repoUrl,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getRepoInfo(repoId: string): Promise<RepoInfo> {
    try {
      const response = await api.get<RepoInfo>(`/github/${repoId}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getRepos(): Promise<RepoInfo[]> {
    try {
      const response = await api.get<RepoInfo[]>("/github");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async deleteRepo(repoId: string): Promise<void> {
    try {
      await api.delete(`/github/${repoId}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
