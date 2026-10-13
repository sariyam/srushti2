import { z } from "@hono/zod-openapi";

export const GenderModel = z
  .object({
    id: z.string().openapi({ example: "female" }),
    code: z.string().openapi({ example: "female" }),
    nameEn: z.string().openapi({ example: "Female" }),
    nameTe: z.string().openapi({ example: "మహిళ" }),
    description: z.string().nullable().optional().openapi({ example: "Targeting women's apparel and accessories" }),
    icon: z.string().nullable().optional().openapi({ example: "lucide:sparkles" }),
    displayOrder: z.number().int().default(0).openapi({ example: 1 }),
    isActive: z.boolean().default(true).openapi({ example: true }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
  })
  .openapi("Gender");

export const CreateGenderSchema = z
  .object({
    id: z.string().min(2).max(64).openapi({ example: "custom_gender" }),
    code: z.string().min(2).max(64).openapi({ example: "custom_gender" }),
    nameEn: z.string().min(1).openapi({ example: "Custom Gender" }),
    nameTe: z.string().min(1).openapi({ example: "కస్టమ్ జెండర్" }),
    description: z.string().optional().openapi({ example: "Custom gender demographic" }),
    icon: z.string().optional().openapi({ example: "lucide:users" }),
    displayOrder: z.number().int().optional().default(0).openapi({ example: 5 }),
    isActive: z.boolean().optional().default(true).openapi({ example: true }),
  })
  .openapi("CreateGenderRequest");

export const UpdateGenderSchema = z
  .object({
    nameEn: z.string().min(1).optional().openapi({ example: "Updated Gender Name" }),
    nameTe: z.string().min(1).optional().openapi({ example: "నవీకరించిన పేరు" }),
    description: z.string().optional().openapi({ example: "Updated description" }),
    icon: z.string().optional().openapi({ example: "lucide:sparkles" }),
    displayOrder: z.number().int().optional().openapi({ example: 1 }),
    isActive: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("UpdateGenderRequest");

export const GenderListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    genders: z.array(GenderModel),
  })
  .openapi("GenderListResponse");

export const GenderResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    gender: GenderModel,
  })
  .openapi("GenderResponse");

export type GenderType = z.infer<typeof GenderModel>;
export type CreateGenderInput = z.infer<typeof CreateGenderSchema>;
export type UpdateGenderInput = z.infer<typeof UpdateGenderSchema>;
