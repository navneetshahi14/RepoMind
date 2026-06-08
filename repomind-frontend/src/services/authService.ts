import { api, handleAPIError } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/types";

export const AUTH_TOKEN_KEY = "repomind_token";

export const authService = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/signup", data);
      this.setToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      this.setToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if the server call fails, we still clear the local token.
      console.error("Logout request failed:", error);
    } finally {
      this.clearToken();
    }
  },

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  },

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },
};
