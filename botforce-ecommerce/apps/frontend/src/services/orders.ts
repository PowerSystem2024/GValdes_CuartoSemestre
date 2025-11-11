import { api } from "@/lib/api";

type RawBuyNow =
    | { orderId: string; status?: string; totalCents?: number; currency?: string }
    | { id: string; status?: string; totalCents?: number; currency?: string }
    | { order?: { id: string }; status?: string; totalCents?: number; currency?: string }
    | any;

export async function buyNow(productId: string, token: string) {
    const { data } = await api.post<RawBuyNow>(
        "/api/orders/buy-now",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    const orderId =
        data?.orderId ??
        data?.id ??
        data?.order?.id ??
        null;

    if (!orderId) {
        // Log útil para detectar el shape real desde Network tab
        console.error("buyNow(): respuesta inesperada", data);
        throw new Error("ORDER_ID_MISSING");
    }

    return {
        orderId,
        status: data?.status ?? "PENDING",
        totalCents: data?.totalCents ?? 0,
        currency: data?.currency ?? "ARS",
    };
}
