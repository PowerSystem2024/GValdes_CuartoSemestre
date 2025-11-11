const KEY = "botforce_cart";

export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function addToCart(product: any) {
  const cart = getCart();
  cart.push(product);
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(KEY);
}
