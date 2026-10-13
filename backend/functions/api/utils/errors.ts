/**
 * Srushti AI Backend — Custom Application Error Classes
 * Provides structured, HTTP-aware operational errors across services and controllers.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = "INTERNAL_SERVER_ERROR",
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", details?: any, errorCode: string = "BAD_REQUEST") {
    super(message, 400, errorCode, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required", details?: any, errorCode: string = "UNAUTHORIZED") {
    super(message, 401, errorCode, details);
  }
}

export class PaymentRequiredError extends AppError {
  constructor(
    message: string = "Insufficient wallet credits to perform this operation",
    details?: { available?: number; required?: number; [key: string]: any },
    errorCode: string = "INSUFFICIENT_CREDITS"
  ) {
    super(message, 402, errorCode, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden", details?: any, errorCode: string = "FORBIDDEN") {
    super(message, 403, errorCode, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Requested resource was not found", details?: any, errorCode: string = "NOT_FOUND") {
    super(message, 404, errorCode, details);
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(method: string, path: string) {
    super(`HTTP method '${method}' not allowed on '${path}'`, 405, "METHOD_NOT_ALLOWED");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict", details?: any, errorCode: string = "CONFLICT") {
    super(message, 409, errorCode, details);
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message: string = "Uploaded payload exceeds maximum allowed size", details?: any) {
    super(message, 413, "PAYLOAD_TOO_LARGE", details);
  }
}

export class UnsupportedMediaTypeError extends AppError {
  constructor(message: string = "Unsupported media type", details?: any) {
    super(message, 415, "UNSUPPORTED_MEDIA_TYPE", details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed. Please verify input fields.", details?: any) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfterSeconds?: number;

  constructor(
    message: string = "Too many requests. Please slow down and try again later.",
    retryAfterSeconds?: number,
    details?: any
  ) {
    super(message, 429, "RATE_LIMIT_EXCEEDED", {
      ...(details || {}),
      ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
    });
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "An internal server error occurred", details?: any) {
    super(message, 500, "INTERNAL_SERVER_ERROR", details);
  }
}

export class BadGatewayError extends AppError {
  constructor(message: string = "Bad gateway response from upstream service", details?: any) {
    super(message, 502, "BAD_GATEWAY", details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    serviceName: string,
    message: string = "External service request failed",
    details?: any
  ) {
    super(
      `[${serviceName}] ${message}`,
      502,
      `EXTERNAL_SERVICE_ERROR_${serviceName.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`,
      details
    );
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service temporarily unavailable. Please retry shortly.", details?: any) {
    super(message, 503, "SERVICE_UNAVAILABLE", details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed or database is unreachable", details?: any) {
    super(message, 503, "DATABASE_ERROR", details);
  }
}
