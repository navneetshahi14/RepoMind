import axios, { type AxiosInstance, type AxiosError } from "axios";
import { APP_CONFIG } from "@/constants";

export const api: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("repomind_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("repomind_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export class APIError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

export function handleAPIError(error: unknown): APIError {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred";
    return new APIError(
      message,
      error.response?.status || 500,
      error.response?.data
    );
  }
  if (error instanceof Error) {
    return new APIError(error.message, 500);
  }
  return new APIError("An unexpected error occurred", 500);
}
