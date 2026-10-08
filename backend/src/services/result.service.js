const prisma = require("../lib/prisma");

// =====================================================
// CREATE RESULT
// =====================================================

const createResult = async (data) => {
  return prisma.result.create({
    data: {
      studentName: data.studentName,
      exam: data.exam || null,
      year: data.year ?? null,
      score: data.score || null,
      percentile: data.percentile || null,
      rank: data.rank || null,
      achievementTitle: data.achievementTitle || null,
      description: data.description || null,
      studentImage: data.studentImage || null,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

// =====================================================
// GET ALL RESULTS
// =====================================================

const getAllResults = async ({ publicOnly = false } = {}) => {
  return prisma.result.findMany({
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
        year: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

// =====================================================
// GET RESULT BY ID
// =====================================================

const getResultById = async (id, { publicOnly = false } = {}) => {
  return prisma.result.findFirst({
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
// UPDATE RESULT
// =====================================================

const updateResult = async (id, data) => {
  const updateData = {};

  if (data.studentName !== undefined) {
    updateData.studentName = data.studentName;
  }

  if (data.exam !== undefined) {
    updateData.exam = data.exam;
  }

  if (data.year !== undefined) {
    updateData.year = data.year;
  }

  if (data.score !== undefined) {
    updateData.score = data.score;
  }

  if (data.percentile !== undefined) {
    updateData.percentile = data.percentile;
  }

  if (data.rank !== undefined) {
    updateData.rank = data.rank;
  }

  if (data.achievementTitle !== undefined) {
    updateData.achievementTitle = data.achievementTitle;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.studentImage !== undefined) {
    updateData.studentImage = data.studentImage;
  }

  if (data.displayOrder !== undefined) {
    updateData.displayOrder = data.displayOrder;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  return prisma.result.update({
    where: {
      id,
    },
    data: updateData,
  });
};

// =====================================================
// DELETE RESULT
// =====================================================

const deleteResult = async (id) => {
  return prisma.result.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
};
