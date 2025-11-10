import { api } from "@/lib/api";

type User = { id: string; name: string; email: string; role: "USER" | "ADMIN" };
type AuthResponse = { user: User; token: string };

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
  return data; // { user, token }
}

export async function getMe(token: string) {
  const { data } = await api.get<{ user: User }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}
