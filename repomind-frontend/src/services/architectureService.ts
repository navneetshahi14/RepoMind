import { api, handleAPIError } from "./api";
import type { ArchitectureAnalysis } from "@/types";

interface BackendArchitectureResponse {
  architecture: string;
}

function toArchitectureAnalysis(response: BackendArchitectureResponse): ArchitectureAnalysis {
  return {
    overview: response.architecture,
    explanation: response.architecture,
    diagram: "flowchart TD\n  Repo[Repository] --> Code[Source Code]\n  Code --> Analysis[Architecture Analysis]",
    dependencies: [],
    edges: [],
    metrics: {
      modules: 0,
      services: 0,
      databases: 0,
      externals: 0,
    },
  };
}

export const architectureService = {
  async analyzeArchitecture(repoId: string): Promise<ArchitectureAnalysis> {
    try {
      const response = await api.post<BackendArchitectureResponse>(
        "/github/architecture",
        { repo_id: repoId }
      );
      return toArchitectureAnalysis(response.data);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getArchitecture(repoId: string): Promise<ArchitectureAnalysis> {
    try {
      const response = await api.post<BackendArchitectureResponse>(
        "/github/architecture",
        { repo_id: repoId }
      );
      return toArchitectureAnalysis(response.data);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
