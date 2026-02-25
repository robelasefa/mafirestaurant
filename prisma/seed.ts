import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.INIT_ADMIN_EMAIL;
  const password = process.env.INIT_ADMIN_PASSWORD;
  const name = process.env.INIT_ADMIN_NAME || "Mafi Admin";

  if (!email || !password) {
    console.error(
      "INIT_ADMIN_EMAIL and INIT_ADMIN_PASSWORD must be set in the environment to seed the initial admin user."
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(
      `Admin user with email ${email} already exists (id=${existing.id}). No changes made.`
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "admin",
      needsPasswordChange: false,
    },
  });

  console.log(`✅ Created initial admin user: ${admin.email} (id=${admin.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
