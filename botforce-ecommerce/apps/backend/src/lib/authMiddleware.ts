import { FastifyRequest, FastifyReply } from "fastify";
import { verifyJwt } from "./jwt";
import { prisma } from "./prisma";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Sin token" });
  }

  const token = auth.substring("Bearer ".length);
  const data = verifyJwt<{ id: string }>(token);
  if (!data) return reply.code(401).send({ error: "Token inválido" });

  const user = await prisma.user.findUnique({
    where: { id: data.id },
    select: { id: true, email: true, role: true },
  });
  if (!user) return reply.code(401).send({ error: "Usuario no encontrado" });

  (req as any).user = user; // inyectamos el usuario en la request
}
