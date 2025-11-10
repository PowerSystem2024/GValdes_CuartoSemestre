import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/authMiddleware";
import { requireAdmin } from "../lib/requireAdmin";
import { z } from "zod";

const createProductSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2), // único
    description: z.string().min(2),
    priceCents: z.number().int().positive(),
    currency: z.string().min(3).default("ARS"),
    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
    imageUrl: z.string().url().optional(),
    features: z.any().optional(), // Json
});

const updateProductSchema = createProductSchema.partial();

export async function productRoutes(app: FastifyInstance) {
    // Públicos: listar productos (con paginación simple)
    app.get("/api/products", async (req) => {
        const q = req.query as any;
        const page = Number(q?.page ?? 1);
        const pageSize = Number(q?.pageSize ?? 10);

        const [items, total] = await Promise.all([
            prisma.product.findMany({
                where: { status: "ACTIVE" },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.product.count({ where: { status: "ACTIVE" } }),
        ]);

        return { page, pageSize, total, items };
    });

    // ADMIN: crear/editar/eliminar
    app.register(
        (admin) => {
            admin.addHook("preHandler", requireAuth);
            admin.addHook("preHandler", requireAdmin);

            admin.post("/products", async (req, reply) => {
                const parse = createProductSchema.safeParse(req.body);
                if (!parse.success) {
                    return reply.code(400).send({ error: "Datos inválidos", details: parse.error.flatten() });
                }
                const data = parse.data;

                // slug único
                const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
                if (exists) return reply.code(409).send({ error: "slug ya existe" });

                const product = await prisma.product.create({ data });
                return reply.code(201).send({ product });
            });

            admin.put("/products/:id", async (req, reply) => {
                const { id } = req.params as { id: string };
                const parse = updateProductSchema.safeParse(req.body);
                if (!parse.success) {
                    return reply.code(400).send({ error: "Datos inválidos", details: parse.error.flatten() });
                }
                const data = parse.data;

                if (data.slug) {
                    const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
                    if (exists && exists.id !== id) return reply.code(409).send({ error: "slug ya existe" });
                }

                const product = await prisma.product.update({ where: { id }, data });
                return { product };
            });

            admin.delete("/products/:id", async (req, reply) => {
                const { id } = req.params as { id: string };
                await prisma.product.delete({ where: { id } });
                return reply.code(204).send();
            });
        },
        { prefix: "/api/admin" }
    );
}
