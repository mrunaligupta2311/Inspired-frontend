const galleryService = require("../services/gallery.service");

// =====================================================
// CREATE GALLERY ITEM
// =====================================================

const createGallery = async (req, res, next) => {
  try {
    const gallery = await galleryService.createGallery(req.body);

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL GALLERY ITEMS
// =====================================================

const getAllGallery = async (req, res, next) => {
  try {
    const gallery = await galleryService.getAllGallery({
      publicOnly: req.query.public === "true",
    });

    res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET GALLERY ITEM BY ID
// =====================================================

const getGalleryById = async (req, res, next) => {
  try {
    const gallery = await galleryService.getGalleryById(req.params.id, {
      publicOnly: req.query.public === "true",
    });

    if (!gallery) {
      const error = new Error("Gallery item not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Gallery item fetched successfully",
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE GALLERY ITEM
// =====================================================

const updateGallery = async (req, res, next) => {
  try {
    const gallery = await galleryService.updateGallery(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE GALLERY ITEM
// =====================================================

const deleteGallery = async (req, res, next) => {
  try {
    await galleryService.deleteGallery(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
