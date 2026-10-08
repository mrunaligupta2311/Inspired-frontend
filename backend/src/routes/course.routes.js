 const express = require("express");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("../validators/course.validator");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================================
// PUBLIC READ ROUTES
// =====================================================

// GET /api/courses
// GET /api/courses?public=true
router.get("/", getAllCourses);

// GET /api/courses/:id
// GET /api/courses/:id?public=true
router.get("/:id", getCourseById);

// =====================================================
// ADMIN PROTECTED WRITE ROUTES
// =====================================================

// POST /api/courses
router.post(
  "/",
  requireAdminAuth,
  validateCreateCourse,
  createCourse
);

// PATCH /api/courses/:id
router.patch(
  "/:id",
  requireAdminAuth,
  validateUpdateCourse,
  updateCourse
);

// DELETE /api/courses/:id
router.delete(
  "/:id",
  requireAdminAuth,
  deleteCourse
);

module.exports = router;