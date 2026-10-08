const validateCreateInstitute = (req, res, next) => {
  const {
    name,
    phone,
    whatsappNumber,
    email,
    address,
    workingHours,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    linkedinUrl,
    about,
    heroMediaUrl,
    heroCloudinaryPublicId,
  } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Institute name is required",
    });
  }

  if (phone !== undefined && typeof phone !== "string") {
    return res.status(400).json({
      success: false,
      message: "Phone must be a string",
    });
  }

  if (whatsappNumber !== undefined && typeof whatsappNumber !== "string") {
    return res.status(400).json({
      success: false,
      message: "WhatsApp number must be a string",
    });
  }

  if (email !== undefined && email !== null && typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email must be a string",
    });
  }

  if (address !== undefined && typeof address !== "string") {
    return res.status(400).json({
      success: false,
      message: "Address must be a string",
    });
  }

  if (workingHours !== undefined && typeof workingHours !== "string") {
    return res.status(400).json({
      success: false,
      message: "Working hours must be a string",
    });
  }

  if (facebookUrl !== undefined && typeof facebookUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "Facebook URL must be a string",
    });
  }

  if (instagramUrl !== undefined && typeof instagramUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "Instagram URL must be a string",
    });
  }

  if (youtubeUrl !== undefined && typeof youtubeUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "YouTube URL must be a string",
    });
  }

  if (linkedinUrl !== undefined && typeof linkedinUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "LinkedIn URL must be a string",
    });
  }

  if (about !== undefined && typeof about !== "string") {
    return res.status(400).json({
      success: false,
      message: "About must be a string",
    });
  }

  if (
    heroMediaUrl !== undefined &&
    heroMediaUrl !== null &&
    typeof heroMediaUrl !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Hero media URL must be a string",
    });
  }

  if (
    heroCloudinaryPublicId !== undefined &&
    heroCloudinaryPublicId !== null &&
    typeof heroCloudinaryPublicId !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Hero Cloudinary public ID must be a string",
    });
  }

  next();
};

const validateUpdateInstitute = (req, res, next) => {
  const {
    name,
    phone,
    whatsappNumber,
    email,
    address,
    workingHours,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    linkedinUrl,
    about,
    heroMediaUrl,
    heroCloudinaryPublicId,
  } = req.body;

  if (
    name !== undefined &&
    (typeof name !== "string" || !name.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Institute name must be a non-empty string",
    });
  }

  if (phone !== undefined && typeof phone !== "string") {
    return res.status(400).json({
      success: false,
      message: "Phone must be a string",
    });
  }

  if (whatsappNumber !== undefined && typeof whatsappNumber !== "string") {
    return res.status(400).json({
      success: false,
      message: "WhatsApp number must be a string",
    });
  }

  if (email !== undefined && email !== null && typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email must be a string",
    });
  }

  if (address !== undefined && typeof address !== "string") {
    return res.status(400).json({
      success: false,
      message: "Address must be a string",
    });
  }

  if (workingHours !== undefined && typeof workingHours !== "string") {
    return res.status(400).json({
      success: false,
      message: "Working hours must be a string",
    });
  }

  if (facebookUrl !== undefined && typeof facebookUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "Facebook URL must be a string",
    });
  }

  if (instagramUrl !== undefined && typeof instagramUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "Instagram URL must be a string",
    });
  }

  if (youtubeUrl !== undefined && typeof youtubeUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "YouTube URL must be a string",
    });
  }

  if (linkedinUrl !== undefined && typeof linkedinUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "LinkedIn URL must be a string",
    });
  }

  if (about !== undefined && typeof about !== "string") {
    return res.status(400).json({
      success: false,
      message: "About must be a string",
    });
  }

  if (
    heroMediaUrl !== undefined &&
    heroMediaUrl !== null &&
    typeof heroMediaUrl !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Hero media URL must be a string",
    });
  }

  if (
    heroCloudinaryPublicId !== undefined &&
    heroCloudinaryPublicId !== null &&
    typeof heroCloudinaryPublicId !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Hero Cloudinary public ID must be a string",
    });
  }

  next();
};

module.exports = {
  validateCreateInstitute,
  validateUpdateInstitute,
};
