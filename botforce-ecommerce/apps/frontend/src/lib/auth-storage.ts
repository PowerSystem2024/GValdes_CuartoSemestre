const TOKEN_KEY = "botforce_token";
const USER_KEY = "botforce_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setUser(user: unknown) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
