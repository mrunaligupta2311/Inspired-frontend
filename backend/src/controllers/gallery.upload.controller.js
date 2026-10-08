const {
  uploadToCloudinary,
} = require("../services/cloudinary.service");

const uploadGalleryMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Media file is required",
      });
    }

    const resourceType = req.file.mimetype.startsWith("video/")
      ? "video"
      : "image";

    const result = await uploadToCloudinary(
      req.file.buffer,
      resourceType
    );

    return res.status(201).json({
      success: true,
      message: "Gallery media uploaded successfully",
      data: {
        mediaUrl: result.secure_url,
        mediaType: resourceType === "video" ? "VIDEO" : "IMAGE",
        cloudinaryPublicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadGalleryMedia,
};
