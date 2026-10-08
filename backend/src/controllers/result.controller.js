const resultService = require("../services/result.service");

// =====================================================
// CREATE RESULT
// =====================================================

const createResult = async (req, res, next) => {
  try {
    const result = await resultService.createResult(req.body);

    res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL RESULTS
// =====================================================

const getAllResults = async (req, res, next) => {
  try {
    const results = await resultService.getAllResults({
      publicOnly: req.query.public === "true",
    });

    res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET RESULT BY ID
// =====================================================

const getResultById = async (req, res, next) => {
  try {
    const result = await resultService.getResultById(req.params.id, {
      publicOnly: req.query.public === "true",
    });

    if (!result) {
      const error = new Error("Result not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Result fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE RESULT
// =====================================================

const updateResult = async (req, res, next) => {
  try {
    const result = await resultService.updateResult(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE RESULT
// =====================================================

const deleteResult = async (req, res, next) => {
  try {
    await resultService.deleteResult(req.params.id);

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
};
