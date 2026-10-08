const validateCreateEnquiry = (req, res, next) => {
  const {
    studentName,
    parentName,
    phoneNumber,
    email,
    studentClass,
    interestedCourse,
    message,
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

  if (
    !phoneNumber ||
    typeof phoneNumber !== "string" ||
    !phoneNumber.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  if (parentName !== undefined && typeof parentName !== "string") {
    return res.status(400).json({
      success: false,
      message: "Parent name must be a string",
    });
  }

  if (email !== undefined && email !== null && typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email must be a string",
    });
  }

  if (studentClass !== undefined && typeof studentClass !== "string") {
    return res.status(400).json({
      success: false,
      message: "Student class must be a string",
    });
  }

  if (
    interestedCourse !== undefined &&
    typeof interestedCourse !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Interested course must be a string",
    });
  }

  if (message !== undefined && typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message must be a string",
    });
  }

  next();
};

// =====================================================
// UPDATE ENQUIRY STATUS VALIDATION
// =====================================================

const validateUpdateEnquiryStatus = (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "NEW",
    "CONTACTED",
    "CONVERTED",
    "CLOSED",
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message:
        "Status must be one of: NEW, CONTACTED, CONVERTED, CLOSED",
    });
  }

  next();
};

module.exports = {
  validateCreateEnquiry,
  validateUpdateEnquiryStatus,
};
