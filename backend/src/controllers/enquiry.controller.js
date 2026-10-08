const enquiryService = require("../services/enquiry.service");

// =====================================================
// CREATE ENQUIRY
// =====================================================

const createEnquiry = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.createEnquiry(req.body);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL ENQUIRIES
// =====================================================

const getAllEnquiries = async (req, res, next) => {
  try {
    const enquiries = await enquiryService.getAllEnquiries();

    res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ENQUIRY BY ID
// =====================================================

const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.getEnquiryById(req.params.id);

    if (!enquiry) {
      const error = new Error("Enquiry not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Enquiry fetched successfully",
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE ENQUIRY STATUS
// =====================================================

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.updateEnquiryStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE ENQUIRY
// =====================================================

const deleteEnquiry = async (req, res, next) => {
  try {
    await enquiryService.deleteEnquiry(req.params.id);

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
};
