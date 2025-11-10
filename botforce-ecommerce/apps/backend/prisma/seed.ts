import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@botforce.dev" }, // si tengo user con este mail
        update: {}, // no hago nada
        create: { name: "Admin", email: "admin@botforce.dev", password, role: "ADMIN" },
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
                status: "ACTIVE",
                imageUrl: "https://picsum.photos/seed/whatsapp/800/600",
                features: ["WhatsApp API", "Respuestas rápidas", "Panel básico"] as any,
            },
            {
                name: "Bot Ecommerce Catálogo",
                slug: "bot-ecommerce-catalogo",
                description: "Navega productos, consulta stock y guía la compra.",
                priceCents: 199900,
                currency: "ARS",
                status: "ACTIVE",
                imageUrl: "https://picsum.photos/seed/catalog/800/600",
                features: ["Catálogo", "Búsqueda", "Intenciones predefinidas"] as any,
            },
        ],
    });
}

main().finally(() => prisma.$disconnect());
