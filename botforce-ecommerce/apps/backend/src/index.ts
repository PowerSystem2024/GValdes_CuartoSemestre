import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/product";
import { orderRoutes } from "./routes/orders";
import { paymentsRoutes } from "./routes/payments";
import { uploadRoutes } from "./routes/upload";
import fastifyMultipart from "@fastify/multipart";

const app = Fastify({ logger: true });

async function main() {

    // registro cors
    await app.register(cors, {
        origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Range", "X-Total-Count"],
        credentials: true,
    });

    await app.register(fastifyMultipart, {
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB, ajustá a gusto
    });

    // rutas
    app.get("/health", async () => ({ ok: true }));
    await app.register(authRoutes);
    app.register(productRoutes);
    app.register(orderRoutes);
    app.register(paymentsRoutes, { prefix: "/api/payments" });
    app.register(uploadRoutes);

    const port = Number(process.env.PORT ?? 3333);
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`API running on :${port}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
