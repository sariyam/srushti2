import { z } from "@hono/zod-openapi";

export const WearTypeModel = z
  .object({
    id: z.string().openapi({ example: "top_wear" }),
    workspace: z.string().openapi({ description: "Workspace ID referencing workspaces(id)", example: "garment" }),
    code: z.string().openapi({ example: "top_wear" }),
    nameEn: z.string().openapi({ example: "Top Wear" }),
    nameTe: z.string().openapi({ example: "పై దుస్తులు" }),
    description: z.string().nullable().optional().openapi({ example: "Shirts, T-shirts, Kurtis, Blouses, Tops" }),
    icon: z.string().nullable().optional().openapi({ example: "Shirt" }),
    displayOrder: z.number().int().default(0).openapi({ example: 1 }),
    isActive: z.boolean().default(true).openapi({ example: true }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
  })
  .openapi("WearType");

export const WearTypeListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    wearTypes: z.array(WearTypeModel),
  })
  .openapi("WearTypeListResponse");

export const WearTypeResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    wearType: WearTypeModel,
  })
  .openapi("WearTypeResponse");

export const WearTypeQuerySchema = z
  .object({
    workspace: z.string().optional().openapi({ description: "Filter by workspace (e.g. garment, jewelry)", example: "garment" }),
    isActive: z
      .string()
      .optional()
      .transform((val) => (val === undefined ? undefined : val === "true"))
      .openapi({ example: "true" }),
  })
  .openapi("WearTypeQuery");

export const CreateWearTypeSchema = z
  .object({
    id: z.string().min(2).max(50).openapi({ example: "footwear" }),
    workspace: z.string().min(2).max(50).default("garment").openapi({ example: "garment" }),
    code: z.string().min(2).max(50).openapi({ example: "footwear" }),
    nameEn: z.string().min(1).max(100).openapi({ example: "Footwear" }),
    nameTe: z.string().min(1).max(100).openapi({ example: "పాదరక్షలు" }),
    description: z.string().max(255).optional(),
    icon: z.string().max(100).optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  })
  .openapi("CreateWearTypeRequest");

export const UpdateWearTypeSchema = CreateWearTypeSchema.partial().omit({ id: true }).openapi("UpdateWearTypeRequest");

export type WearTypeModelType = z.infer<typeof WearTypeModel>;
export type CreateWearTypeInput = z.infer<typeof CreateWearTypeSchema>;
export type UpdateWearTypeInput = z.infer<typeof UpdateWearTypeSchema>;
