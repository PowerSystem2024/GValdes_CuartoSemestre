import { api } from "@/lib/api";

export async function buyNow(productId: string, token: string) {
  const { data } = await api.post("/api/orders/buy-now", { productId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data as { orderId: string; status: string; totalCents: number; currency: string };
}
