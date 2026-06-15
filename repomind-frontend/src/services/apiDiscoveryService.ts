import { api, handleAPIError } from "./api";
import type { APIEndpoint } from "@/types";

/**
 * One endpoint returned by the backend's static analyzer.
 * Already in the same shape the UI consumes (method + route), with
 * a couple of extras we surface in the listing.
 */
interface BackendAPIEndpoint {
  method: string;
  route: string;
  file: string;
  path: string;
  lineNumber?: number | null;
}

interface BackendAPIDiscoveryResponse {
  endpoints: BackendAPIEndpoint[];
}

function toUiEndpoint(b: BackendAPIEndpoint, index: number): APIEndpoint {
  const method = (b.method || "GET").toUpperCase();
  return {
    id: `${b.path}:${b.route}:${method}:${index}`,
    method: method as APIEndpoint["method"],
    route: b.route,
    file: b.file,
    path: b.path,
    lineNumber: b.lineNumber ?? undefined,
  };
}

export const apiDiscoveryService = {
  /**
   * Discover HTTP endpoints declared in the project's source files.
   * Pass a `project_id`; the backend joins Source → FileNode → Chunk
   * for that project and scans for FastAPI / Flask / Express routes.
   */
  async discoverAPIs(project_id: string): Promise<APIEndpoint[]> {
    try {
      const response = await api.post<BackendAPIDiscoveryResponse>(
        `/repo/${encodeURIComponent(project_id)}/api-discovery`
      );
      return response.data.endpoints.map((e, i) => toUiEndpoint(e, i));
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /** Back-compat alias. */
  async getDiscoveredAPIs(project_id: string): Promise<APIEndpoint[]> {
    return this.discoverAPIs(project_id);
  },
};
