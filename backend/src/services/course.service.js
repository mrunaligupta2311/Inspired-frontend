const prisma = require("../lib/prisma");

// =====================================================
// CREATE COURSE
// =====================================================

const createCourse = async (data) => {
  return prisma.course.create({
    data: {
      title: data.title,
      shortDescription: data.shortDescription || null,
      fullDescription: data.fullDescription || null,
      targetStudents: data.targetStudents || null,
      category: data.category || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      eligibleClasses: Array.isArray(data.eligibleClasses)
        ? data.eligibleClasses
        : [],
      status: data.status || "ACTIVE",
      displayOrder: data.displayOrder ?? 0,
    },
  });
};

// =====================================================
// GET ALL COURSES
// =====================================================

const getAllCourses = async ({ publicOnly = false } = {}) => {
  return prisma.course.findMany({
    where: publicOnly
      ? {
          status: "ACTIVE",
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
// GET COURSE BY ID
// =====================================================

const getCourseById = async (id, { publicOnly = false } = {}) => {
  return prisma.course.findFirst({
    where: {
      id,
      ...(publicOnly
        ? {
            status: "ACTIVE",
          }
        : {}),
    },
  });
};

// =====================================================
// UPDATE COURSE
// =====================================================

const updateCourse = async (id, data) => {
  const updateData = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.shortDescription !== undefined) {
    updateData.shortDescription = data.shortDescription;
  }

  if (data.fullDescription !== undefined) {
    updateData.fullDescription = data.fullDescription;
  }

  if (data.targetStudents !== undefined) {
    updateData.targetStudents = data.targetStudents;
  }

  if (data.category !== undefined) {
    updateData.category = data.category;
  }

  if (data.tags !== undefined) {
    updateData.tags = Array.isArray(data.tags) ? data.tags : [];
  }

  if (data.eligibleClasses !== undefined) {
    updateData.eligibleClasses = Array.isArray(data.eligibleClasses)
      ? data.eligibleClasses
      : [];
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.displayOrder !== undefined) {
    updateData.displayOrder = data.displayOrder;
  }

  return prisma.course.update({
    where: {
      id,
    },
    data: updateData,
  });
};

// =====================================================
// DELETE COURSE
// =====================================================

const deleteCourse = async (id) => {
  return prisma.course.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
