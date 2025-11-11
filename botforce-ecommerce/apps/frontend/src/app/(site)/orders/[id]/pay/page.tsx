"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-storage";

export default function PayPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const token = getToken();
            if (!token) {
                router.replace(`/login?returnTo=/orders/${params.id}/pay`);
                return;
            }
            try {
                const { data } = await api.post(
                    `/api/payments/create-from-order/${params.id}`, 
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                window.location.href = data.init_point;
            } catch {
                router.replace("/cart");
            }
        })();
    }, [router, params.id]);

    return (
        <main className="container mx-auto px-4 py-10">
            Redirigiendo al checkout…
        </main>
    );
}
