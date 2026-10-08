 const validateUpdateAdminProfile = (req, res, next) => {
  const { name } = req.body;

  if (
    name !== undefined &&
    (typeof name !== "string" || !name.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Name must be a non-empty string",
    });
  }

  next();
};

const validateChangeAdminPassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (
    !currentPassword ||
    typeof currentPassword !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Current password is required",
    });
  }

  if (
    !newPassword ||
    typeof newPassword !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password",
    });
  }

  next();
};

module.exports = {
  validateUpdateAdminProfile,
  validateChangeAdminPassword,
};