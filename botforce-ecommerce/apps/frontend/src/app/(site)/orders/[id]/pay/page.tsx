export default function PayPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Orden #{params.id}</h1>
      <p className="text-muted-foreground mb-6">
        Próximamente aquí irá la integración de pago (Mercado Pago / Stripe).
      </p>
      <p>Por ahora, la orden se creó correctamente y este es el punto de confirmación.</p>
    </main>
  );
}
