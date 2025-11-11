import { listProducts } from "@/services/products";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ScrollToSection } from "@/components/ScrollToSection";
import { ContactForm } from "@/components/ContactForm";

const categories = [
    { key: "whatsapp", label: "Bots de WhatsApp" },
    { key: "telegram", label: "Telegram / Discord" },
    { key: "scraping", label: "Scraping & Data" },
    { key: "selenium", label: "Selenium / RPA" },
    { key: "integrations", label: "Integraciones" },
    { key: "alerts", label: "Alertas & Notif." },
];

const capabilities = [
    { title: "Bots de WhatsApp", desc: "Ventas, soporte, turnos y respuestas automáticas con flujos a medida." },
    { title: "Telegram & Discord", desc: "Comunidades, moderación, dashboards y automatizaciones en tiempo real." },
    { title: "Scraping & Enriquecimiento", desc: "Extracción masiva de datos públicos, limpieza y normalización para BI." },
    { title: "Selenium / RPA", desc: "Robotización de tareas repetitivas en la web: formularios, reportes, descargas." },
    { title: "Integraciones", desc: "Conecta tu stack con Gmail, Sheets, Notion, Slack, MP, ERP/CRM y más." },
    { title: "Alertas & Monitoreo", desc: "Seguimiento de precios, stock, keywords o cambios de sitio con avisos automáticos." },
];

export const metadata = {
    title: "Automatizaciones | BotForce",
    description:
        "Soluciones llave en mano: bots de WhatsApp/Telegram/Discord, scraping, RPA con Selenium, integraciones y alertas.",
};

export default async function Home() {
    const data = await listProducts({ page: 1, pageSize: 12 });
    const items = data.items ?? [];

    return (
        <main className="min-h-screen">
            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600/10 via-sky-500/10 to-transparent" />
                <div className="container mx-auto px-4 py-12 lg:py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                            Automatizaciones que ahorran horas y escalan tu operación
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                            Bots de WhatsApp, Telegram y Discord. Scraping y extracción de datos. RPA con Selenium.
                            Integraciones y flujos a medida para que tu equipo se enfoque en lo importante.
                        </p>

                        {/* chips */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {categories.map((c) => (
                                <span
                                    key={c.key}
                                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition"
                                >
                                    {c.label}
                                </span>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="mt-6 flex gap-3">
                            <ScrollToSection
                                targetId="catalogo"
                                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium shadow-sm hover:opacity-90"
                            >
                                Ver catálogo
                            </ScrollToSection>

                            <ScrollToSection
                                targetId="contacto"
                                className="inline-flex items-center rounded-lg border px-4 py-2 font-medium hover:bg-muted/50"
                            >
                                Quiero vender / sumarme
                            </ScrollToSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES */}
            <section className="container mx-auto px-4 py-10">
                <h2 className="text-xl font-semibold">¿Qué podés hacer con BotForce?</h2>
                <p className="mt-2 text-muted-foreground max-w-2xl">
                    Elegí una solución llave en mano o pedí un flujo a medida. Integramos con tu stack actual.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {capabilities.map((cap) => (
                        <div key={cap.title} className="rounded-xl border p-4 hover:shadow-sm transition">
                            <div className="text-sm font-semibold">{cap.title}</div>
                            <p className="mt-1 text-sm text-muted-foreground">{cap.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRUST / BANNER */}
            <section className="container mx-auto px-4">
                <div className="rounded-xl border bg-muted/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-sm">
                        <span className="font-semibold">SLA y soporte</span> en horario comercial ·
                        <span className="font-semibold"> Deploy</span> en Vercel/Railway ·
                        <span className="font-semibold"> Pago seguro</span> con Mercado Pago
                    </div>
                    <div className="sm:ml-auto">
                        <Link href="/casos" className="text-sm underline hover:opacity-80">
                            Ver casos de uso
                        </Link>
                    </div>
                </div>
            </section>

            {/* CATALOGO */}
            <section id="catalogo" className="container mx-auto px-4 py-10">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Soluciones listas para implementar</h2>
                        <p className="text-muted-foreground text-sm">
                            Elegí un paquete y lo adaptamos a tus reglas de negocio.
                        </p>
                    </div>
                    <div className="text-xs text-muted-foreground">Filtrado por categoría (próximamente)</div>
                </div>

                {items.length === 0 ? (
                    <div className="mt-8 rounded-xl border p-8 text-center">
                        <h3 className="text-base font-semibold">No hay productos publicados aún</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Estamos preparando el catálogo. Mientras tanto, contanos tu caso.
                        </p>
                        <ScrollToSection
                            targetId="contacto"
                            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium hover:opacity-90"
                        >
                            Contáctanos
                        </ScrollToSection>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((p) => (
                            <ProductCard key={p.id} p={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* CONTACTO */}
            <section id="contacto" className="container mx-auto px-4 pb-16">
                <div className="rounded-xl border p-5 md:p-6">
                    <h3 className="text-lg font-semibold">¿Querés comprar, vender o sumarte al proyecto?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Completá el formulario y coordinamos una llamada para entender tu caso.
                    </p>
                    <div className="mt-5">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
