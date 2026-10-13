import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
  .object({
    success: z.literal(false).openapi({ example: false }),
    error: z.string().openapi({
      description: "Human-readable error explanation",
      example: "Invalid credentials or expired OTP",
    }),
    code: z.string().optional().openapi({
      description: "Machine-readable error classification code",
      example: "ERR_UNAUTHORIZED",
    }),
    details: z.array(z.any()).optional().openapi({
      description: "Validation error issues or nested diagnostics",
    }),
  })
  .openapi("ErrorResponse");

export const SuccessResponseSchema = z
  .object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().optional().openapi({
      description: "Optional confirmation message",
      example: "Operation completed successfully",
    }),
  })
  .openapi("SuccessResponse");

export const HealthStatusSchema = z
  .object({
    status: z.enum(["healthy", "degraded"]).openapi({ example: "healthy" }),
    service: z.string().openapi({ example: "supabase" }),
    database: z
      .object({
        connected: z.boolean().openapi({ example: true }),
        name: z.string().optional().openapi({ example: "postgres" }),
        serverTime: z.string().optional().openapi({ example: "2026-09-18T10:00:00Z" }),
        error: z.string().optional(),
      })
      .openapi({ description: "Supabase PostgreSQL health and connection status" }),
    timestamp: z.string().openapi({ example: "2026-09-18T10:00:00.000Z" }),
    uptimeSeconds: z.number().openapi({ example: 3600 }),
  })
  .openapi("HealthStatus");

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type HealthStatus = z.infer<typeof HealthStatusSchema>;
