import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";

const app = Fastify({ logger: true });

async function main() {
  await app.register(cors, {
    origin: true, // ajusta a tu FE en prod
    credentials: true,
  });

  // rutas
  app.get("/health", async () => ({ ok: true }));
  await app.register(authRoutes);

  const port = Number(process.env.PORT ?? 3333);
  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`API running on :${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
