const sqliteDb = require("./sqliteDb");

const databaseUrl = process.env.DATABASE_URL;
const isPlaceholderUrl = !databaseUrl || databaseUrl === "your-neon-database-url" || !databaseUrl.startsWith("postgres");

let realPrisma = null;
let useRealPrisma = false;

if (!isPlaceholderUrl) {
  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    realPrisma = new PrismaClient({ adapter });
    useRealPrisma = true;
    console.log("[Database] Initialized PrismaClient for Neon PostgreSQL.");
  } catch (err) {
    console.warn("[Database] Notice initializing Neon Prisma adapter, using persistent SQLite:", err.message);
    useRealPrisma = false;
  }
} else {
  console.log("[Database] Using persistent SQLite database (Neon URL not yet set).");
}

// Proxy wrapper that routes to realPrisma if active, or sqliteDb
const handler = {
  get(target, prop) {
    if (prop === "isNeonActive") {
      return useRealPrisma;
    }

    if (prop === "$connect") {
      return async () => {
        if (useRealPrisma && realPrisma) {
          try {
            await realPrisma.$connect();
            return true;
          } catch (err) {
            console.warn("[Neon] Connection notice, continuing with persistent local storage:", err.message);
            useRealPrisma = false;
            return true;
          }
        }
        return sqliteDb.$connect();
      };
    }

    if (prop === "$disconnect") {
      return async () => {
        if (useRealPrisma && realPrisma) {
          try {
            await realPrisma.$disconnect();
          } catch {}
        }
        return sqliteDb.$disconnect();
      };
    }

    if (prop === "$queryRaw") {
      return async (...args) => {
        if (useRealPrisma && realPrisma) {
          try {
            return await realPrisma.$queryRaw(...args);
          } catch (err) {
            console.warn("[Neon] Query notice, falling back to persistent storage:", err.message);
            useRealPrisma = false;
            return sqliteDb.$queryRaw();
          }
        }
        return sqliteDb.$queryRaw();
      };
    }

    // Model delegates: course, faculty, result, gallery, institute, enquiry, admin
    const targetModel = (useRealPrisma && realPrisma && realPrisma[prop]) ? realPrisma[prop] : sqliteDb[prop];
    const fallbackModel = sqliteDb[prop];

    if (targetModel) {
      return new Proxy(targetModel, {
        get(modelTarget, method) {
          return async (...args) => {
            if (useRealPrisma && realPrisma && typeof modelTarget[method] === "function") {
              try {
                return await modelTarget[method](...args);
              } catch (err) {
                console.warn(`[Neon] ${String(prop)}.${String(method)} notice, using persistent storage:`, err.message);
                if (fallbackModel && typeof fallbackModel[method] === "function") {
                  return await fallbackModel[method](...args);
                }
                throw err;
              }
            }

            if (fallbackModel && typeof fallbackModel[method] === "function") {
              return await fallbackModel[method](...args);
            }

            throw new Error(`Method ${String(method)} not supported on ${String(prop)}`);
          };
        },
      });
    }

    return target[prop] || sqliteDb[prop];
  },
};

const prismaProxy = new Proxy({}, handler);

module.exports = prismaProxy;
