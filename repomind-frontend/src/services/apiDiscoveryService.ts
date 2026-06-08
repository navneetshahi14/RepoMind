import { api, handleAPIError } from "./api";
import type { APIEndpoint } from "@/types";

interface BackendAPIGroup {
  file: string;
  apis: string[];
}

interface BackendAPIResponse {
  apis: BackendAPIGroup[];
}

function inferMethod(value: string): APIEndpoint["method"] {
  const lower = value.toLowerCase();
  if (lower.includes("post")) return "POST";
  if (lower.includes("put")) return "PUT";
  if (lower.includes("delete")) return "DELETE";
  if (lower.includes("patch")) return "PATCH";
  return "GET";
}

function toEndpoints(response: BackendAPIResponse): APIEndpoint[] {
  return response.apis.flatMap((group, groupIndex) =>
    group.apis.map((apiName, apiIndex) => ({
      id: `${group.file}-${groupIndex}-${apiIndex}`,
      method: inferMethod(apiName),
      route: apiName,
      file: group.file,
      path: group.file,
    }))
  );
}

export const apiDiscoveryService = {
  async discoverAPIs(repoId: string): Promise<APIEndpoint[]> {
    try {
      const response = await api.post<BackendAPIResponse>(
        "/github/apis",
        { repo_id: repoId }
      );
      return toEndpoints(response.data);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getDiscoveredAPIs(repoId: string): Promise<APIEndpoint[]> {
    try {
      const response = await api.post<BackendAPIResponse>(
        "/github/apis",
        { repo_id: repoId }
      );
      return toEndpoints(response.data);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
