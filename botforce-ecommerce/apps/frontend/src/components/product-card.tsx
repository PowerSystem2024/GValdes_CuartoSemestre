"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { buyNow } from "@/services/orders";
import { saveBuyIntent } from "@/lib/intent";
import type { Product } from "@/types/products";
import { getToken, clearAuth } from "@/lib/auth-storage";
import AddToCartButton from "@/components/cart/add-to-cart-button";
import { api } from "@/lib/api"; // ⬅️ IMPORTANTE

function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(
        cents / 100
    );
}

export function ProductCard({ p }: { p: Product }) {
    const router = useRouter();


    // -- Deprecado
    // const onBuy = async () => {
    //     const token = getToken();
    //     if (!token) {
    //         saveBuyIntent(p.id, `/checkout?productId=${p.id}`);
    //         router.push(`/register?returnTo=${encodeURIComponent(`/checkout?productId=${p.id}`)}`);
    //         return;
    //     }

    //     try {
    //         const res = await buyNow(p.id, token); // { orderId }
    //         if (!res?.orderId) throw new Error("buyNow no devolvió orderId");
    //         router.push(`/orders/${res.orderId}/pay`);
    //     } catch (e) {
    //         console.error("onBuy error:", e);
    //         clearAuth();
    //         saveBuyIntent(p.id, `/checkout?productId=${p.id}`);
    //         router.push(`/login?returnTo=${encodeURIComponent(`/checkout?productId=${p.id}`)}`);
    //     }
    // };


    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={p.imageUrl ?? "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                />
            </CardHeader>

            <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold line-clamp-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-3 mt-auto border-t flex items-center justify-between">
                <span className="font-medium">{formatPrice(p.priceCents, p.currency)}</span>
                <AddToCartButton
                    product={{
                        id: p.id,
                        name: p.name,
                        priceCents: p.priceCents,
                        currency: p.currency,
                        imageUrl: p.imageUrl ?? undefined,
                    }}
                    size="sm"
                />
            </CardFooter>
                {/*
                El botón de comprar lo comento para simplificar el
                flujo de trabajo. Me está generando mucho problemas
                ir por order:id por lo cual, para mejor manejo, el cliente
                solo se limita a añadir los productos elegidos a un carro
                y desde ahí disparamos al checkout
                */}
                {/* <Button onClick={onBuy} size="sm">
                    Comprar
                </Button> */}
        </Card >
    );
}
