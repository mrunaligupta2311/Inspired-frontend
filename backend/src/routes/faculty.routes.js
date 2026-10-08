 const express = require("express");

const {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/faculty.controller");

const {
  validateCreateFaculty,
  validateUpdateFaculty,
} = require("../validators/faculty.validator");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================================
// PUBLIC READ ROUTES
// =====================================================

// GET /api/faculty
// GET /api/faculty?public=true
router.get("/", getAllFaculty);

// GET /api/faculty/:id
// GET /api/faculty/:id?public=true
router.get("/:id", getFacultyById);

// =====================================================
// ADMIN PROTECTED WRITE ROUTES
// =====================================================

// POST /api/faculty
router.post(
  "/",
  requireAdminAuth,
  validateCreateFaculty,
  createFaculty
);

// PATCH /api/faculty/:id
router.patch(
  "/:id",
  requireAdminAuth,
  validateUpdateFaculty,
  updateFaculty
);

// DELETE /api/faculty/:id
router.delete(
  "/:id",
  requireAdminAuth,
  deleteFaculty
);

module.exports = router;