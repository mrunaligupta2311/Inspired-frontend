const prisma = require("../lib/prisma");

// =====================================================
// GET ADMIN DASHBOARD
// =====================================================

const getDashboard = async () => {
  const [
    courses,
    activeCourses,
    faculty,
    activeFaculty,
    results,
    activeResults,
    gallery,
    activeGallery,
    enquiries,
    recentEnquiries,
    recentResults,
  ] = await Promise.all([
    prisma.course.count(),

    prisma.course.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.faculty.count(),

    prisma.faculty.count({
      where: {
        isActive: true,
      },
    }),

    prisma.result.count(),

    prisma.result.count({
      where: {
        isActive: true,
      },
    }),

    prisma.gallery.count(),

    prisma.gallery.count({
      where: {
        isActive: true,
      },
    }),

    prisma.enquiry.count(),

    prisma.enquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.result.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    stats: {
      courses,
      activeCourses,
      faculty,
      activeFaculty,
      results,
      activeResults,
      gallery,
      activeGallery,
      enquiries,
    },

    recentEnquiries,

    recentResults,
  };
};

module.exports = {
  getDashboard,
};