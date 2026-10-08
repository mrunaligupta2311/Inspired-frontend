const prisma = require("../lib/prisma");
const {
  deleteFromCloudinary,
} = require("./cloudinary.service");

// =====================================================
// CREATE GALLERY ITEM
// =====================================================

const createGallery = async (data) => {
  const mediaUrl = data.mediaUrl || data.imageUrl;

  return prisma.gallery.create({
    data: {
      imageUrl: mediaUrl,
      mediaUrl: data.mediaUrl || null,
      mediaType: data.mediaType || "IMAGE",
      cloudinaryPublicId: data.cloudinaryPublicId || null,
      title: data.title || null,
      description: data.description || null,
      category: data.category || null,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

// =====================================================
// GET ALL GALLERY ITEMS
// =====================================================

const getAllGallery = async ({ publicOnly = false } = {}) => {
  return prisma.gallery.findMany({
    where: publicOnly
      ? {
          isActive: true,
        }
      : undefined,
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

// =====================================================
// GET GALLERY ITEM BY ID
// =====================================================

const getGalleryById = async (id, { publicOnly = false } = {}) => {
  return prisma.gallery.findFirst({
    where: {
      id,
      ...(publicOnly
        ? {
            isActive: true,
          }
        : {}),
    },
  });
};

// =====================================================
// UPDATE GALLERY ITEM
// =====================================================

const updateGallery = async (id, data) => {
  const existingGallery = await prisma.gallery.findUnique({
    where: {
      id,
    },
  });

  if (!existingGallery) {
    const error = new Error("Gallery item not found");
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  if (data.mediaUrl !== undefined) {
    updateData.mediaUrl = data.mediaUrl;
    updateData.imageUrl = data.mediaUrl;
  }

  if (
    data.imageUrl !== undefined &&
    data.mediaUrl === undefined
  ) {
    updateData.imageUrl = data.imageUrl;
  }

  if (data.mediaType !== undefined) {
    updateData.mediaType = data.mediaType;
  }

  if (data.cloudinaryPublicId !== undefined) {
    updateData.cloudinaryPublicId =
      data.cloudinaryPublicId;
  }

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.category !== undefined) {
    updateData.category = data.category;
  }

  if (data.displayOrder !== undefined) {
    updateData.displayOrder = data.displayOrder;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  const updatedGallery = await prisma.gallery.update({
    where: {
      id,
    },
    data: updateData,
  });

  // ===================================================
  // DELETE OLD CLOUDINARY ASSET AFTER SUCCESSFUL UPDATE
  // ===================================================

  const replacingMedia =
    data.cloudinaryPublicId !== undefined &&
    data.cloudinaryPublicId &&
    data.cloudinaryPublicId !==
      existingGallery.cloudinaryPublicId;

  if (
    replacingMedia &&
    existingGallery.cloudinaryPublicId
  ) {
    const resourceType =
      existingGallery.mediaType === "VIDEO"
        ? "video"
        : "image";

    try {
      await deleteFromCloudinary(
        existingGallery.cloudinaryPublicId,
        resourceType
      );
    } catch (error) {
      console.error(
        "Old Cloudinary asset deletion failed:",
        error.message
      );
    }
  }

  return updatedGallery;
};

// =====================================================
// DELETE GALLERY ITEM
// =====================================================

const deleteGallery = async (id) => {
  const gallery = await prisma.gallery.findUnique({
    where: {
      id,
    },
  });

  if (!gallery) {
    const error = new Error("Gallery item not found");
    error.statusCode = 404;
    throw error;
  }

  const deletedGallery = await prisma.gallery.delete({
    where: {
      id,
    },
  });

  if (gallery.cloudinaryPublicId) {
    const resourceType =
      gallery.mediaType === "VIDEO" ? "video" : "image";

    try {
      await deleteFromCloudinary(
        gallery.cloudinaryPublicId,
        resourceType
      );
    } catch (error) {
      console.error(
        "Cloudinary asset deletion failed:",
        error.message
      );
    }
  }

  return deletedGallery;
};

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
