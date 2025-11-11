// AddToCartButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import { addToCart, CartItem } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";
import type { ComponentProps } from "react";

type ButtonSize = ComponentProps<typeof Button>["size"];
type ButtonVariant = ComponentProps<typeof Button>["variant"];

type Props = {
    product: { id: string; name: string; priceCents: number; currency?: string; imageUrl?: string };
    quantityDefault?: number;
    onAdded?: () => void;
    size?: ButtonSize;            // ⬅️ nuevo
    variant?: ButtonVariant;      // ⬅️ opcional
    className?: string;           // ⬅️ opcional
};

export default function AddToCartButton({
    product,
    quantityDefault = 1,
    onAdded,
    size = "sm",
    variant = "secondary",
    className,
}: Props) {
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
        <Button onClick={handleAdd} disabled={loading} variant={variant} size={size} className={className}>
            {loading ? "Agregando..." : "Agregar al carrito"}
        </Button>
    );
}
