const bcrypt = require("bcryptjs");
const prisma = require("../../src/lib/prisma");

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Inspired Institute Admin";

  if (!email) {
    throw new Error("ADMIN_EMAIL is missing in .env");
  }

  if (!password) {
    throw new Error("ADMIN_PASSWORD is missing in .env");
  }


  const passwordHash = await bcrypt.hash(password, 12);

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    const updatedAdmin = await prisma.admin.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        name,
        passwordHash,
        isActive: true,
      },
    });

    console.log(`Admin updated successfully: ${updatedAdmin.email}`);
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      passwordHash,
      isActive: true,
    },
  });

  console.log(`Admin created successfully: ${admin.email}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

