import { api, handleAPIError } from "./api";
import type { ArchitectureAnalysis } from "@/types";

/**
 * Backend response shape from /repo/{project_id}/architecture-summary.
 * The architecture is delivered as a single markdown document; the
 * UI repeats it for `overview` and `explanation` (which is the
 * existing behavior — no Mermaid graph is rendered in this version).
 */
interface BackendArchitectureResponse {
  overview: string;
  explanation: string;
  diagram: string;
}

export const architectureService = {
  /**
   * Generate the architecture summary for the given project.
   * Takes a `project_id` (not a `repoId`): the backend's RAG is
   * scoped to the project's sources, so the project is the unit
   * of analysis.
   */
  async analyzeArchitecture(
    project_id: string
  ): Promise<ArchitectureAnalysis> {
    try {
      const response = await api.post<BackendArchitectureResponse>(
        `/repo/${encodeURIComponent(project_id)}/architecture-summary`
      );
      return {
        overview: response.data.overview,
        explanation: response.data.explanation,
        diagram:
          response.data.diagram ||
          "flowchart TD\n  Project[Project] --> Code[Source Code]\n  Code --> Analysis[Architecture Analysis]",
        dependencies: [],
        edges: [],
        metrics: {
          modules: 0,
          services: 0,
          databases: 0,
          externals: 0,
        },
      };
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /** Back-compat alias used by older callers. */
  async getArchitecture(project_id: string): Promise<ArchitectureAnalysis> {
    return this.analyzeArchitecture(project_id);
  },
};
