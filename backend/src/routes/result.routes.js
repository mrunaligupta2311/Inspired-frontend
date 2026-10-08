 const express = require("express");

const {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
} = require("../controllers/result.controller");

const {
  validateCreateResult,
  validateUpdateResult,
} = require("../validators/result.validator");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================================
// PUBLIC READ ROUTES
// =====================================================

// GET /api/results
// GET /api/results?public=true
router.get("/", getAllResults);

// GET /api/results/:id
// GET /api/results/:id?public=true
router.get("/:id", getResultById);

// =====================================================
// ADMIN PROTECTED WRITE ROUTES
// =====================================================

// POST /api/results
router.post(
  "/",
  requireAdminAuth,
  validateCreateResult,
  createResult
);

// PATCH /api/results/:id
router.patch(
  "/:id",
  requireAdminAuth,
  validateUpdateResult,
  updateResult
);

// DELETE /api/results/:id
router.delete(
  "/:id",
  requireAdminAuth,
  deleteResult
);

module.exports = router;