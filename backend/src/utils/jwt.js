const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  return process.env.JWT_SECRET || "inspired-institute-jwt-secret-key-2026";
};

const generateToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  generateToken,
  verifyToken,
};
