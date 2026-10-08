const courseService = require("../services/course.service");

// =====================================================
// CREATE COURSE
// =====================================================

const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL COURSES
// =====================================================

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses({
      publicOnly: req.query.public === "true",
    });

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET COURSE BY ID
// =====================================================

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id, {
      publicOnly: req.query.public === "true",
    });

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE COURSE
// =====================================================

const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE COURSE
// =====================================================

const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};