import { api } from "@/lib/api";
import { AuthResponse, User } from "@/types/auth";


// -- login
export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
  return data;
}


// -- getMe para pasar datos del usuario al front
export async function getMe(token: string) {
  const { data } = await api.get<{ user: User }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}

// -- registro
export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
  return data;
}
