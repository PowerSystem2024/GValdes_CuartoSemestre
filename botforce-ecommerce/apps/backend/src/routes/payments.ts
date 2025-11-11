import { FastifyInstance } from "fastify";
import { Preference, Payment } from "mercadopago";
import { mp } from "../lib/mercadopago";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/authMiddleware";
import { OrderStatus } from "@prisma/client";

// Items que exige MP (v2) – OBLIGATORIO: id
type MPItem = {
    id: string;             // productId o SKU
    title: string;
    quantity: number;
    unit_price: number;     // en ARS
    currency_id?: string;   // por defecto "ARS"
};

export async function paymentsRoutes(app: FastifyInstance) {
    // Crea una Preference y devuelve la URL de checkout (init_point)
    app.post(
        "/create",
        { preHandler: [requireAuth] },
        async (req, reply) => {
            const body = req.body as { items: MPItem[]; orderId?: string };
            if (!body?.items?.length) {
                return reply.code(400).send({ error: "Faltan items" });
            }

            const items = body.items.map((it) => ({
                id: it.id,
                title: it.title,
                quantity: it.quantity,
                unit_price: it.unit_price,
                currency_id: it.currency_id ?? "ARS",
            }));

            const external_reference = body.orderId ?? undefined;

            const preferenceClient = new Preference(mp);
            const prefRes = await preferenceClient.create({
                body: {
                    items,
                    back_urls: {
                        success: `${process.env.FRONTEND_URL}/payment/success`,
                        failure: `${process.env.FRONTEND_URL}/payment/failure`,
                    },
                    notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`, 
                    auto_return: "approved",
                    external_reference,
                    metadata: { userId: (req as any).user.id },
                },
            });


            // En sandbox algunos entornos usan sandbox_init_point
            const initPoint =
                (prefRes as any).init_point || (prefRes as any).sandbox_init_point;

            return reply.send({ init_point: initPoint, id: (prefRes as any).id });
        }
    );

    // Webhook – MP puede mandar body o query con el id según el evento
    app.all("/webhook", async (req, reply) => {
        try {
            const q = req.query as any;
            const b = req.body as any;
            const paymentId =
                q?.["data.id"] ??
                b?.data?.id ??
                b?.resource?.id ??
                b?.id ??
                null;

            if (!paymentId) {
                return reply.code(200).send({ ok: true });
            }

            const paymentClient = new Payment(mp);
            const payment: any = await paymentClient.get({ id: String(paymentId) });

            const statusMp: string | undefined = payment?.status; // "approved", "rejected", "cancelled"
            const externalRef: string | undefined = payment?.external_reference;

            let newStatus: OrderStatus | null = null;
            if (statusMp === "approved") newStatus = OrderStatus.PAID;
            else if (
                statusMp === "rejected" ||
                statusMp === "cancelled" ||
                statusMp === "canceled"
            )
                newStatus = OrderStatus.CANCELED;

            if (externalRef && newStatus) {
                try {
                    await prisma.order.update({
                        where: { id: externalRef },
                        data: { status: newStatus },
                    });
                } catch {
                    // si no existe la orden, ignoramos silenciosamente
                }
            }

            return reply.code(200).send({ ok: true });
        } catch {
            // siempre 200 para que MP no reintente en loop
            return reply.code(200).send({ ok: true });
        }
    });
}
