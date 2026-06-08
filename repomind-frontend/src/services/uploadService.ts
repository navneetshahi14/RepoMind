import { api, handleAPIError } from "./api";
import type { Source, UploadProgress } from "@/types";

export interface UploadPDFResponse {
  document_id: string;
  filename: string;
  chunks: number;
  success: boolean;
  message?: string;
}

export interface UploadFileResponse {
  id: string;
  name: string;
  chunks: number;
  type: string;
}

export const uploadService = {
  async uploadPDF(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadPDFResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<UploadPDFResponse>("/upload/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async uploadMarkdown(file: File, onProgress?: (progress: number) => void) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload/markdown", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async uploadText(file: File, onProgress?: (progress: number) => void) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload/text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getSources(): Promise<Source[]> {
    try {
      const response = await api.get<Source[]>("/sources");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async deleteSource(id: string): Promise<void> {
    try {
      await api.delete(`/sources/${id}`);
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
};
