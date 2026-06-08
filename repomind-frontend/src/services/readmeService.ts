import { api, handleAPIError } from "./api";
import type { GeneratedReadme, ReadmeConfig } from "@/types";

interface BackendReadmeResponse {
  readme?: string;
  content?: string;
}

export const readmeService = {
  async generateReadme(
    repoId: string,
    config: Partial<ReadmeConfig>
  ): Promise<GeneratedReadme> {
    try {
      const response = await api.post<BackendReadmeResponse>(
        "/github/readme",
        {
          repo_id: repoId,
          ...config,
        }
      );

      const content = response.data.readme || response.data.content || "";

      return {
        content,
        generatedAt: new Date().toISOString(),
        config: {
          projectName: config.projectName || "",
          description: config.description || "",
          includeInstallation: config.includeInstallation ?? true,
          includeUsage: config.includeUsage ?? true,
          includeAPI: config.includeAPI ?? true,
          includeArchitecture: config.includeArchitecture ?? false,
          includeContributing: config.includeContributing ?? true,
          tone: config.tone || "professional",
        },
      };
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async downloadReadme(content: string, filename: string): Promise<void> {
    try {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
