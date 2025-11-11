"use client";
import { Button } from "@/components/ui/button";
import { addToCart, CartItem } from "@/lib/cart";
import { useState } from "react";

type Props = {
    product: { id: string; name: string; priceCents: number; currency?: string; imageUrl?: string };
    quantityDefault?: number;
    onAdded?: () => void;
};

export default function AddToCartButton({ product, quantityDefault = 1, onAdded }: Props) {
    const [loading, setLoading] = useState(false);

    const handleAdd = () => {
        setLoading(true);
        const item: Omit<CartItem, "quantity"> = {
            id: product.id,
            name: product.name,
            priceCents: product.priceCents,
            currency: product.currency ?? "ARS",
            imageUrl: product.imageUrl,
        };
        addToCart(item, quantityDefault);
        setLoading(false);
        onAdded?.();
    };

    return (
        <Button onClick={handleAdd} disabled={loading}>
            {loading ? "Agregando..." : "Agregar al carrito"}
        </Button>
    );
}
