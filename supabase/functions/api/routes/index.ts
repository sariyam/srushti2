import { Router } from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payment.routes";
import usageRoutes from "./usage.routes";
import adminRoutes from "./admin.routes";
import aiRoutes from "./ai.routes";
import { checkDbConnection } from "../config";

const router = Router();

router.use("/auth", authRoutes);
router.use("/payments", paymentRoutes);
router.use("/usage", usageRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);

import {
  getOpenApiDocument,
  renderSwaggerDocsHtml,
  renderScalarDocsHtml,
} from "../docs";

// Cache for OpenAPI document to avoid recomputing on every request
const specCache = new Map<string, any>();

function getCachedOpenApiDocument(baseUrl: string) {
  if (!specCache.has(baseUrl)) {
    specCache.set(baseUrl, getOpenApiDocument(baseUrl));
  }
  return specCache.get(baseUrl);
}

// OpenAPI Specification (JSON)
router.get("/docs/openapi.json", (req, res) => {
  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  const baseUrl = req.baseUrl ? `${req.protocol}://${req.get("host")}${req.baseUrl}` : `/${functionSlug}`;
  const spec = getCachedOpenApiDocument(baseUrl);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.status(200).json(spec);
});

router.get("/openapi.json", (req, res) => {
  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  const baseUrl = req.baseUrl ? `${req.protocol}://${req.get("host")}${req.baseUrl}` : `/${functionSlug}`;
  const spec = getCachedOpenApiDocument(baseUrl);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.status(200).json(spec);
});

// Interactive API Documentation (Swagger UI - Primary)
router.get(["/docs", "/docs/", "/docs/swagger"], (req, res) => {
  // Prevent 304 Not Modified caching on docs so browser always re-evaluates
  delete req.headers["if-none-match"];
  delete req.headers["if-modified-since"];

  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  const baseUrl = req.baseUrl ? `${req.protocol}://${req.get("host")}${req.baseUrl}` : `/${functionSlug}`;
  const spec = getCachedOpenApiDocument(baseUrl);
  const html = renderSwaggerDocsHtml(spec, "Srushti AI API Documentation");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.status(200).send(html);
});

// Alternative Documentation View (Scalar UI)
router.get(["/docs/scalar", "/docs/scalar/"], (req, res) => {
  delete req.headers["if-none-match"];
  delete req.headers["if-modified-since"];

  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  const baseUrl = req.baseUrl ? `${req.protocol}://${req.get("host")}${req.baseUrl}` : `/${functionSlug}`;
  const spec = getCachedOpenApiDocument(baseUrl);
  const html = renderScalarDocsHtml(spec, "Srushti AI API Reference (Scalar)");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.status(200).send(html);
});

// Root endpoint inside API router
router.get("/", (req, res) => {
  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  res.status(200).json({
    name: "Srushti AI API",
    version: "1.0.0",
    architecture: "Supabase Edge Functions (Deno 2) + Express + Serverless + Drizzle ORM + OpenAPI",
    slug: functionSlug,
    endpoints: {
      docs: `/${functionSlug}/docs`,
      docs_swagger: `/${functionSlug}/docs`,
      docs_scalar: `/${functionSlug}/docs/scalar`,
      openapi: `/${functionSlug}/docs/openapi.json`,
      health: `/${functionSlug}/health`,
      auth: `/${functionSlug}/auth`,
      payments: `/${functionSlug}/payments`,
      usage: `/${functionSlug}/usage`,
      admin: `/${functionSlug}/admin`,
      ai: `/${functionSlug}/ai`,
    },
    docs: `/${functionSlug}/docs`,
  });
});

// Health check endpoint with database connectivity check
router.get("/health", async (req, res) => {
  const dbStatus = await checkDbConnection();
  const uptime = typeof process?.uptime === "function" ? Math.floor(process.uptime()) : 0;
  res.status(dbStatus.success ? 200 : 503).json({
    status: dbStatus.success ? "healthy" : "degraded",
    service: "supabase",
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
