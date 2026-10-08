require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error.middleware");

const courseRoutes = require("./routes/course.routes");
const facultyRoutes = require("./routes/faculty.routes");
const resultRoutes = require("./routes/result.routes");
const galleryRoutes = require("./routes/gallery.routes");
const enquiryRoutes = require("./routes/enquiry.routes");
const instituteRoutes = require("./routes/institute.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", async (req, res) => {
  const prisma = require("./lib/prisma");
  let dbStatus = "connected";
  const provider = prisma.isNeonActive ? "neon-postgresql" : "persistent-sqlite";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "degraded";
  }

  res.status(200).json({
    success: true,
    message: "Inspired Institute backend and database are operational",
    database: {
      status: dbStatus,
      provider,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Admin-panel static client serving (production/built)
const adminDistPath = path.resolve(__dirname, "../../admin-panel/dist");
if (fs.existsSync(adminDistPath)) {
  app.use("/admin", express.static(adminDistPath));
  app.use("/admin", (req, res, next) => {
    const adminIndex = path.join(adminDistPath, "index.html");
    if (fs.existsSync(adminIndex)) {
      return res.sendFile(adminIndex);
    }
    next();
  });
}

// Frontend static client serving (production/built)
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/admin")) {
      return next();
    }
    const frontendIndex = path.join(frontendDistPath, "index.html");
    if (fs.existsSync(frontendIndex)) {
      return res.sendFile(frontendIndex);
    }
    next();
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
