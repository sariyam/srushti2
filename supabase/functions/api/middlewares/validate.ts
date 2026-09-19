import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { BadRequestError } from "../utils/errors";

/**
 * Validates req.body against a Zod schema.
 * Replaces req.body with the parsed/coerced object on success.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return next(result.error);
      }
      req.body = result.data;
      next();
    } catch (err: any) {
      next(new BadRequestError("Malformed JSON payload in request body", err?.message));
    }
  };
}

/**
 * Validates req.query against a Zod schema.
 * Replaces req.query with the parsed/coerced object on success.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(result.error);
    }
    req.query = result.data;
    next();
  };
}

/**
 * Validates req.params against a Zod schema (e.g. UUID verification).
 * Replaces req.params with the parsed object on success.
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(result.error);
    }
    req.params = result.data;
    next();
  };
}
