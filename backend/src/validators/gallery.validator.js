const validateCreateGallery = (req, res, next) => {
  const {
    imageUrl,
    mediaUrl,
    mediaType,
    cloudinaryPublicId,
    title,
    description,
    category,
    displayOrder,
    isActive,
  } = req.body;

  if (
    (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) &&
    (!mediaUrl || typeof mediaUrl !== "string" || !mediaUrl.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Media URL is required",
    });
  }

  if (
    mediaType !== undefined &&
    !["IMAGE", "VIDEO"].includes(mediaType)
  ) {
    return res.status(400).json({
      success: false,
      message: "mediaType must be IMAGE or VIDEO",
    });
  }

  if (
    cloudinaryPublicId !== undefined &&
    (typeof cloudinaryPublicId !== "string" ||
      !cloudinaryPublicId.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "cloudinaryPublicId must be a non-empty string",
    });
  }

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "Title must be a string",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category must be a string",
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

const validateUpdateGallery = (req, res, next) => {
  const {
    imageUrl,
    mediaUrl,
    mediaType,
    cloudinaryPublicId,
    title,
    description,
    category,
    displayOrder,
    isActive,
  } = req.body;

  if (
    imageUrl !== undefined &&
    (typeof imageUrl !== "string" || !imageUrl.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Image URL must be a non-empty string",
    });
  }

  if (
    mediaUrl !== undefined &&
    (typeof mediaUrl !== "string" || !mediaUrl.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Media URL must be a non-empty string",
    });
  }

  if (
    mediaType !== undefined &&
    !["IMAGE", "VIDEO"].includes(mediaType)
  ) {
    return res.status(400).json({
      success: false,
      message: "mediaType must be IMAGE or VIDEO",
    });
  }

  if (
    cloudinaryPublicId !== undefined &&
    (typeof cloudinaryPublicId !== "string" ||
      !cloudinaryPublicId.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "cloudinaryPublicId must be a non-empty string",
    });
  }

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "Title must be a string",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category must be a string",
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
  validateCreateGallery,
  validateUpdateGallery,
};
