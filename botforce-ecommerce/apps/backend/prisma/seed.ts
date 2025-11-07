import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@botforce.dev" },
    update: {},
    create: { name: "Admin", email: "admin@botforce.dev", password, role: "ADMIN" },
  });
  console.log("✅ Admin creado (admin@botforce.dev / admin123)");
}

main().finally(() => prisma.$disconnect());
