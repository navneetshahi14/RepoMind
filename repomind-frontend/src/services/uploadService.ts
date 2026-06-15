import { api, handleAPIError } from "./api";
import type { Source, SourceResponse, UploadProgress } from "@/types";

export interface UploadPDFResponse {
  sourceId: string;
  fileName: string;
  status: string;
}

/**
 * Convert a backend SourceResponse to the lightweight Source shape the UI
 * components consume (lowercase `type`, derived `name`, `chunks` not yet known).
 */
function toUiSource(resp: SourceResponse): Source {
  const isGithub = (resp.type || "").toUpperCase() === "GITHUB";
  return {
    id: resp.id,
    type: isGithub ? "github" : "pdf",
    name: resp.fileName || resp.sourceUrl || "Untitled",
    chunks: 0,
    createdAt: resp.createdAt,
    url: resp.sourceUrl ?? undefined,
  };
}

export const uploadService = {
  async uploadPDF(
    file: File,
    project_id: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadPDFResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<{
        source_id: string;
        file_name: string;
        status: string;
      }>(
        `/sources/upload/pdf?project_id=${encodeURIComponent(project_id)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );

      return {
        sourceId: response.data.source_id,
        fileName: response.data.file_name,
        status: response.data.status,
      };
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /** Project-scoped source listing. */
  async getSources(project_id: string): Promise<Source[]> {
    try {
      const response = await api.get<SourceResponse[]>(
        `/sources/project/${encodeURIComponent(project_id)}`
      );
      return response.data
        .filter((s) => (s.type || "").toUpperCase() === "PDF")
        .map(toUiSource);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  createUploadProgress(file: File): UploadProgress {
    return {
      file: file.name,
      progress: 0,
      status: "pending",
    };
  },

  /** Delete a single PDF Source. */
  async deleteSource(sourceId: string): Promise<void> {
    try {
      await api.delete(`/sources/${encodeURIComponent(sourceId)}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
