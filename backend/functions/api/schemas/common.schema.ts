import { z } from "@hono/zod-openapi";

export const PaginationQuerySchema = z
  .object({
    limit: z
      .string()
      .optional()
      .openapi({
        description: "Number of records to return (1-100, default 50)",
        example: "50",
      }),
    offset: z
      .string()
      .optional()
      .openapi({
        description: "Pagination offset index",
        example: "0",
      }),
  })
  .openapi("PaginationQuery");

export const UuidParamSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: "UUID resource identifier",
      example: "570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1",
    }),
  })
  .openapi("UuidParam");

export const PhoneSchema = z
  .string()
  .min(8, "Phone number must be at least 8 characters")
  .max(15, "Phone number cannot exceed 15 characters")
  .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format (E.164 recommended, e.g. +919059108434)")
  .openapi({
    description: "E.164 formatted phone number",
    example: "+919059108434",
  });
