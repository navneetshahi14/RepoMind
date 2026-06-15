import { api, handleAPIError } from "./api";
import type { GeneratedReadme, ReadmeConfig } from "@/types";

/**
 * Server's response wraps the markdown in `{content}`. We keep an
 * optional `readme` field for back-compat just in case the
 * field name ever changes.
 */
interface BackendReadmeResponse {
  content?: string;
  readme?: string;
}

export const readmeService = {
  /**
   * Generate a README for the given project using the provided
   * config. The backend's readme service folds the config flags
   * (sections, tone) into the prompt before calling the LLM.
   */
  async generateReadme(
    project_id: string,
    config: Partial<ReadmeConfig>
  ): Promise<GeneratedReadme> {
    try {
      // Send the config in the exact snake_case shape the Pydantic
      // schema expects (we'd previously been forwarding it verbatim
      // along with the wrong key names).
      const payload: Record<string, unknown> = {
        project_name: config.projectName ?? "",
        description: config.description ?? "",
        include_installation: config.includeInstallation ?? true,
        include_usage: config.includeUsage ?? true,
        include_api: config.includeAPI ?? true,
        include_architecture: config.includeArchitecture ?? false,
        include_contributing: config.includeContributing ?? true,
        tone: config.tone ?? "professional",
      };

      const response = await api.post<BackendReadmeResponse>(
        `/repo/${encodeURIComponent(project_id)}/generate-readme`,
        payload
      );

      const content = response.data.content || response.data.readme || "";

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
