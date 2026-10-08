const { verifyToken } = require("../utils/jwt");
const { getAdminById } = require("../services/auth.service");

const ADMIN_COOKIE_NAME = "inspired_admin_token";

const requireAdminAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.[ADMIN_COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    const decoded = verifyToken(token);

    if (!decoded?.adminId) {
      const error = new Error("Invalid authentication token");
      error.statusCode = 401;
      throw error;
    }

    const admin = await getAdminById(decoded.adminId);

    req.admin = admin;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message = "Invalid or expired authentication token";
    }

    next(error);
  }
};

module.exports = {
  ADMIN_COOKIE_NAME,
  requireAdminAuth,
};
