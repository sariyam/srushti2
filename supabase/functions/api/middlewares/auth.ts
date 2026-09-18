import { Request, Response, NextFunction } from "express";
import { JwtService, JwtUserPayload } from "../services/jwt.service";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

/**
 * Middleware to verify Bearer JWT token on protected routes
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Bearer token missing.",
    });
  }

  try {
    const payload = JwtService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: error.message || "Invalid or expired token.",
    });
  }
}

/**
 * Middleware to enforce role-based permissions (e.g. admin or superadmin)
 */
export function requireRole(allowedRoles: ("user" | "admin" | "superadmin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' lacks required permissions.`,
      });
    }

    next();
  };
}
