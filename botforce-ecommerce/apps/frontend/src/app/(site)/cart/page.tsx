"use client";
import { useEffect, useState } from "react";
import {
    getCart,
    clearCart,
    increment,
    decrement,
    removeFromCart,
    cartTotalCents,
} from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-storage";
import { api } from "@/lib/api";
import { toast } from "sonner";

function formatCurrency(cents: number, currency = "ARS", locale = "es-AR") {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

export default function CartPage() {
    const [cart, setCart] = useState(getCart());
    const [loadingPay, setLoadingPay] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const refresh = () => setCart(getCart());
        refresh();
        window.addEventListener("cart:change", refresh);
        return () => window.removeEventListener("cart:change", refresh);
    }, []);

    const handlePay = async () => {
        if (cart.length === 0 || loadingPay) return;

        const token = getToken();
        if (!token) { router.push("/login?returnTo=/cart"); return; }

        // unit_price = priceCents / 100 (sin redondear)
        const items = cart.map((p) => ({
            id: p.id,
            title: p.name,
            quantity: p.quantity ?? 1,
            unit_price: p.priceCents / 100,
            currency_id: p.currency ?? "ARS",
        }));

        try {
            setLoadingPay(true);
            toast.loading("Generando checkout…", { id: "mp" });

            const { data } = await api.post(
                // Si usás proxy del frontend apuntando al backend, mantené /api/...
                // Si llamás directo al backend, asegurate que api.baseURL esté correcto.
                "/api/payments/create",
                { items },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            clearCart();
            toast.success("Redirigiendo a Mercado Pago", { id: "mp" });
            window.location.href = data.init_point;
        } catch (err: any) {
            // Manejo de errores útil para debug
            const msg =
                err?.response?.data?.error ||
                err?.message ||
                "No se pudo iniciar el pago";
            toast.error(msg, { id: "mp" });
            console.error("MP create preference error:", err);
        } finally {
            setLoadingPay(false);
        }
    };

    if (cart.length === 0) return (
        <main className="container mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-2">Carrito</h1>
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
        </main>
    );

    const totalCents = cartTotalCents();

    return (
        <main className="container mx-auto px-4 py-8 space-y-6">
            <h1 className="text-2xl font-bold">Carrito</h1>

            <ul className="divide-y">
                {cart.map((p) => (
                    <li key={p.id} className="py-4">
                        {/* Grid responsivo: imagen | info | qty | subtotal | quitar */}
                        <div className="grid items-center gap-4
                            grid-cols-1
                            md:grid-cols-[56px_1fr_auto_auto_auto]">
                            {/* Imagen */}
                            <div className="hidden md:block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="h-14 w-14 rounded-md object-cover ring-1 ring-border" />
                                ) : (
                                    <div className="h-14 w-14 rounded-md bg-muted ring-1 ring-border" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                                <div className="font-medium leading-tight line-clamp-2">{p.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {formatCurrency(p.priceCents, p.currency)} {p.currency ?? "ARS"}
                                </div>
                            </div>

                            {/* Qty */}
                            <div className="flex items-center justify-start md:justify-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => decrement(p.id)}>-</Button>
                                <span className="w-8 text-center">{p.quantity ?? 1}</span>
                                <Button variant="outline" size="sm" onClick={() => increment(p.id)}>+</Button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right font-medium">
                                {formatCurrency(p.priceCents * (p.quantity ?? 1), p.currency)}
                            </div>

                            {/* Quitar */}
                            <div className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => removeFromCart(p.id)}>
                                    Quitar
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Total + acciones */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
                <div className="text-lg font-semibold">
                    Total: {formatCurrency(totalCents)}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { clearCart(); }}>
                        Vaciar
                    </Button>
                    <Button onClick={handlePay} disabled={loadingPay}>
                        {loadingPay ? "Procesando…" : "Pagar con Mercado Pago"}
                    </Button>
                </div>
            </div>
        </main>
    );
}
