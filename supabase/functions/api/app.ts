import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp(): Express {
  const app = express();

  // Determine function slug for Supabase Edge Functions
  // Matches the directory in supabase/functions/<slug> (defaults to "api")
  const functionSlug = process.env.FUNCTION_SLUG || process.env.SUPABASE_FUNCTION_SLUG || "api";

  // Security & Logging Middlewares
  app.use(
    helmet({
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

  // Explicit preflight handling for Supabase Edge Functions
  app.options("*", cors());

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  // Body Parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

  // Mount API Routes:
  // 1. Mount at /<slug> for Supabase Edge Functions (e.g. /api/health or /<slug>/health)
  app.use(`/${functionSlug}`, apiRoutes);

  // 2. Mount at /api if slug is different (for backwards compatibility)
  if (functionSlug !== "api") {
    app.use("/api", apiRoutes);
  }

  // 3. Mount at root / so direct paths work without prefix
  app.use("/", apiRoutes);

  // 404 Not Found Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
