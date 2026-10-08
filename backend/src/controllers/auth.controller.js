 const {
  loginAdmin,
  getAdminById,
  updateAdminProfile,
  changeAdminPassword,
} = require("../services/auth.service");

const {
  ADMIN_COOKIE_NAME,
} = require("../middleware/auth.middleware");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginAdmin({
      email,
      password,
    });

    res.cookie(
      ADMIN_COOKIE_NAME,
      result.token,
      cookieOptions
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: result.token,
      admin: result.admin,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie(ADMIN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Admin logout successful",
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const admin = await getAdminById(req.admin.id);

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const admin = await updateAdminProfile({
      adminId: req.admin.id,
      name: req.body.name,
    });

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await changeAdminPassword({
      adminId: req.admin.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    res.status(200).json({
      success: true,
      message: "Admin password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};