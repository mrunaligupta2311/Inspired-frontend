const instituteService = require("../services/institute.service");
const {
  uploadToCloudinary,
} = require("../services/cloudinary.service");

// =====================================================
// GET INSTITUTE INFO
// =====================================================

const getInstitute = async (req, res, next) => {
  try {
    const institute =
      await instituteService.getInstitute();

    if (!institute) {
      const error = new Error(
        "Institute information not found"
      );
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message:
        "Institute information fetched successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CREATE INSTITUTE INFO
// =====================================================

const createInstitute = async (req, res, next) => {
  try {
    const institute =
      await instituteService.createInstitute(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Institute information created successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE INSTITUTE INFO
// =====================================================

const updateInstitute = async (req, res, next) => {
  try {
    const institute =
      await instituteService.updateInstitute(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Institute information updated successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPLOAD HERO IMAGE
// =====================================================

const uploadHeroImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error(
        "Hero image is required"
      );
      error.statusCode = 400;
      throw error;
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "image"
    );

    const institute =
      await instituteService.updateInstitute(
        req.params.id,
        {
          heroMediaUrl: result.secure_url,
          heroCloudinaryPublicId:
            result.public_id,
        }
      );

    return res.status(201).json({
      success: true,
      message:
        "Hero image uploaded successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// REMOVE HERO IMAGE
// =====================================================

const removeHeroImage = async (req, res, next) => {
  try {
    const institute =
      await instituteService.removeHeroMedia(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Hero image removed successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstitute,
  createInstitute,
  updateInstitute,
  uploadHeroImage,
  removeHeroImage,
};
