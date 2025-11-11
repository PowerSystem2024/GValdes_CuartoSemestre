"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buyNow } from "@/services/orders";
import { saveBuyIntent } from "@/lib/intent";
import type { Product } from "@/types/products";
import { getToken, clearAuth } from "@/lib/auth-storage";
import AddToCartButton from "@/components/cart/add-to-cart-button";

function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(cents / 100);
}

export function ProductCard({ p }: { p: Product }) {
    const router = useRouter();

    const onBuy = async () => {
        const token = getToken();

        if (!token) {
            saveBuyIntent(p.id, `/checkout?productId=${p.id}`);
            router.push(`/register?returnTo=${encodeURIComponent(`/checkout?productId=${p.id}`)}`);
            return;
        }

        try {
            const res = await buyNow(p.id, token);
            if (res?.orderId) {
                router.push(`/orders/${res.orderId}/pay`);
            } else {
                router.push(`/orders`);
            }
        } catch (e) {
            clearAuth();
            saveBuyIntent(p.id, `/checkout?productId=${p.id}`);
            router.push(`/login?returnTo=${encodeURIComponent(`/checkout?productId=${p.id}`)}`);
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
                    <div className="flex gap-2">
                        <AddToCartButton
                            product={{
                                id: p.id,
                                name: p.name,
                                priceCents: p.priceCents,
                                currency: p.currency,
                                // normalizamos null -> undefined para que matchee el tipo esperado
                                imageUrl: p.imageUrl ?? undefined,
                            }}
                        />
                        <Button onClick={onBuy} size="sm">Comprar</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
