 const express = require("express");

const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiry.controller");

const {
  validateCreateEnquiry,
  validateUpdateEnquiryStatus,
} = require("../validators/enquiry.validator");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================================
// PUBLIC — SUBMIT ENQUIRY
// =====================================================

// POST /api/enquiries
router.post(
  "/",
  validateCreateEnquiry,
  createEnquiry
);

// =====================================================
// ADMIN PROTECTED — READ ENQUIRIES
// =====================================================

// GET /api/enquiries
router.get(
  "/",
  requireAdminAuth,
  getAllEnquiries
);

// GET /api/enquiries/:id
router.get(
  "/:id",
  requireAdminAuth,
  getEnquiryById
);

// =====================================================
// ADMIN PROTECTED — UPDATE STATUS
// =====================================================

// PATCH /api/enquiries/:id/status
router.patch(
  "/:id/status",
  requireAdminAuth,
  validateUpdateEnquiryStatus,
  updateEnquiryStatus
);

// =====================================================
// ADMIN PROTECTED — DELETE
// =====================================================

// DELETE /api/enquiries/:id
router.delete(
  "/:id",
  requireAdminAuth,
  deleteEnquiry
);

module.exports = router;