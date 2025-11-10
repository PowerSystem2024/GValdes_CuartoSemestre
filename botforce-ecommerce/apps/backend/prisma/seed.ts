import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";


async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@botforce.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@botforce.dev",
      password,
      role: "ADMIN" as const, // ✅ string literal
    },
  });
  console.log("✅ Admin creado (admin@botforce.dev / admin123)");

  await prisma.product.createMany({
    data: [
      {
        name: "Bot WhatsApp Atención 24/7",
        slug: "bot-whatsapp-atencion",
        description: "Responde FAQs, deriva a humano, integra etiquetas.",
        priceCents: 149900,
        currency: "ARS",
        status: "ACTIVE" as const, // ✅
        imageUrl: "https://picsum.photos/seed/whatsapp/800/600",
        features: ["WhatsApp API", "Respuestas rápidas", "Panel básico"] as any,
      },
      {
        name: "Bot Ecommerce Catálogo",
        slug: "bot-ecommerce-catalogo",
        description: "Navega productos, consulta stock y guía la compra.",
        priceCents: 199900,
        currency: "ARS",
        status: "ACTIVE" as const, // ✅
        imageUrl: "https://picsum.photos/seed/catalog/800/600",
        features: ["Catálogo", "Búsqueda", "Intenciones predefinidas"] as any,
      },
    ],
  });
}

main().finally(() => prisma.$disconnect());
