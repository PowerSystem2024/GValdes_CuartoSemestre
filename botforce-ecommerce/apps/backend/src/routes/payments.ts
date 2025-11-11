import { FastifyInstance } from "fastify";
import { Preference, Payment } from "mercadopago";
import { mp } from "../lib/mercadopago";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/authMiddleware";
import { OrderStatus } from "@prisma/client";

type MPItem = {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
};

export async function paymentsRoutes(app: FastifyInstance) {
    // === Crear preferencia a partir de items arbitrarios (carrito / comprar directo) ===
    app.post("/create", { preHandler: [requireAuth] }, async (req, reply) => {
        const body = req.body as { items: MPItem[]; orderId?: string };
        if (!body?.items?.length) {
            return reply.code(400).send({ error: "Faltan items" });
        }

        const items = body.items.map((it) => ({
            id: String(it.id),
            title: String(it.title),
            quantity: Math.max(1, Number(it.quantity || 1)),
            unit_price: Number((Number(it.unit_price) || 0).toFixed(2)),
            currency_id: it.currency_id ?? "ARS",
        }));

        const FRONTEND_URL = (process.env.FRONTEND_URL ?? "http://localhost:3000")
            .trim()
            .replace(/\/+$/, "");
        const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:3333")
            .trim()
            .replace(/\/+$/, "");
        const external_reference = body.orderId ?? undefined;

        const prefBody: any = {
            items,
            back_urls: {
                success: `${FRONTEND_URL}/payment/success`,
                failure: `${FRONTEND_URL}/payment/failure`,
                pending: `${FRONTEND_URL}/payment/pending`,
            },
            notification_url: `${BACKEND_URL}/api/payments/webhook`,
            external_reference,
            auto_return: "approved",
        };

        if (!prefBody.back_urls?.success) delete prefBody.auto_return;

        app.log.info({ prefBody }, "MP preference body");

        try {
            const preferenceClient = new Preference(mp);
            const prefRes = await preferenceClient.create({ body: prefBody });
            const initPoint =
                (prefRes as any).init_point || (prefRes as any).sandbox_init_point;
            return reply.send({ init_point: initPoint, id: (prefRes as any).id });
        } catch (err: any) {
            app.log.error({ err }, "Error creando preferencia MP");
            const msg =
                err?.cause?.message || err?.message || err?.response?.data || "MP error";
            return reply.code(400).send({ error: msg });
        }
    });

    // === Crear preferencia partiendo de una orden existente ===
    app.post(
        "/create-from-order/:id",
        { preHandler: [requireAuth] },
        async (req, reply) => {
            const { id } = req.params as { id: string };

            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    items: {
                        include: { product: { select: { name: true, currency: true } } },
                    },
                },
            });

            if (!order || order.items.length === 0) {
                return reply.code(404).send({ error: "Orden no encontrada o sin items" });
            }

            const items = order.items.map((it) => ({
                id: it.productId,
                title: it.product?.name ?? "Item",
                quantity: it.quantity,
                unit_price: Number((it.unitCents / 100).toFixed(2)),
                currency_id: it.product?.currency ?? "ARS",
            }));

            const FRONTEND_URL = (process.env.FRONTEND_URL ?? "http://localhost:3000")
                .trim()
                .replace(/\/+$/, "");
            const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:3333")
                .trim()
                .replace(/\/+$/, "");

            const prefBody = {
                items,
                back_urls: {
                    success: `${FRONTEND_URL}/payment/success`,
                    failure: `${FRONTEND_URL}/payment/failure`,
                    pending: `${FRONTEND_URL}/payment/pending`,
                },
                notification_url: `${BACKEND_URL}/api/payments/webhook`,
                external_reference: order.id,
                auto_return: "approved",
            };

            app.log.info({ prefBody }, "MP preference body (from order)");

            try {
                const preferenceClient = new Preference(mp);
                const pref = await preferenceClient.create({ body: prefBody });
                const initPoint =
                    (pref as any).init_point || (pref as any).sandbox_init_point;
                return reply.send({ init_point: initPoint, id: (pref as any).id });
            } catch (err: any) {
                app.log.error({ err }, "Error creando preferencia MP (from order)");
                return reply.code(400).send({ error: err?.message ?? "MP error" });
            }
        }
    );

    // === Webhook ===
    app.all("/webhook", async (req, reply) => {
        try {
            const q = req.query as any;
            const b = req.body as any;
            const paymentId =
                q?.["data.id"] ?? b?.data?.id ?? b?.resource?.id ?? b?.id ?? null;

            if (!paymentId) return reply.code(200).send({ ok: true });

            const paymentClient = new Payment(mp);
            const payment: any = await paymentClient.get({ id: String(paymentId) });

            const statusMp: string | undefined = payment?.status;
            const externalRef: string | undefined = payment?.external_reference;

            let newStatus: OrderStatus | null = null;
            if (statusMp === "approved") newStatus = OrderStatus.PAID;
            else if (["rejected", "cancelled", "canceled"].includes(statusMp ?? ""))
                newStatus = OrderStatus.CANCELED;

            if (externalRef && newStatus) {
                try {
                    await prisma.order.update({
                        where: { id: externalRef },
                        data: { status: newStatus },
                    });
                } catch { }
            }

            return reply.code(200).send({ ok: true });
        } catch {
            return reply.code(200).send({ ok: true });
        }
    });
}
