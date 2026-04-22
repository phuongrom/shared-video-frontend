import { api } from "./client";
import type { AuthResponse, User } from "../types";

export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  me: () => api.get<{ user: User }>("/auth/me"),
};
