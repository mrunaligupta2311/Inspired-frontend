const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboard.controller");

const {
  requireAdminAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ADMIN PROTECTED — DASHBOARD
router.get(
  "/",
  requireAdminAuth,
  getDashboard
);

module.exports = router;