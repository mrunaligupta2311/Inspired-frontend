 const express = require("express");

const upload = require("../middleware/upload.middleware");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const {
  getInstitute,
  createInstitute,
  updateInstitute,
  uploadHeroImage,
  removeHeroImage,
} = require("../controllers/institute.controller");

const {
  validateCreateInstitute,
  validateUpdateInstitute,
} = require("../validators/institute.validator");

const router = express.Router();

// PUBLIC READ
router.get("/", getInstitute);

// ADMIN PROTECTED WRITE
router.post(
  "/",
  requireAdminAuth,
  validateCreateInstitute,
  createInstitute
);

router.post(
  "/:id/hero/upload",
  requireAdminAuth,
  upload.single("file"),
  uploadHeroImage
);

router.delete(
  "/:id/hero",
  requireAdminAuth,
  removeHeroImage
);

router.patch(
  "/:id",
  requireAdminAuth,
  validateUpdateInstitute,
  updateInstitute
);

module.exports = router;