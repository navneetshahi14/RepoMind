import { api, handleAPIError } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/types";

export const AUTH_TOKEN_KEY = "repomind_token";

/**
 * Backend response from /auth/register and /auth/login only contains
 * { access_token, token_type } — no user payload. The frontend expects
 * { accessToken, user }, so after a successful login/register we always
 * follow up with /auth/me to populate the user.
 */
async function fetchUserAndAssemble(
  raw: { access_token: string; token_type: string }
): Promise<AuthResponse> {
  authService.setToken(raw.access_token);
  const user = await authService.getCurrentUser();
  return {
    accessToken: raw.access_token,
    tokenType: raw.token_type,
    user,
  };
}

export const authService = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
      }>("/auth/register", data);
      return await fetchUserAndAssemble(response.data);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
      }>("/auth/login", data);
      return await fetchUserAndAssemble(response.data);
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

  // No backend /auth/logout route — JWT is stateless; clearing the local
  // token is sufficient.
  async logout(): Promise<void> {
    authService.clearToken();
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
