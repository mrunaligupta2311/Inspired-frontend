 const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const { generateToken } = require("../utils/jwt");

const loginAdmin = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!admin || !admin.isActive) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    admin.passwordHash
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    adminId: admin.id,
    email: admin.email,
  });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
    },
  };
};

const getAdminById = async (adminId) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin || !admin.isActive) {
    const error = new Error("Admin account not found");
    error.statusCode = 401;
    throw error;
  }

  return admin;
};

const updateAdminProfile = async ({ adminId, name }) => {
  const normalizedName = name?.trim();

  if (!normalizedName) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  const admin = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: {
      name: normalizedName,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return admin;
};

const changeAdminPassword = async ({
  adminId,
  currentPassword,
  newPassword,
}) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!admin || !admin.isActive) {
    const error = new Error("Admin account not found");
    error.statusCode = 401;
    throw error;
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    admin.passwordHash
  );

  if (!isCurrentPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error(
      "New password must be different from current password"
    );
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: {
      passwordHash,
    },
  });

  return true;
};

module.exports = {
  loginAdmin,
  getAdminById,
  updateAdminProfile,
  changeAdminPassword,
};