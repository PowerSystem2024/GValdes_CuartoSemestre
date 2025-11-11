// apps/frontend/src/lib/cart.ts
// Carrito namespaced por "owner" (guest o userId) + eventos para UI reactiva

export type CartItem = {
    id: string;
    name: string;
    priceCents: number;   // SIEMPRE en centavos
    currency?: string;    // "ARS" por defecto
    quantity: number;
    imageUrl?: string;
};

export type Cart = CartItem[];

// ---- claves nuevas
const CART_PREFIX = "cart:v2";                // cambia versión para cortar herencia antigua
const OWNER_KEY = "cart_owner";              // guarda el owner actual
const GUEST = "guest";

// ---- utilidades de owner
function getOwner(): string {
    if (typeof window === "undefined") return GUEST;
    return localStorage.getItem(OWNER_KEY) || GUEST;
}

function setOwner(owner: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(OWNER_KEY, owner || GUEST);
}

function keyFor(owner = getOwner()) {
    return `${CART_PREFIX}:${owner}`;
}

// ---- compat: migrar viejo cart:v1 → guest (una sola vez)
(function migrateV1ToGuest() {
    if (typeof window === "undefined") return;
    const old = localStorage.getItem("cart:v1");
    if (!old) return;
    try {
        const parsed = JSON.parse(old) as Cart;
        localStorage.setItem(keyFor(GUEST), JSON.stringify(parsed ?? []));
    } catch { }
    localStorage.removeItem("cart:v1");
})();

// ---- IO
function read(owner = getOwner()): Cart {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(keyFor(owner));
        return raw ? (JSON.parse(raw) as Cart) : [];
    } catch {
        return [];
    }
}

function write(cart: Cart, owner = getOwner()) {
    if (typeof window === "undefined") return;
    localStorage.setItem(keyFor(owner), JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart:change"));
}

// ---- API pública (usa owner actual)
export function getCart(owner?: string): Cart { return read(owner); }
export function setCart(next: Cart, owner?: string) { write(next, owner); }
export function clearCart(owner?: string) { write([], owner); }

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
    const cart = read();
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx >= 0) cart[idx].quantity += qty;
    else cart.push({ ...item, quantity: qty, currency: item.currency ?? "ARS" });
    write(cart);
}

export function removeFromCart(id: string) {
    write(read().filter(i => i.id !== id));
}

export function updateQuantity(id: string, qty: number) {
    write(read().map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
}

export function increment(id: string, step = 1) {
    write(read().map(i => i.id === id ? { ...i, quantity: i.quantity + step } : i));
}

export function decrement(id: string, step = 1) {
    write(read().map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - step) } : i));
}

export function cartCount(owner?: string): number {
    return read(owner).reduce((acc, i) => acc + i.quantity, 0);
}

export function cartTotalCents(owner?: string): number {
    return read(owner).reduce((acc, i) => acc + i.priceCents * i.quantity, 0);
}

// ---- owner control (para login/logout)
export function setCartOwner(userId: string | null, opts?: { migrateGuest?: boolean; clearCurrent?: boolean }) {
    const newOwner = userId ?? GUEST;
    const prevOwner = getOwner();

    // limpiar el carrito del owner actual si se pide
    if (opts?.clearCurrent) write([], prevOwner);

    // migrar guest → usuario (sumando cantidades por id)
    if (opts?.migrateGuest && newOwner !== GUEST) {
        const guestItems = read(GUEST);
        const userItems = read(newOwner);
        if (guestItems.length) {
            const map = new Map<string, CartItem>();
            [...userItems, ...guestItems].forEach(it => {
                const prev = map.get(it.id);
                if (prev) prev.quantity += (it.quantity ?? 1);
                else map.set(it.id, { ...it });
            });
            write(Array.from(map.values()), newOwner);
            write([], GUEST);
        }
    }

    setOwner(newOwner);
    window.dispatchEvent(new Event("cart:change"));
}
