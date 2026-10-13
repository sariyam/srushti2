import { Router, Request, Response, NextFunction } from "express";
import fs from "node:fs";
import { StorageService } from "../services/storage.service";
import { JwtService } from "../services/jwt.service";
import { UnauthorizedError, NotFoundError } from "../utils/errors";

const router = Router();

/**
 * Authentication middleware for StorageBucket files.
 * Enforces that ONLY online authenticated users with a valid JWT token
 * can access and view files in StorageBucket.
 * 
 * Supports both:
 * 1. Authorization: Bearer <token> (API / fetch requests)
 * 2. ?token=<token> query parameter (for direct <img> tags, downloads & previews)
 */
export function requireStorageAuth(req: Request, _res: Response, next: NextFunction) {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  }

  // Fallback to query parameter (e.g. /api/storage/avatars/pic.jpg?token=...)
  if (!token && typeof req.query.token === "string" && req.query.token.trim().length > 0) {
    token = req.query.token.trim();
  }

  // Fallback to x-access-token header
  if (!token && typeof req.headers["x-access-token"] === "string") {
    token = req.headers["x-access-token"].trim();
  }

  if (!token) {
    return next(
      new UnauthorizedError(
        "Access denied. Only online authenticated users can access files in StorageBucket. Please provide a valid Bearer token.",
        undefined,
        "STORAGE_AUTH_REQUIRED"
      )
    );
  }

  try {
    const payload = JwtService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    return next(
      new UnauthorizedError(
        `Invalid or expired authentication token for StorageBucket: ${err?.message || "Unauthorized"}`,
        undefined,
        "STORAGE_TOKEN_INVALID"
      )
    );
  }
}

/**
 * GET /api/storage/stats
 * Diagnostic statistics for StorageBucket (requires online auth)
 */
router.get("/stats", requireStorageAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await StorageService.getStorageStats();
    res.json({
      success: true,
      storage: {
        bucketName: "StorageBucket",
        rootDirectory: stats.rootPath,
        bucketCount: stats.bucketCount,
        totalFiles: stats.totalFiles,
        totalSizeBytes: stats.totalSizeBytes,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/storage/:bucket/*
 * Serves files strictly to online authenticated users
 */
router.get("/:bucket/*", requireStorageAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bucket = req.params.bucket;
    const rawSubPath = (req.params as any)[0] || "";

    if (!rawSubPath) {
      throw new NotFoundError("File path not specified");
    }

    const file = await StorageService.getFile(bucket, rawSubPath);

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Length", file.size);
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.setHeader("X-Storage-Bucket", bucket);

    const stream = fs.createReadStream(file.filePath);
    stream.on("error", (streamErr) => {
      next(streamErr);
    });

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
