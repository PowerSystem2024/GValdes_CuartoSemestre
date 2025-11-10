"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buyNow } from "@/services/orders";

export default function CheckoutPage() {
    const router = useRouter();
    const params = useSearchParams();
    const productId = params.get("productId") || "";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!productId) { router.replace("/"); return; }
        if (!token) { router.replace(`/register?returnTo=${encodeURIComponent(`/checkout?productId=${productId}`)}`); return; }

        (async () => {
            try {
                const res = await buyNow(productId, token);
                router.replace(`/orders/${res.orderId}/pay`);
            } catch {
                router.replace(`/login?returnTo=${encodeURIComponent(`/checkout?productId=${productId}`)}`);
            }
        })();
    }, [router, params, productId]);

    return <p className="p-6">Procesando compra…</p>;
}
