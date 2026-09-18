import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { AppError, RateLimitError } from "../utils/errors";
import { env } from "../config";

interface StandardErrorResponse {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  details?: any;
  path: string;
  method: string;
  requestId: string;
  timestamp: string;
  stack?: string;
}

/**
 * Enterprise-grade Centralized Error Handling Middleware for Srushti AI Backend.
 * Captures operational errors, schema violations, database constraints,
 * auth anomalies, and unexpected runtime faults with unified JSON responses.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const timestamp = new Date().toISOString();
  const requestId = req.id || (req.headers["x-request-id"] as string) || (req.headers["sb-request-id"] as string) || "req-unknown";
  const isProduction = env.NODE_ENV === "production";

  // Base response builder helper
  const sendResponse = (
    statusCode: number,
    code: string,
    message: string,
    details?: any
  ) => {
    const payload: StandardErrorResponse = {
      success: false,
      error: message,
      code,
      statusCode,
      ...(details !== undefined ? { details } : {}),
      path: req.originalUrl || req.url,
      method: req.method,
      requestId,
      timestamp,
      ...(!isProduction && err?.stack ? { stack: err.stack } : {}),
    };

    // Set Retry-After header if provided
    if (err instanceof RateLimitError && err.retryAfterSeconds) {
      res.setHeader("Retry-After", err.retryAfterSeconds);
    }

    return res.status(statusCode).json(payload);
  };

  // 1. Custom Application Operational Errors (AppError and derived subclasses)
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      console.error(`🔥 [${requestId}] Operational 5xx Error:`, {
        code: err.errorCode,
        message: err.message,
        details: err.details,
        path: req.originalUrl,
        user: req.user?.userId,
      });
    }
    return sendResponse(err.statusCode, err.errorCode, err.message, err.details);
  }

  // 2. Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
      code: issue.code,
      ...(issue.code === "invalid_type"
        ? { expected: (issue as any).expected, received: (issue as any).received }
        : {}),
    }));

    return sendResponse(
      400,
      "VALIDATION_ERROR",
      "Input validation failed. Please check the provided payload.",
      formattedDetails
    );
  }

  // 3. PostgreSQL & Drizzle ORM Database Constraint Errors
  if (err?.code) {
    const pgCode = String(err.code);

    // 23505: Unique violation (e.g. duplicate phone, email, razorpay order)
    if (pgCode === "23505") {
      const detailMsg = String(err.detail || "");
      let userFriendlyMessage = "A record with this unique identifier already exists.";

      if (detailMsg.includes("phone")) {
        userFriendlyMessage = "A user account with this phone number is already registered.";
      } else if (detailMsg.includes("email")) {
        userFriendlyMessage = "A user account with this email address already exists.";
      } else if (detailMsg.includes("razorpay_order_id")) {
        userFriendlyMessage = "This Razorpay payment order has already been logged.";
      }

      return sendResponse(409, "UNIQUE_CONSTRAINT_VIOLATION", userFriendlyMessage, {
        constraint: err.constraint,
        detail: isProduction ? undefined : err.detail,
      });
    }

    // 23503: Foreign key violation
    if (pgCode === "23503") {
      return sendResponse(
        400,
        "FOREIGN_KEY_VIOLATION",
        "Referenced record does not exist or relation constraint was violated.",
        {
          constraint: err.constraint,
          table: err.table,
          detail: isProduction ? undefined : err.detail,
        }
      );
    }

    // 23502: Not null column violation
    if (pgCode === "23502") {
      return sendResponse(
        400,
        "NOT_NULL_VIOLATION",
        `Missing required database field '${err.column || "unknown"}'.`,
        { column: err.column }
      );
    }

    // 22P02: Invalid input syntax (e.g. invalid UUID format or integer parsing)
    if (pgCode === "22P02") {
      return sendResponse(
        400,
        "INVALID_INPUT_SYNTAX",
        "Invalid format or data type provided for database identifier or parameter.",
        isProduction ? undefined : { originalError: err.message }
      );
    }

    // 22001: String length truncation
    if (pgCode === "22001") {
      return sendResponse(
        400,
        "DATA_TOO_LONG",
        "Provided text value exceeds the maximum allowable character length."
      );
    }

    // 40001 / 40P01: Transaction serialization failure or deadlock
    if (pgCode === "40001" || pgCode === "40P01") {
      return sendResponse(
        409,
        "TRANSACTION_CONCURRENCY_CONFLICT",
        "A concurrent database update conflict occurred. Please retry your request shortly."
      );
    }

    // Database connection / pool failure
    if (
      pgCode === "ECONNREFUSED" ||
      pgCode === "ETIMEDOUT" ||
      pgCode === "57P01" ||
      pgCode.startsWith("08")
    ) {
      console.error(`🔥 [${requestId}] PostgreSQL Connection Drop:`, err.message);
      return sendResponse(
        503,
        "DATABASE_UNAVAILABLE",
        "Database service is temporarily unreachable. Please retry in a few moments."
      );
    }
  }

  // 4. JWT Authentication & Token Errors
  if (err?.name === "TokenExpiredError") {
    return sendResponse(
      401,
      "TOKEN_EXPIRED",
      "Your authentication session has expired. Please log in again to renew your access."
    );
  }

  if (err?.name === "JsonWebTokenError") {
    return sendResponse(
      401,
      "INVALID_TOKEN",
      "Authentication token is malformed or invalid. Please log in again."
    );
  }

  if (err?.name === "NotBeforeError") {
    return sendResponse(
      401,
      "TOKEN_NOT_ACTIVE",
      "Authentication token is not yet active."
    );
  }

  // 5. Multer File Upload Failures
  if (err instanceof MulterError) {
    let message = `File upload failed: ${err.message}`;
    let code = `UPLOAD_${err.code}`;
    let statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 413;
      code = "FILE_TOO_LARGE";
      message = "Uploaded file exceeds the maximum allowed size limit of 10MB.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      code = "UNEXPECTED_FILE_FIELD";
      message = `Unexpected upload field '${err.field}'. Expected 'avatar'.`;
    }

    return sendResponse(statusCode, code, message, { field: err.field });
  }

  // 6. JSON Body Parser Malformed Syntax
  if (err instanceof SyntaxError && "body" in err) {
    return sendResponse(
      400,
      "INVALID_JSON_PAYLOAD",
      "Malformed JSON payload in request body. Please check quotation and syntax."
    );
  }

  // 7. Razorpay SDK Payment Gateway Errors
  if (err?.error && typeof err.error === "object" && err.error?.description) {
    console.error(`💳 [${requestId}] Razorpay Gateway Error:`, err.error);
    return sendResponse(
      err.statusCode || 400,
      `RAZORPAY_${err.error.code || "ERROR"}`,
      err.error.description,
      isProduction ? undefined : err.error
    );
  }

  // 8. CORS Blocked Origin
  if (err?.message && err.message.includes("Not allowed by CORS")) {
    return sendResponse(
      403,
      "CORS_ORIGIN_DENIED",
      "Cross-Origin request blocked. Origin is not allowed."
    );
  }

  // 9. Generic & Uncaught Errors (HTTP 500)
  console.error(`🔥 [${requestId}] Uncaught Internal Server Error:`, {
    message: err?.message,
    stack: err?.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.userId,
  });

  const statusCode =
    typeof err?.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;

  const fallbackMessage = isProduction
    ? "An unexpected internal server error occurred. Please contact support or retry later."
    : err?.message || "Internal Server Error";

  return sendResponse(statusCode, "INTERNAL_SERVER_ERROR", fallbackMessage);
}
