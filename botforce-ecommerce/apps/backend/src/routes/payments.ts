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

        const FRONTEND_URL_RAW = process.env.FRONTEND_URL ?? "http://localhost:3000";
        const FRONTEND_URL = FRONTEND_URL_RAW.trim().replace(/\/+$/, ""); // sin espacios y sin trailing slash
        const BACKEND_URL_RAW = process.env.BACKEND_URL ?? "http://localhost:3333";
        const BACKEND_URL = BACKEND_URL_RAW.trim().replace(/\/+$/, "");
        const external_reference = body.orderId ?? undefined;

        // armamos el cuerpo con back_urls siempre presentes
        const prefBody: any = {
            items,
            back_urls: {
                success: `${FRONTEND_URL}/payment/success`,
                failure: `${FRONTEND_URL}/payment/failure`,
                pending: `${FRONTEND_URL}/payment/pending`,
            },
            notification_url: `${BACKEND_URL}/api/payments/webhook`,
            external_reference,
            auto_return: "approved", // si hay problema, lo removemos abajo
        };

        // sanity-check: si por alguna razón quedó vacío, evitamos el 400 de MP
        if (!prefBody.back_urls?.success) {
            delete prefBody.auto_return; // MP no exige back_urls si no hay auto_return
        }

        // Log de diagnóstico (se ve en consola del backend)
        app.log.info({ prefBody }, "MP preference body");

        try {
            const preferenceClient = new Preference(mp);
            const prefRes = await preferenceClient.create({ body: prefBody });

            const initPoint = (prefRes as any).init_point || (prefRes as any).sandbox_init_point;
            return reply.send({ init_point: initPoint, id: (prefRes as any).id });
        } catch (err: any) {
            app.log.error({ err }, "Error creando preferencia MP");
            const msg =
                err?.cause?.message ||
                err?.message ||
                err?.response?.data ||
                "MP error";
            return reply.code(400).send({ error: msg });
        }
    });

    // webhook igual que ya lo tenías
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
