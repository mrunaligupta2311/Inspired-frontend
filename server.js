require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");

const app = require("./backend/src/app");
const prisma = require("./backend/src/lib/prisma");

const PORT = 3000;
const HOST = "0.0.0.0";

async function startServer() {
  try {
    try {
      await prisma.$connect();
      const provider = prisma.isNeonActive ? "Neon PostgreSQL" : "Persistent SQLite";
      console.log(`[Database] Connected to ${provider} database successfully.`);
    } catch (dbErr) {
      console.warn("[Database] Startup note:", dbErr.message);
    }

    const frontendDist = path.resolve(__dirname, "frontend/dist");
    const adminDist = path.resolve(__dirname, "admin-panel/dist");

    // In development mode, if dist folders are not yet built, attach Vite dev middleware
    if (!fs.existsSync(frontendDist)) {
      try {
        const { createServer: createViteServer } = await import("vite");

        const viteAdmin = await createViteServer({
          root: path.resolve(__dirname, "admin-panel"),
          base: "/admin/",
          server: { middlewareMode: true, hmr: false },
          appType: "spa",
        });

        const viteFrontend = await createViteServer({
          root: path.resolve(__dirname, "frontend"),
          base: "/",
          server: { middlewareMode: true, hmr: false },
          appType: "spa",
        });

        app.use("/admin", viteAdmin.middlewares);
        app.use(viteFrontend.middlewares);
        console.log("[AI Studio] Vite dev middleware loaded for frontend & admin.");
      } catch (viteErr) {
        console.warn("[AI Studio] Note loading Vite middleware:", viteErr.message);
      }
    }

    const server = app.listen(PORT, HOST, () => {
      console.log(`[AI Studio] Inspired Institute running on http://${HOST}:${PORT}`);
      console.log(`[AI Studio] Public Website: http://${HOST}:${PORT}/`);
      console.log(`[AI Studio] Admin Portal:   http://${HOST}:${PORT}/admin/`);
    });

    server.on("error", (err) => {
      console.error("[AI Studio] Server error:", err);
    });
  } catch (err) {
    console.error("[AI Studio] Fatal error during startup:", err);
    process.exit(1);
  }
}

startServer();
