"use client";
import { Button } from "@/components/ui/button";
import { addToCart, CartItem } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    product: { id: string; name: string; priceCents: number; currency?: string; imageUrl?: string };
    quantityDefault?: number;
    onAdded?: () => void;
};

export default function AddToCartButton({ product, quantityDefault = 1, onAdded }: Props) {
    const [loading, setLoading] = useState(false);

    const handleAdd = () => {
        if (loading) return;
        setLoading(true);

        const item: Omit<CartItem, "quantity"> = {
            id: product.id,
            name: product.name,
            priceCents: product.priceCents,
            currency: product.currency ?? "ARS",
            imageUrl: product.imageUrl,
        };

        addToCart(item, quantityDefault);
        toast.success(`"${product.name}" agregado al carrito 🛒`);

        setLoading(false);
        onAdded?.();
    };

    return (
        <Button onClick={handleAdd} disabled={loading} variant="secondary" size="sm">
            {loading ? "Agregando..." : "Agregar al carrito"}
        </Button>
    );
}
