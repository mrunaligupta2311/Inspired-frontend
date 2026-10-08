const facultyService = require("../services/faculty.service");

// =====================================================
// CREATE FACULTY
// =====================================================

const createFaculty = async (req, res, next) => {
  try {
    const faculty = await facultyService.createFaculty(req.body);

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL FACULTY
// =====================================================

const getAllFaculty = async (req, res, next) => {
  try {
    const faculty = await facultyService.getAllFaculty({
      publicOnly: req.query.public === "true",
    });

    res.status(200).json({
      success: true,
      message: "Faculty fetched successfully",
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET FACULTY BY ID
// =====================================================

const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await facultyService.getFacultyById(req.params.id, {
      publicOnly: req.query.public === "true",
    });

    if (!faculty) {
      const error = new Error("Faculty not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Faculty fetched successfully",
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE FACULTY
// =====================================================

const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await facultyService.updateFaculty(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE FACULTY
// =====================================================

const deleteFaculty = async (req, res, next) => {
  try {
    await facultyService.deleteFaculty(req.params.id);

    res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
