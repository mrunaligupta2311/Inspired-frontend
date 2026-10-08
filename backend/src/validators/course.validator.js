const validateCreateCourse = (req, res, next) => {
  const {
    title,
    shortDescription,
    fullDescription,
    targetStudents,
    category,
    tags,
    eligibleClasses,
    status,
    displayOrder,
  } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course title is required",
    });
  }

  if (shortDescription !== undefined && typeof shortDescription !== "string") {
    return res.status(400).json({
      success: false,
      message: "Short description must be a string",
    });
  }

  if (fullDescription !== undefined && typeof fullDescription !== "string") {
    return res.status(400).json({
      success: false,
      message: "Full description must be a string",
    });
  }

  if (targetStudents !== undefined && typeof targetStudents !== "string") {
    return res.status(400).json({
      success: false,
      message: "Target students must be a string",
    });
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category must be a string",
    });
  }

  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      tags.some((tag) => typeof tag !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array of strings",
      });
    }
  }

  if (eligibleClasses !== undefined) {
    if (
      !Array.isArray(eligibleClasses) ||
      eligibleClasses.some(
        (classNumber) =>
          !Number.isInteger(classNumber) ||
          classNumber < 6 ||
          classNumber > 12
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Eligible classes must be an array of integers from 6 to 12",
      });
    }
  }

  if (status !== undefined && !["ACTIVE", "INACTIVE"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be ACTIVE or INACTIVE",
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

  next();
};

const validateUpdateCourse = (req, res, next) => {
  const {
    title,
    shortDescription,
    fullDescription,
    targetStudents,
    category,
    tags,
    eligibleClasses,
    status,
    displayOrder,
  } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Course title must be a non-empty string",
    });
  }

  if (shortDescription !== undefined && typeof shortDescription !== "string") {
    return res.status(400).json({
      success: false,
      message: "Short description must be a string",
    });
  }

  if (fullDescription !== undefined && typeof fullDescription !== "string") {
    return res.status(400).json({
      success: false,
      message: "Full description must be a string",
    });
  }

  if (targetStudents !== undefined && typeof targetStudents !== "string") {
    return res.status(400).json({
      success: false,
      message: "Target students must be a string",
    });
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category must be a string",
    });
  }

  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      tags.some((tag) => typeof tag !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array of strings",
      });
    }
  }

  if (eligibleClasses !== undefined) {
    if (
      !Array.isArray(eligibleClasses) ||
      eligibleClasses.some(
        (classNumber) =>
          !Number.isInteger(classNumber) ||
          classNumber < 6 ||
          classNumber > 12
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Eligible classes must be an array of integers from 6 to 12",
      });
    }
  }

  if (status !== undefined && !["ACTIVE", "INACTIVE"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be ACTIVE or INACTIVE",
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

  next();
};

module.exports = {
  validateCreateCourse,
  validateUpdateCourse,
};
