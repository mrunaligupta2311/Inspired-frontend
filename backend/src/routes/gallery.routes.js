const express = require("express");

const {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
} = require("../controllers/gallery.controller");

const {
  uploadGalleryMedia,
} = require("../controllers/gallery.upload.controller");

const {
  validateCreateGallery,
  validateUpdateGallery,
} = require("../validators/gallery.validator");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const router = express.Router();

// =====================================================
// PUBLIC READ ROUTES
// =====================================================

// GET /api/gallery
// GET /api/gallery?public=true
router.get("/", getAllGallery);

// GET /api/gallery/:id
// GET /api/gallery/:id?public=true
router.get("/:id", getGalleryById);

// =====================================================
// ADMIN PROTECTED WRITE ROUTES
// =====================================================

// POST /api/gallery/upload
router.post(
  "/upload",
  requireAdminAuth,
  upload.single("file"),
  uploadGalleryMedia
);

// POST /api/gallery
router.post(
  "/",
  requireAdminAuth,
  validateCreateGallery,
  createGallery
);

// PATCH /api/gallery/:id
router.patch(
  "/:id",
  requireAdminAuth,
  validateUpdateGallery,
  updateGallery
);

// DELETE /api/gallery/:id
router.delete(
  "/:id",
  requireAdminAuth,
  deleteGallery
);

module.exports = router;
