import { z } from "@hono/zod-openapi";

export const BusinessCategoryModel = z
  .object({
    id: z.string().openapi({ description: "Unique identifier / slug", example: "garment_female" }),
    workspace: z.enum(["garment", "jewelry", "general"]).openapi({ example: "garment" }),
    genderTarget: z.enum(["female", "male", "all"]).openapi({ example: "female" }),
    nameEn: z.string().openapi({ example: "Female Collection" }),
    nameTe: z.string().openapi({ example: "మహిళల కలెక్షన్" }),
    icon: z.string().nullable().optional().openapi({ example: "Sparkles" }),
    bannerUrl: z.string().nullable().optional().openapi({ example: "https://example.com/banner.jpg" }),
    displayOrder: z.number().int().openapi({ example: 1 }),
    isActive: z.boolean().openapi({ example: true }),
    metadata: z.record(z.any()).optional().openapi({ example: {} }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
  })
  .openapi("BusinessCategory");

export const CreateBusinessCategorySchema = z
  .object({
    id: z.string().min(2).max(50).openapi({ description: "Unique category ID", example: "garment_kids" }),
    workspace: z.enum(["garment", "jewelry", "general"]).default("garment").openapi({ example: "garment" }),
    genderTarget: z.enum(["female", "male", "all"]).default("all").openapi({ example: "all" }),
    nameEn: z.string().min(1).max(100).openapi({ example: "Kids Ethnic Wear" }),
    nameTe: z.string().min(1).max(100).openapi({ example: "పిల్లల దుస్తులు" }),
    icon: z.string().optional().openapi({ example: "Sparkles" }),
    bannerUrl: z.string().url().optional().openapi({ example: "https://example.com/banner.jpg" }),
    displayOrder: z.number().int().default(0).openapi({ example: 5 }),
    isActive: z.boolean().default(true).openapi({ example: true }),
    metadata: z.record(z.any()).optional(),
  })
  .openapi("CreateBusinessCategoryRequest");

export const UpdateBusinessCategorySchema = CreateBusinessCategorySchema.partial().omit({ id: true }).openapi("UpdateBusinessCategoryRequest");

export const BusinessCategoryListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    categories: z.array(BusinessCategoryModel),
  })
  .openapi("BusinessCategoryListResponse");

export const BusinessCategoryResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    category: BusinessCategoryModel,
  })
  .openapi("BusinessCategoryResponse");

export type BusinessCategory = z.infer<typeof BusinessCategoryModel>;
export type CreateBusinessCategoryInput = z.infer<typeof CreateBusinessCategorySchema>;
export type UpdateBusinessCategoryInput = z.infer<typeof UpdateBusinessCategorySchema>;
