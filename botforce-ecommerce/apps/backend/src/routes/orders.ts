import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/authMiddleware";
import { z } from "zod";

const buyNowSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive().default(1),
});

export async function orderRoutes(app: FastifyInstance) {
    // Crear orden con un ítem (Buy Now)
    app.post("/api/orders/buy-now", { preHandler: [requireAuth] }, async (req, reply) => {
        const parse = buyNowSchema.safeParse(req.body);
        if (!parse.success) {
            return reply.code(400).send({ error: "Datos inválidos", details: parse.error.flatten() });
        }
        const { productId, quantity } = parse.data;
        const me = req.user!;

        // Verificar producto
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product || product.status !== "ACTIVE") {
            return reply.code(400).send({ error: "Producto inválido o inactivo" });
        }

        const unitCents = product.priceCents;
        const itemTotal = unitCents * quantity;

        // Crear order + orderItem (y guardar total)
        const order = await prisma.order.create({
            data: {
                userId: me.id,
                status: "PENDING",
                currency: product.currency ?? "ARS",
                totalCents: itemTotal,
                items: {
                    create: [
                        {
                            product: { connect: { id: productId } },
                            quantity,
                            unitCents,
                            totalCents: itemTotal,
                        },
                    ],
                },
            },
            include: { items: true },
        });

        return reply.code(201).send({ order });
    });

    // Ver mis órdenes
    app.get("/api/orders/me", { preHandler: [requireAuth] }, async (req) => {
        const me = req.user!;
        const orders = await prisma.order.findMany({
            where: { userId: me.id },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
        return { items: orders };
    });

    // Pagar una orden (owner o ADMIN)
    app.post("/api/orders/:id/pay", { preHandler: [requireAuth] }, async (req, reply) => {
        const { id } = req.params as { id: string };
        const me = req.user!;

        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order) return reply.code(404).send({ error: "Orden no encontrada" });

        const isOwner = order.userId === me.id;
        const isAdmin = me.role === "ADMIN";
        if (!isOwner && !isAdmin) return reply.code(403).send({ error: "No autorizado" });

        if (order.status !== "PENDING") {
            return reply.code(400).send({ error: "La orden no está pendiente" });
        }

        const updated = await prisma.order.update({
            where: { id },
            data: { status: "PAID" },
            include: { items: true },
        });

        return { order: updated };
    });
}
