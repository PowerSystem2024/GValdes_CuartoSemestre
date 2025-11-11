"use client";
import { useEffect, useState } from "react";
import { getCart, clearCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-storage";
import { api } from "@/lib/api";

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => { setCart(getCart()); }, []);

    const handlePay = async () => {
        const token = getToken();
        if (!token) { router.push("/login?returnTo=/cart"); return; }

        // Mapear al formato MP
        const items = cart.map((p) => ({
            id: p.id,                                 // ← obligatorio
            title: p.name,
            quantity: p.quantity ?? 1,
            unit_price: Math.round(p.priceCents) / 100, // en unidades monetarias
            currency_id: p.currency ?? "ARS",
        }));

        const { data } = await api.post(
            "/api/payments/create",
            { items },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        clearCart();
        window.location.href = data.init_point; // redirige a MP Checkout
    };

    if (cart.length === 0) return <p className="p-6">Tu carrito está vacío.</p>;

    const total = cart.reduce((acc, p) => acc + (p.priceCents * (p.quantity ?? 1)), 0);

    return (
        <main className="container mx-auto px-4 py-8 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Carrito</h1>
            <ul className="divide-y">
                {cart.map((p) => (
                    <li key={p.id} className="py-2 flex justify-between">
                        <span>
                            {p.name}
                            {p.quantity ? <span className="text-muted-foreground"> × {p.quantity}</span> : null}
                        </span>
                        <span>${((p.priceCents * (p.quantity ?? 1)) / 100).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
            </div>
            <Button onClick={handlePay}>Pagar con Mercado Pago</Button>
        </main>
    );
}
