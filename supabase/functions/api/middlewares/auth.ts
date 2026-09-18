import { Request, Response, NextFunction } from "express";
import { JwtService, JwtUserPayload } from "../services/jwt.service";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

/**
 * Middleware to verify Bearer JWT token on protected routes.
 * Throws structured UnauthorizedError on missing or malformed tokens.
 */
export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new UnauthorizedError(
        "Authentication required. Authorization header with Bearer token is missing.",
        undefined,
        "AUTH_HEADER_MISSING"
      )
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError(
        "Invalid authorization scheme. Expected 'Bearer <token>'.",
        undefined,
        "INVALID_AUTH_SCHEME"
      )
    );
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return next(
      new UnauthorizedError(
        "Bearer token cannot be empty.",
        undefined,
        "BEARER_TOKEN_EMPTY"
      )
    );
  }

  try {
    const payload = JwtService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    next(error);
  }
}

/**
 * Middleware to enforce role-based permissions (e.g. admin or superadmin).
 * Throws structured ForbiddenError if user's role is insufficient.
 */
export function requireRole(allowedRoles: ("user" | "admin" | "superadmin")[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new UnauthorizedError(
          "Authentication required before checking permissions.",
          undefined,
          "UNAUTHENTICATED"
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access forbidden. Role '${req.user.role}' lacks permissions for this endpoint. (Required: ${allowedRoles.join(", ")})`,
          { currentRole: req.user.role, requiredRoles: allowedRoles },
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
}
