import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env, queryClient, checkDbConnection } from "./config";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { requestIdMiddleware } from "./middlewares/requestId";
import { NotFoundError } from "./utils/errors";

// 1. Deno Edge Runtime Environment Bridge
declare const Deno: any;
if (typeof Deno !== "undefined" && typeof Deno?.env?.toObject === "function") {
  try {
    const allEnv = Deno.env.toObject();
    for (const [key, val] of Object.entries(allEnv)) {
      if (val !== undefined && typeof val === "string") {
        process.env[key] = val;
      }
    }
  } catch (_e) {
    // Ignore if permission is denied
  }
}

// Function's slug in Supabase Edge Functions (matches supabase/functions/<slug>)
if (!process.env.FUNCTION_SLUG && !process.env.SUPABASE_FUNCTION_SLUG) {
  process.env.FUNCTION_SLUG = "api";
  process.env.SUPABASE_FUNCTION_SLUG = "api";
}

// 2. Express Application Factory
export function createApp(): Express {
  const app = express();
  const functionSlug = process.env.FUNCTION_SLUG || process.env.SUPABASE_FUNCTION_SLUG || "api";

  // Attach Unique Request Correlation ID
  app.use(requestIdMiddleware);

  // Security & Logging Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
    })
  );

  const allowedOriginsList =
    env.CORS_ORIGIN === "*"
      ? ["*"]
      : env.CORS_ORIGIN.split(",").map((s) => s.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOriginsList.includes("*") || allowedOriginsList.includes(origin)) {
          return callback(null, true);
        }
        if (env.NODE_ENV !== "production") {
          if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
          }
        }
        return callback(null, false);
      },
      credentials: true,
    })
  );

  // Preflight handling for Supabase Edge Functions
  app.options("*", cors());

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  // Body Parsing (allow 25mb for high-res AI image payloads)
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Gateway URL Normalizer:
  // If request arrives from Supabase Edge Functions Gateway (/functions/v1/<slug>/*),
  // strip the /functions/v1/<slug> prefix so Express routing matches consistently.
  app.use((req: Request, res: Response, next) => {
    const gatewayPrefix = `/functions/v1/${functionSlug}`;
    if (req.url.startsWith(gatewayPrefix)) {
      req.url = req.url.slice(gatewayPrefix.length) || "/";
    }
    next();
  });

  // Mount API Routes
  app.use(`/${functionSlug}`, apiRoutes);
  if (functionSlug !== "api") {
    app.use("/api", apiRoutes);
  }
  app.use("/", apiRoutes);

  // 404 Not Found Handler (Delegates to centralized errorHandler)
  app.use((req: Request, _res: Response, next) => {
    next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`, undefined, "ROUTE_NOT_FOUND"));
  });

  // Centralized Enterprise Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();

// 3. Serverless HTTP Handler (Vercel, AWS Lambda, Netlify)
let _serverlessHandler: any = null;
export const handler = (req: any, res: any, context?: any) => {
  if (!_serverlessHandler) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serverless = require("serverless-http");
    _serverlessHandler = serverless(app);
  }
  return _serverlessHandler(req, res, context);
};

// 4. Runtime Listener (Supabase Edge Runtime vs Node.js Server)
const isDeno = typeof Deno !== "undefined";

if (isDeno) {
  // In Supabase Edge Runtime, Deno intercepts app.listen()
  const port = Number(Deno?.env?.get?.("PORT")) || 8000;
  app.listen(port, () => {
    console.log(`🚀 Srushti AI Express Edge Function running on port ${port} (slug: ${process.env.SUPABASE_FUNCTION_SLUG})`);
  });
} else if (process.env.NODE_ENV !== "test") {
  // In Node.js environment (local dev & production containers)
  const PORT = env.PORT || 4000;
  const server = app.listen(PORT, async () => {
    console.log("==========================================");
    console.log(`🚀 Srushti AI Backend is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌱 Environment: ${env.NODE_ENV}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);

    const dbStatus = await checkDbConnection();
    if (dbStatus.success) {
      console.log(`✅ Supabase Database connected successfully! (DB: ${dbStatus.database})`);
    } else {
      console.error(`❌ Supabase Database connection failed: ${dbStatus.error}`);
    }
    console.log("==========================================");
  });

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log("🔌 Closed HTTP server connections.");
      try {
        await queryClient.end();
        console.log("📦 Supabase database connection pool closed.");
      } catch (err: any) {
        console.error("Error during DB shutdown:", err.message);
      }
      process.exit(0);
    });

    setTimeout(() => {
      console.error("⚠️ Forceful shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("unhandledRejection", (reason: any) => {
    console.error("🔥 [FATAL] Unhandled Promise Rejection:", reason?.message || reason);
    if (reason?.stack) console.error(reason.stack);
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("🔥 [FATAL] Uncaught Exception:", error.message);
    console.error(error.stack);
  });
}

export default app;
