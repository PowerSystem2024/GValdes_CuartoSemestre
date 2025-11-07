import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signJwt, verifyJwt } from "../lib/jwt";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  // Registro
  app.post("/api/auth/register", async (req, reply) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.code(400).send({ error: "Datos inválidos", details: parse.error.flatten() });
    }
    const { name, email, password } = parse.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(400).send({ error: "Email ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return reply.code(201).send({ user, token });
  });

  // Login
  app.post("/api/auth/login", async (req, reply) => {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.code(400).send({ error: "Datos inválidos", details: parse.error.flatten() });
    }
    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(401).send({ error: "Credenciales inválidas" });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = signJwt(payload);

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
  });

  // Validar token / perfil
  app.get("/api/auth/me", async (req, reply) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return reply.code(401).send({ error: "Sin token" });

    const token = auth.substring("Bearer ".length);
    const data = verifyJwt<{ id: string }>(token);
    if (!data) return reply.code(401).send({ error: "Token inválido" });

    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return reply.code(401).send({ error: "Token inválido" });

    return { user };
  });
}
