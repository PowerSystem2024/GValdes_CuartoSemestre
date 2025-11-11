import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/product";
import { orderRoutes } from "./routes/orders";
import { paymentsRoutes } from "./routes/payments";

const app = Fastify({ logger: true });

async function main() {

  // registro cors
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // rutas
  app.get("/health", async () => ({ ok: true }));
  await app.register(authRoutes);
  app.register(productRoutes);
  app.register(orderRoutes);
  app.register(paymentsRoutes, { prefix: "/api/payments" });

  const port = Number(process.env.PORT ?? 3333);
  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`API running on :${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
