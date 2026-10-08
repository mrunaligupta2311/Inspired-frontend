const validateCreateResult = (req, res, next) => {
  const {
    studentName,
    exam,
    year,
    score,
    percentile,
    rank,
    achievementTitle,
    description,
    studentImage,
    displayOrder,
    isActive,
  } = req.body;

  if (
    !studentName ||
    typeof studentName !== "string" ||
    !studentName.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Student name is required",
    });
  }

  if (exam !== undefined && typeof exam !== "string") {
    return res.status(400).json({
      success: false,
      message: "Exam must be a string",
    });
  }

  if (
    year !== undefined &&
    (!Number.isInteger(year) || year < 1900 || year > 2100)
  ) {
    return res.status(400).json({
      success: false,
      message: "Year must be a valid integer between 1900 and 2100",
    });
  }

  if (score !== undefined && typeof score !== "string") {
    return res.status(400).json({
      success: false,
      message: "Score must be a string",
    });
  }

  if (percentile !== undefined && typeof percentile !== "string") {
    return res.status(400).json({
      success: false,
      message: "Percentile must be a string",
    });
  }

  if (rank !== undefined && typeof rank !== "string") {
    return res.status(400).json({
      success: false,
      message: "Rank must be a string",
    });
  }

  if (
    achievementTitle !== undefined &&
    typeof achievementTitle !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Achievement title must be a string",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
  }

  if (studentImage !== undefined && typeof studentImage !== "string") {
    return res.status(400).json({
      success: false,
      message: "Student image must be a string",
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

const validateUpdateResult = (req, res, next) => {
  const {
    studentName,
    exam,
    year,
    score,
    percentile,
    rank,
    achievementTitle,
    description,
    studentImage,
    displayOrder,
    isActive,
  } = req.body;

  if (
    studentName !== undefined &&
    (typeof studentName !== "string" || !studentName.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Student name must be a non-empty string",
    });
  }

  if (exam !== undefined && typeof exam !== "string") {
    return res.status(400).json({
      success: false,
      message: "Exam must be a string",
    });
  }

  if (
    year !== undefined &&
    (!Number.isInteger(year) || year < 1900 || year > 2100)
  ) {
    return res.status(400).json({
      success: false,
      message: "Year must be a valid integer between 1900 and 2100",
    });
  }

  if (score !== undefined && typeof score !== "string") {
    return res.status(400).json({
      success: false,
      message: "Score must be a string",
    });
  }

  if (percentile !== undefined && typeof percentile !== "string") {
    return res.status(400).json({
      success: false,
      message: "Percentile must be a string",
    });
  }

  if (rank !== undefined && typeof rank !== "string") {
    return res.status(400).json({
      success: false,
      message: "Rank must be a string",
    });
  }

  if (
    achievementTitle !== undefined &&
    typeof achievementTitle !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Achievement title must be a string",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
  }

  if (studentImage !== undefined && typeof studentImage !== "string") {
    return res.status(400).json({
      success: false,
      message: "Student image must be a string",
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
  validateCreateResult,
  validateUpdateResult,
};
