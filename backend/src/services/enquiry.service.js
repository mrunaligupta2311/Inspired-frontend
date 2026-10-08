const prisma = require("../lib/prisma");

// =====================================================
// CREATE ENQUIRY
// =====================================================

const createEnquiry = async (data) => {
  return prisma.enquiry.create({
    data: {
      studentName: data.studentName,
      parentName: data.parentName || null,
      phoneNumber: data.phoneNumber,
      email: data.email || null,
      studentClass: data.studentClass || null,
      interestedCourse: data.interestedCourse || null,
      message: data.message || null,
      status: "NEW",
    },
  });
};

// =====================================================
// GET ALL ENQUIRIES
// =====================================================

const getAllEnquiries = async () => {
  return prisma.enquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// =====================================================
// GET ENQUIRY BY ID
// =====================================================

const getEnquiryById = async (id) => {
  return prisma.enquiry.findUnique({
    where: {
      id,
    },
  });
};

// =====================================================
// UPDATE ENQUIRY STATUS
// =====================================================

const updateEnquiryStatus = async (id, status) => {
  return prisma.enquiry.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

// =====================================================
// DELETE ENQUIRY
// =====================================================

const deleteEnquiry = async (id) => {
  return prisma.enquiry.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
};
