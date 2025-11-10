import { FastifyRequest, FastifyReply } from "fastify";

export function requireAdmin(req: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) {
  const u = req.user;
  if (!u || u.role !== "ADMIN") {
    return reply.code(403).send({ error: "Admin requerido" });
  }
  done();
}
