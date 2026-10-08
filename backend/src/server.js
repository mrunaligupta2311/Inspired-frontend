 require("dotenv").config();

const app = require("./app");
const prisma = require("./lib/prisma");

const PORT = 3000;
const HOST = "0.0.0.0";

let server;

const startServer = async () => {
  try {
    await prisma.$connect().catch((err) => {
      console.warn("[AI Studio] Database connection notice:", err.message);
    });

    console.log("Database initialized.");

    server = app.listen(PORT, HOST, () => {
      console.log(`Inspired Institute backend running on http://${HOST}:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP server error:");
      console.error(error);
    });
  } catch (error) {
    console.error("Failed to start backend:");
    console.error(error);

    await prisma.$disconnect().catch(() => {});
    throw error;
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();

    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed:");
    console.error(error);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

startServer().catch(() => {
  process.exit(1);
});