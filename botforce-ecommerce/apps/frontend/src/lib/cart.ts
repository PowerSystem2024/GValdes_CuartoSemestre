// Manejo de carrito en localStorage + eventos para reactive UI
const KEY = "cart:v1";

export type CartItem = {
    id: string;
    name: string;
    priceCents: number; // SIEMPRE en centavos
    currency?: string;  // "ARS" por defecto
    quantity: number;
    imageUrl?: string;
};

export type Cart = CartItem[];

function read(): Cart {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Cart) : [];
    } catch {
        return [];
    }
}

function write(cart: Cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart:change"));
}

export function getCart(): Cart {
    return read();
}

export function clearCart() {
    write([]);
}

export function setCart(next: Cart) {
    write(next);
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
    const cart = read();
    const idx = cart.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
        cart[idx].quantity += qty;
    } else {
        cart.push({ ...item, quantity: qty, currency: item.currency ?? "ARS" });
    }
    write(cart);
}

export function removeFromCart(id: string) {
    const cart = read().filter((i) => i.id !== id);
    write(cart);
}

export function updateQuantity(id: string, qty: number) {
    const cart = read().map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
    write(cart);
}

export function increment(id: string, step = 1) {
    const cart = read().map((i) => (i.id === id ? { ...i, quantity: i.quantity + step } : i));
    write(cart);
}

export function decrement(id: string, step = 1) {
    const cart = read().map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity - step) } : i));
    write(cart);
}

export function cartCount(): number {
    return read().reduce((acc, i) => acc + i.quantity, 0);
}

export function cartTotalCents(): number {
    return read().reduce((acc, i) => acc + i.priceCents * i.quantity, 0);
}
