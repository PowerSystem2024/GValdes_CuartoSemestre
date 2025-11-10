import { api } from "@/lib/api";
import { Product } from "@/types/products";


export async function listProducts(params?: { page?: number; pageSize?: number }) {
  const { page = 1, pageSize = 12 } = params || {};
  const { data } = await api.get<{ items: Product[]; total: number; page: number; pageSize: number }>(
    "/api/products",
    { params: { page, pageSize } }
  );
  return data;
}
