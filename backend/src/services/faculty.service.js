const prisma = require("../lib/prisma");

// =====================================================
// CREATE FACULTY
// =====================================================

const createFaculty = async (data) => {
  return prisma.faculty.create({
    data: {
      name: data.name,
      designation: data.designation || null,
      subject: data.subject || null,
      qualification: data.qualification || null,
      experience: data.experience || null,
      bio: data.bio || null,
      profileImage: data.profileImage || null,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

// =====================================================
// GET ALL FACULTY
// =====================================================

const getAllFaculty = async ({ publicOnly = false } = {}) => {
  return prisma.faculty.findMany({
    where: publicOnly
      ? {
          isActive: true,
        }
      : undefined,
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

// =====================================================
// GET FACULTY BY ID
// =====================================================

const getFacultyById = async (id, { publicOnly = false } = {}) => {
  return prisma.faculty.findFirst({
    where: {
      id,
      ...(publicOnly
        ? {
            isActive: true,
          }
        : {}),
    },
  });
};

// =====================================================
// UPDATE FACULTY
// =====================================================

const updateFaculty = async (id, data) => {
  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.designation !== undefined) {
    updateData.designation = data.designation;
  }

  if (data.subject !== undefined) {
    updateData.subject = data.subject;
  }

  if (data.qualification !== undefined) {
    updateData.qualification = data.qualification;
  }

  if (data.experience !== undefined) {
    updateData.experience = data.experience;
  }

  if (data.bio !== undefined) {
    updateData.bio = data.bio;
  }

  if (data.profileImage !== undefined) {
    updateData.profileImage = data.profileImage;
  }

  if (data.displayOrder !== undefined) {
    updateData.displayOrder = data.displayOrder;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  return prisma.faculty.update({
    where: {
      id,
    },
    data: updateData,
  });
};

// =====================================================
// DELETE FACULTY
// =====================================================

const deleteFaculty = async (id) => {
  return prisma.faculty.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
