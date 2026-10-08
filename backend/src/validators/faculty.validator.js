const validateCreateFaculty = (req, res, next) => {
  const {
    name,
    designation,
    subject,
    qualification,
    experience,
    bio,
    profileImage,
    displayOrder,
    isActive,
  } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Faculty name is required",
    });
  }

  if (designation !== undefined && typeof designation !== "string") {
    return res.status(400).json({
      success: false,
      message: "Designation must be a string",
    });
  }

  if (subject !== undefined && typeof subject !== "string") {
    return res.status(400).json({
      success: false,
      message: "Subject must be a string",
    });
  }

  if (qualification !== undefined && typeof qualification !== "string") {
    return res.status(400).json({
      success: false,
      message: "Qualification must be a string",
    });
  }

  if (experience !== undefined && typeof experience !== "string") {
    return res.status(400).json({
      success: false,
      message: "Experience must be a string",
    });
  }

  if (bio !== undefined && typeof bio !== "string") {
    return res.status(400).json({
      success: false,
      message: "Bio must be a string",
    });
  }

  if (profileImage !== undefined && typeof profileImage !== "string") {
    return res.status(400).json({
      success: false,
      message: "Profile image must be a string",
    });
  }

  if (
    displayOrder !== undefined &&
    (!Number.isInteger(displayOrder) || displayOrder < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Display order must be a non-negative integer",
    });
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isActive must be a boolean",
    });
  }

  next();
};

const validateUpdateFaculty = (req, res, next) => {
  const {
    name,
    designation,
    subject,
    qualification,
    experience,
    bio,
    profileImage,
    displayOrder,
    isActive,
  } = req.body;

  if (
    name !== undefined &&
    (typeof name !== "string" || !name.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Faculty name must be a non-empty string",
    });
  }

  if (designation !== undefined && typeof designation !== "string") {
    return res.status(400).json({
      success: false,
      message: "Designation must be a string",
    });
  }

  if (subject !== undefined && typeof subject !== "string") {
    return res.status(400).json({
      success: false,
      message: "Subject must be a string",
    });
  }

  if (qualification !== undefined && typeof qualification !== "string") {
    return res.status(400).json({
      success: false,
      message: "Qualification must be a string",
    });
  }

  if (experience !== undefined && typeof experience !== "string") {
    return res.status(400).json({
      success: false,
      message: "Experience must be a string",
    });
  }

  if (bio !== undefined && typeof bio !== "string") {
    return res.status(400).json({
      success: false,
      message: "Bio must be a string",
    });
  }

  if (profileImage !== undefined && typeof profileImage !== "string") {
    return res.status(400).json({
      success: false,
      message: "Profile image must be a string",
    });
  }

  if (
    displayOrder !== undefined &&
    (!Number.isInteger(displayOrder) || displayOrder < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Display order must be a non-negative integer",
    });
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isActive must be a boolean",
    });
  }

  next();
};

module.exports = {
  validateCreateFaculty,
  validateUpdateFaculty,
};
