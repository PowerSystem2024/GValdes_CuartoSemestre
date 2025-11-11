// apps/frontend/src/lib/auth-storage.ts
const TOKEN_KEY = "botforce_token";
const USER_KEY = "botforce_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth:change"));   // 🔔
}

export function setUser(user: unknown) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth:change"));   // 🔔
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth:change"));   // 🔔
}
