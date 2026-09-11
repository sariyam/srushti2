import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { AppError } from "../utils/errors";
import { env } from "../config/env";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const timestamp = new Date().toISOString();

  // 1. Custom Application Operational Errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.errorCode,
      ...(err.details ? { details: err.details } : {}),
      timestamp,
    });
  }

  // 2. Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));

    return res.status(400).json({
      success: false,
      error: "Validation failed. Please check the provided inputs.",
      code: "VALIDATION_ERROR",
      details: formattedDetails,
      timestamp,
    });
  }

  // 3. PostgreSQL / Drizzle Database Constraint Errors
  if (err?.code === "23505") {
    // Unique violation (e.g. users_phone_unique, users_email_unique)
    const detailMsg = err.detail || "";
    let cleanMsg = "A record with this identifier already exists.";
    if (detailMsg.includes("phone")) {
      cleanMsg = "A user account with this phone number already exists.";
    } else if (detailMsg.includes("email")) {
      cleanMsg = "A user account with this email address already exists.";
    }

    return res.status(409).json({
      success: false,
      error: cleanMsg,
      code: "UNIQUE_CONSTRAINT_VIOLATION",
      timestamp,
    });
  }

  if (err?.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      success: false,
      error: "Invalid reference. The associated parent record was not found.",
      code: "FOREIGN_KEY_VIOLATION",
      timestamp,
    });
  }

  // Database connection or pool failure
  if (
    err?.code === "ECONNREFUSED" ||
    err?.code === "ETIMEDOUT" ||
    err?.name === "PostgresError" && err?.message?.includes("Connection")
  ) {
    console.error("🔥 Database Connection Error:", err.message);
    return res.status(503).json({
      success: false,
      error: "Database service is temporarily unavailable. Please retry shortly.",
      code: "DATABASE_UNAVAILABLE",
      timestamp,
    });
  }

  // 4. JWT Authentication Errors
  if (err?.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Your session has expired. Please log in again.",
      code: "TOKEN_EXPIRED",
      timestamp,
    });
  }

  if (err?.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid authentication token. Please log in again.",
      code: "INVALID_TOKEN",
      timestamp,
    });
  }

  // 5. Multer File Upload Errors
  if (err instanceof MulterError) {
    let multerMsg = `Upload error: ${err.message}`;
    if (err.code === "LIMIT_FILE_SIZE") {
      multerMsg = "Uploaded file exceeds the maximum allowed size (10MB).";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      multerMsg = `Unexpected upload field: '${err.field}'. Expected 'avatar'.`;
    }

    return res.status(400).json({
      success: false,
      error: multerMsg,
      code: `UPLOAD_${err.code}`,
      timestamp,
    });
  }

  // 6. JSON Body Parser Malformed Syntax Errors
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload in request body.",
      code: "INVALID_JSON",
      timestamp,
    });
  }

  // 7. General Unexpected Errors (500)
  console.error("🔥 Unexpected Server Error:", {
    message: err?.message,
    stack: err?.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  const statusCode = typeof err?.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode
    : 500;

  const isProduction = env.NODE_ENV === "production";

  return res.status(statusCode).json({
    success: false,
    error: isProduction ? "An unexpected server error occurred. Please try again later." : (err?.message || "Internal Server Error"),
    code: "INTERNAL_SERVER_ERROR",
    ...(isProduction ? {} : { stack: err?.stack }),
    timestamp,
  });
}
