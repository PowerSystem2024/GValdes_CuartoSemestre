"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buyNow } from "@/services/orders";

export default function CheckoutClient({ productId }: { productId: string }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token"); // si usás otro key, ajustalo acá

        if (!productId) {
            router.replace("/");
            return;
        }
        if (!token) {
            router.replace(`/register?returnTo=${encodeURIComponent(`/checkout?productId=${productId}`)}`);
            return;
        }

        (async () => {
            try {
                const res = await buyNow(productId, token);
                router.replace(`/orders/${res.orderId}/pay`);
            } catch {
                router.replace(`/login?returnTo=${encodeURIComponent(`/checkout?productId=${productId}`)}`);
            }
        })();
    }, [router, productId]);

    return <p className="p-6">Procesando compra…</p>;
}
