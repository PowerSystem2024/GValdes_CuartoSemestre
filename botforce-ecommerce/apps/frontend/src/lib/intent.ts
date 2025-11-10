// Guardamos la intención para completar después del login/registro
const KEY = "intent:buy-now";

export function saveBuyIntent(productId: string, returnTo?: string) {
  const payload = { productId, returnTo: returnTo ?? "/dashboard?tab=orders" };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function consumeBuyIntent(): { productId: string; returnTo: string } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    const { productId, returnTo } = JSON.parse(raw);
    return productId ? { productId, returnTo: returnTo || "/dashboard?tab=orders" } : null;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}
