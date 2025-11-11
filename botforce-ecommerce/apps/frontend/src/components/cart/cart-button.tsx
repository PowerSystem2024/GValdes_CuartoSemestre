"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getCart,
    cartTotalCents,
    cartCount,
    increment,
    decrement,
    removeFromCart,
    clearCart,
} from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-storage";
import { api } from "@/lib/api";
import { toast } from "sonner";

function formatCurrency(cents: number, currency = "ARS", locale = "es-AR") {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

export default function CartButton() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(getCart());
    const [count, setCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const refresh = () => {
            setItems(getCart());
            setCount(cartCount());
        };
        refresh();
        window.addEventListener("cart:change", refresh);
        window.addEventListener("storage", refresh);
        return () => {
            window.removeEventListener("cart:change", refresh);
            window.removeEventListener("storage", refresh);
        };
    }, []);

    const totalCents = useMemo(() => cartTotalCents(), [items]);

    const handlePay = async () => {
        const token = getToken();
        if (!token) {
            setOpen(false);
            toast.info("Iniciá sesión para continuar con el pago");
            router.push("/login?returnTo=/cart");
            return;
        }

        try {
            const mpItems = items.map((p) => ({
                id: p.id,
                title: p.name,
                quantity: p.quantity ?? 1,
                unit_price: p.priceCents / 100,
                currency_id: p.currency ?? "ARS",
            }));

            toast.loading("Generando checkout…", { id: "mp" });

            const { data } = await api.post(
                "/api/payments/create",
                { items: mpItems },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            clearCart();
            toast.success("Redirigiendo a Mercado Pago", { id: "mp" });
            window.location.href = data.init_point;
        } catch {
            toast.error("No se pudo iniciar el pago");
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="secondary" className="relative">
                    Carrito
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                        {count}
                    </span>
                </Button>
            </SheetTrigger>

            {/* Panel derecho más amplio y con padding equilibrado */}
            <SheetContent side="right" className="w-[420px] sm:w-[460px] p-0">
                {/* Header */}
                <div className="px-5 py-4">
                    <SheetHeader>
                        <SheetTitle className="text-lg">Tu carrito</SheetTitle>
                    </SheetHeader>
                </div>
                <Separator />

                {/* Lista con scroll independiente */}
                <ScrollArea className="h-[calc(100vh-220px)]">
                    <div className="px-5">
                        {items.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground">
                                Aún no agregaste productos.
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {items.map((p) => (
                                    <li key={p.id} className="py-4">
                                        <div className="grid grid-cols-[56px_1fr_auto] gap-3 items-center">
                                            {/* Imagen */}
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {p.imageUrl ? (
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.name}
                                                    className="h-14 w-14 rounded-md object-cover ring-1 ring-border"
                                                />
                                            ) : (
                                                <div className="h-14 w-14 rounded-md bg-muted ring-1 ring-border" />
                                            )}

                                            {/* Info */}
                                            <div className="min-w-0">
                                                <div className="font-medium leading-tight line-clamp-2">{p.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatCurrency(p.priceCents, p.currency)} {p.currency ?? "ARS"}
                                                </div>
                                            </div>

                                            {/* Acciones + subtotal */}
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => decrement(p.id)}>
                                                        −
                                                    </Button>
                                                    <span className="w-6 text-center text-sm">{p.quantity}</span>
                                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => increment(p.id)}>
                                                        +
                                                    </Button>
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    {formatCurrency(p.priceCents * (p.quantity ?? 1), p.currency)}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                                    onClick={() => removeFromCart(p.id)}
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </ScrollArea>

                <Separator className="mt-2" />

                {/* Footer fijo con totales y CTAs */}
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-base font-semibold">{formatCurrency(totalCents)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            className="col-span-1"
                            onClick={() => {
                                clearCart();
                                toast.success("Carrito vaciado");
                            }}
                            disabled={items.length === 0}
                        >
                            Vaciar
                        </Button>

                        <Button
                            variant="secondary"
                            className="col-span-1"
                            onClick={() => {
                                setOpen(false);
                                router.push("/cart");
                            }}
                            disabled={items.length === 0}
                        >
                            Ver carrito
                        </Button>

                        <Button className="col-span-1" onClick={handlePay} disabled={items.length === 0}>
                            Pagar
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
