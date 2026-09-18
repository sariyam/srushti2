import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

/**
 * Middleware that attaches a unique X-Request-Id to each incoming HTTP request.
 * Useful for correlating frontend user actions with backend logs and error reports.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incomingId =
    (req.headers["x-request-id"] as string) ||
    (req.headers["sb-request-id"] as string);

  const requestId = incomingId && incomingId.trim().length > 0 ? incomingId.trim() : crypto.randomUUID();

  req.id = requestId;
  res.setHeader("X-Request-Id", requestId);

  next();
}
