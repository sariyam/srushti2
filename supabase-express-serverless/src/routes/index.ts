import { Router } from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payment.routes";
import usageRoutes from "./usage.routes";
import adminRoutes from "./admin.routes";
import { checkDbConnection } from "../db";

const router = Router();

router.use("/auth", authRoutes);
router.use("/payments", paymentRoutes);
router.use("/usage", usageRoutes);
router.use("/admin", adminRoutes);

// Root endpoint inside API router
router.get("/", (req, res) => {
  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  res.status(200).json({
    name: "Srushti AI API",
    version: "1.0.0",
    architecture: "Supabase Edge Functions (Deno 2) + Express + Serverless + Drizzle ORM",
    slug: functionSlug,
    endpoints: {
      health: `/${functionSlug}/health`,
      auth: `/${functionSlug}/auth`,
      payments: `/${functionSlug}/payments`,
      usage: `/${functionSlug}/usage`,
      admin: `/${functionSlug}/admin`,
    },
    docs: `/${functionSlug}/health`,
  });
});

// Health check endpoint with database connectivity check
router.get("/health", async (req, res) => {
  const dbStatus = await checkDbConnection();
  const uptime = typeof process?.uptime === "function" ? Math.floor(process.uptime()) : 0;
  res.status(dbStatus.success ? 200 : 503).json({
    status: dbStatus.success ? "healthy" : "degraded",
    service: "supabase-express-serverless",
    database: {
      connected: dbStatus.success,
      ...(dbStatus.database ? { name: dbStatus.database } : {}),
      ...(dbStatus.serverTime ? { serverTime: dbStatus.serverTime } : {}),
      ...(dbStatus.error ? { error: dbStatus.error } : {}),
    },
    timestamp: new Date().toISOString(),
    uptimeSeconds: uptime,
  });
});

export default router;
