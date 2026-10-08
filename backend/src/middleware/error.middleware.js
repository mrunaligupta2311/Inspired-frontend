const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error("[API Error]", err);

  // Prisma and PostgreSQL database errors
  if (
    err.name === "PrismaClientInitializationError" ||
    err.name === "PrismaClientKnownRequestError" ||
    err.name === "PrismaClientUnknownRequestError" ||
    err.name === "PrismaClientRustPanicError" ||
    err.message?.includes("database") ||
    err.message?.includes("DATABASE_URL") ||
    err.code?.startsWith("P")
  ) {
    return res.status(503).json({
      success: false,
      error: "DATABASE_ERROR",
      message:
        "Database operation failed. Please verify that your Neon PostgreSQL database (DATABASE_URL) is active and accessible.",
      details: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};