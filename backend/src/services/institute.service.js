const prisma = require("../lib/prisma");
const { deleteFromCloudinary } = require("./cloudinary.service");

// Helper to ensure frontend and admin get both heroMediaUrl and heroImageUrl
const formatInstitute = (institute) => {
  if (!institute) return null;
  const heroUrl = institute.heroImageUrl || institute.heroMediaUrl || "";
  return {
    ...institute,
    heroImageUrl: heroUrl,
    heroMediaUrl: heroUrl,
  };
};

// =====================================================
// GET INSTITUTE INFO
// =====================================================

const getInstitute = async () => {
  let institute = await prisma.institute.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!institute) {
    try {
      institute = await prisma.institute.create({
        data: {
          name: "Inspired Institute",
          phone: "+91 99745 39118",
          whatsappNumber: "+91 99745 39118",
          email: "contact@inspiredinstitute.com",
          address: "3rd Floor, Akshar Pavilion, Opp. Rosedale Heights, Yogi Nagar Township, Vasna Bhayli Main Road, Vadodara, Gujarat 391410",
          workingHours: "Mon–Sat: 7:30 AM–8:00 PM | Sun: 7:30 AM–2:00 PM",
          facebookUrl: "https://facebook.com",
          instagramUrl: "https://instagram.com",
          youtubeUrl: "https://youtube.com",
          linkedinUrl: "https://linkedin.com",
          about: "Where Potential Becomes Power. Operating since 2018, Inspired Institute focuses on turning curiosity into confidence and ambition into achievement through concept-driven learning for Classes 6–12 Science, JEE, NEET, GUJCET, and Olympiad preparation in Vadodara.",
        },
      });
    } catch (e) {
      console.warn("[Institute] Note during initial creation:", e.message);
    }
  }

  return formatInstitute(institute);
};

// =====================================================
// CREATE INSTITUTE INFO
// =====================================================

const createInstitute = async (data) => {
  const mediaUrl = data.heroMediaUrl || data.heroImageUrl || null;
  const publicId = data.heroCloudinaryPublicId || data.heroImagePublicId || null;

  const created = await prisma.institute.create({
    data: {
      name: data.name,
      phone: data.phone || null,
      whatsappNumber: data.whatsappNumber || null,
      email: data.email || null,
      address: data.address || null,
      workingHours: data.workingHours || null,
      facebookUrl: data.facebookUrl || null,
      instagramUrl: data.instagramUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      about: data.about || null,
      heroImageUrl: mediaUrl,
      heroImagePublicId: publicId,
      heroCloudinaryPublicId: publicId,
    },
  });

  return formatInstitute(created);
};

// =====================================================
// UPDATE INSTITUTE INFO
// =====================================================

const updateInstitute = async (id, data) => {
  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.workingHours !== undefined) updateData.workingHours = data.workingHours;
  if (data.facebookUrl !== undefined) updateData.facebookUrl = data.facebookUrl;
  if (data.instagramUrl !== undefined) updateData.instagramUrl = data.instagramUrl;
  if (data.youtubeUrl !== undefined) updateData.youtubeUrl = data.youtubeUrl;
  if (data.linkedinUrl !== undefined) updateData.linkedinUrl = data.linkedinUrl;
  if (data.about !== undefined) updateData.about = data.about;

  if (data.heroMediaUrl !== undefined || data.heroImageUrl !== undefined) {
    const url = data.heroMediaUrl !== undefined ? data.heroMediaUrl : data.heroImageUrl;
    updateData.heroImageUrl = url;
  }

  if (data.heroCloudinaryPublicId !== undefined || data.heroImagePublicId !== undefined) {
    const pubId = data.heroCloudinaryPublicId !== undefined ? data.heroCloudinaryPublicId : data.heroImagePublicId;
    updateData.heroCloudinaryPublicId = pubId;
    updateData.heroImagePublicId = pubId;
  }

  const existingInstitute = await prisma.institute.findUnique({
    where: { id },
  });

  if (!existingInstitute) {
    const error = new Error("Institute information not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedInstitute = await prisma.institute.update({
    where: { id },
    data: updateData,
  });

  const oldPublicId = existingInstitute.heroCloudinaryPublicId || existingInstitute.heroImagePublicId;
  const newPublicId = updateData.heroCloudinaryPublicId;

  if (newPublicId && oldPublicId && newPublicId !== oldPublicId) {
    try {
      await deleteFromCloudinary(oldPublicId, "image");
    } catch (error) {
      console.error("Old hero asset deletion notice:", error.message);
    }
  }

  return formatInstitute(updatedInstitute);
};

// =====================================================
// REMOVE HERO MEDIA
// =====================================================

const removeHeroMedia = async (id) => {
  const institute = await prisma.institute.findUnique({
    where: { id },
  });

  if (!institute) {
    const error = new Error("Institute information not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedInstitute = await prisma.institute.update({
    where: { id },
    data: {
      heroImageUrl: null,
      heroImagePublicId: null,
      heroCloudinaryPublicId: null,
    },
  });

  const publicId = institute.heroCloudinaryPublicId || institute.heroImagePublicId;
  if (publicId) {
    try {
      await deleteFromCloudinary(publicId, "image");
    } catch (error) {
      console.error("Hero asset deletion notice:", error.message);
    }
  }

  return formatInstitute(updatedInstitute);
};

module.exports = {
  getInstitute,
  createInstitute,
  updateInstitute,
  removeHeroMedia,
};
