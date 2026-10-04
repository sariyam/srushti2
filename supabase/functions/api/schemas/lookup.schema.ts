import { z } from "@hono/zod-openapi";

export const LookupTypeEnum = z.enum([
  "background_type",
  "gender",
  "garment_category",
  "jewelry_category",
]);

export const SystemLookupModel = z
  .object({
    id: z.string().openapi({ example: "bg_indoor" }),
    type: LookupTypeEnum.openapi({ example: "background_type" }),
    code: z.string().openapi({ example: "indoor" }),
    nameEn: z.string().openapi({ example: "Indoor" }),
    nameTe: z.string().openapi({ example: "ఇండోర్" }),
    description: z.string().nullable().optional().openapi({ example: "Indoor studio lighting and settings" }),
    icon: z.string().nullable().optional().openapi({ example: "lucide:home" }),
    displayOrder: z.number().int().default(0).openapi({ example: 1 }),
    isActive: z.boolean().default(true).openapi({ example: true }),
    metadata: z.record(z.any()).default({}).openapi({ example: {} }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
  })
  .openapi("SystemLookup");

export const CreateSystemLookupSchema = z
  .object({
    id: z.string().min(2).max(64).openapi({ example: "bg_studio_minimal" }),
    type: LookupTypeEnum.openapi({ example: "background_type" }),
    code: z.string().min(1).max(64).openapi({ example: "studio_minimal" }),
    nameEn: z.string().min(1).openapi({ example: "Studio Minimalist" }),
    nameTe: z.string().min(1).openapi({ example: "స్టూడియో మినిమలిస్ట్" }),
    description: z.string().optional().openapi({ example: "Minimal clean white studio backdrop" }),
    icon: z.string().optional().openapi({ example: "lucide:camera" }),
    displayOrder: z.number().int().optional().default(0).openapi({ example: 1 }),
    isActive: z.boolean().optional().default(true).openapi({ example: true }),
    metadata: z.record(z.any()).optional().default({}).openapi({ example: {} }),
  })
  .openapi("CreateSystemLookupRequest");

export const UpdateSystemLookupSchema = z
  .object({
    nameEn: z.string().min(1).optional().openapi({ example: "Indoor Studio Lighting" }),
    nameTe: z.string().min(1).optional().openapi({ example: "ఇండోర్ స్టూడియో లైటింగ్" }),
    description: z.string().optional().openapi({ example: "Updated description for studio backdrop" }),
    icon: z.string().optional().openapi({ example: "lucide:home" }),
    displayOrder: z.number().int().optional().openapi({ example: 2 }),
    isActive: z.boolean().optional().openapi({ example: true }),
    metadata: z.record(z.any()).optional().openapi({ example: {} }),
  })
  .openapi("UpdateSystemLookupRequest");

export const SystemLookupListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    lookups: z.array(SystemLookupModel),
  })
  .openapi("SystemLookupListResponse");

export const SystemLookupResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    lookup: SystemLookupModel,
  })
  .openapi("SystemLookupResponse");

export const GroupedLookupsResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    lookups: z.object({
      backgroundTypes: z.array(SystemLookupModel),
      genders: z.array(SystemLookupModel),
      garmentCategories: z.array(SystemLookupModel),
      jewelryCategories: z.array(SystemLookupModel),
      all: z.array(SystemLookupModel),
    }),
  })
  .openapi("GroupedLookupsResponse");

export type SystemLookup = z.infer<typeof SystemLookupModel>;
export type CreateSystemLookupInput = z.infer<typeof CreateSystemLookupSchema>;
export type UpdateSystemLookupInput = z.infer<typeof UpdateSystemLookupSchema>;
