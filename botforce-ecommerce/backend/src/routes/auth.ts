import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signJwt } from "../lib/jwt";

export async function authRoutes(app: FastifyInstance) {

  // registro
  app.post("/api/auth/register", async (req, reply) => {
    const { name, email, password } = req.body as any;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(400).send({ error: "Email ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  });

  // login
  app.post("/api/auth/login", async (req, reply) => {
    const { email, password } = req.body as any;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(401).send({ error: "Credenciales inválidas" });

    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  });

  // validar token
  app.get("/api/auth/me", async (req, reply) => {
    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: "Sin token" });
    const token = auth.replace("Bearer ", "");  
    try {
      const data = verifyJwt<{ id: string }>(token);
      if (!data) throw new Error();
      const user = await prisma.user.findUnique({ where: { id: data.id } });
      if (!user) throw new Error();
      return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    } catch {
      return reply.code(401).send({ error: "Token inválido" });
    }
  });
}
