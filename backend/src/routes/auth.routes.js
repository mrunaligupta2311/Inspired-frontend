 const express = require("express");

const {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const {
  validateUpdateAdminProfile,
  validateChangeAdminPassword,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);

router.get("/me", requireAdminAuth, getMe);

router.patch(
  "/profile",
  requireAdminAuth,
  validateUpdateAdminProfile,
  updateProfile
);

router.patch(
  "/change-password",
  requireAdminAuth,
  validateChangeAdminPassword,
  changePassword
);

module.exports = router;