import { api, handleAPIError } from "./api";
import type {
  Project,
  ProjectCreateRequest,
  SourceResponse,
} from "@/types";

export const projectService = {
  async listProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>("/project/");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getProject(project_id: string): Promise<Project> {
    try {
      const response = await api.get<Project>(`/project/${project_id}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async createProject(
    payload: ProjectCreateRequest
  ): Promise<Project> {
    try {
      const response = await api.post<Project>("/project/", payload);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async deleteProject(project_id: string): Promise<void> {
    try {
      await api.delete(`/project/${project_id}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async listProjectSources(
    project_id: string,
    sourceType?: "PDF" | "GITHUB"
  ): Promise<SourceResponse[]> {
    try {
      const params = sourceType ? { type: sourceType } : undefined;
      const response = await api.get<SourceResponse[]>(
        `/project/${project_id}/sources`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
