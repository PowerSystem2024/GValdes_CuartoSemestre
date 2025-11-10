"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buyNow } from "@/services/orders";
import { saveBuyIntent } from "@/lib/intent";
import { Product } from "@/types/products";


function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(cents / 100);
}

export function ProductCard({ p }: { p: Product }) {
    const router = useRouter();

    const onBuy = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
            // guardamos intención y redirigimos a registro con returnTo
            saveBuyIntent(p.id, `/checkout?productId=${p.id}`);
            router.push(`/register?returnTo=${encodeURIComponent(`/checkout?productId=${p.id}`)}`);
            return;
        }

        try {
            const res = await buyNow(p.id, token);
            // Podés llevar al pago o al dashboard/orden creada
            router.push(`/orders/${res.orderId}/pay`);
        } catch (e) {
            // fallback: si falla por token vencido, forzamos login
            saveBuyIntent(p.id, `/orders`);
            router.push(`/login?returnTo=${encodeURIComponent(`/orders`)}`);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl ?? "/placeholder.svg"} alt={p.name} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between pt-2">
                    <span className="font-medium">{formatPrice(p.priceCents, p.currency)}</span>
                    <Button onClick={onBuy} size="sm">Comprar</Button>
                </div>
            </CardContent>
        </Card>
    );
}
