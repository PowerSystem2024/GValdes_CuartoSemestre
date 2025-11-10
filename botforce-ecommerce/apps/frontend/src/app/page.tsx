import { listProducts } from "@/services/products";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const data = await listProducts({ page: 1, pageSize: 12 });
  const items = data.items ?? [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Automatizaciones</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No hay productos publicados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
