import { z } from "@hono/zod-openapi";

export const CatalogItemModel = z
  .object({
    id: z.string().openapi({ description: "Unique item ID / slug", example: "saree" }),
    businessCategoryId: z.string().nullable().optional().openapi({ description: "Parent business category ID referencing business_categories(id)", example: "garment_female" }),
    wearType: z.string().openapi({ description: "Wear Type referencing wear_types(id)", example: "full_wear" }),
    wearTypeId: z.string().optional().openapi({ description: "Alias for wearType", example: "full_wear" }),
    workspace: z.string().openapi({ description: "Workspace ID referencing workspaces(id) & business_categories(workspace)", example: "garment" }),
    genderTarget: z.string().openapi({ description: "Gender target referencing genders(id)", example: "female" }),
    nameEn: z.string().openapi({ example: "Saree" }),
    nameTe: z.string().openapi({ example: "చీర (Saree)" }),
    promptDirective: z.string().openapi({ example: "a luxurious traditional Indian silk saree with exquisite border embroidery" }),
    placementDirective: z.string().nullable().optional().openapi({ example: "The full-length garment drapes gracefully..." }),
    icon: z.string().nullable().optional().openapi({ example: "Shirt" }),
    sampleImageUrl: z.string().nullable().optional().openapi({ example: "https://example.com/sample.jpg" }),
    displayOrder: z.number().int().openapi({ example: 1 }),
    isActive: z.boolean().openapi({ example: true }),
    metadata: z.record(z.any()).optional().openapi({ example: {} }),
    presentationIds: z.array(z.string()).optional().openapi({ description: "Linked presentation IDs", example: ["model", "flat_lay"] }),
    backgroundIds: z.array(z.string()).optional().openapi({ description: "Linked background IDs [indoor + outdoor]", example: ["studio", "traditional"] }),
    poseIds: z.array(z.string()).optional().openapi({ description: "Linked pose IDs", example: ["standing_front", "standing_side"] }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
  })
  .openapi("CatalogItem");

export const CatalogQuerySchema = z
  .object({
    workspace: z.string().optional().openapi({ description: "Filter by workspace ID (e.g. garment, jewelry)", example: "garment" }),
    genderTarget: z.string().optional().openapi({ description: "Filter by gender target (e.g. female, male, unisex, all)", example: "female" }),
    businessCategoryId: z.string().optional().openapi({ description: "Filter by business category ID (e.g. garment_female)", example: "garment_female" }),
    wearType: z.string().optional().openapi({ description: "Filter by wear type (e.g. top_wear, full_wear, neck_wear)", example: "top_wear" }),
    wearTypeId: z.string().optional().openapi({ description: "Filter by wear type ID (alias)", example: "top_wear" }),
    isActive: z
      .string()
      .optional()
      .transform((val) => (val === undefined ? undefined : val === "true"))
      .openapi({ example: "true" }),
    search: z.string().optional().openapi({ example: "saree" }),
    limit: z.string().optional().openapi({ example: "50" }),
    offset: z.string().optional().openapi({ example: "0" }),
  })
  .openapi("CatalogQuery");

export const CreateCatalogItemSchema = z
  .object({
    id: z.string().min(2).max(50).openapi({ description: "Unique item slug", example: "anarkali" }),
    businessCategoryId: z.string().nullable().optional().openapi({ description: "Business Category ID referencing business_categories(id)", example: "garment_female" }),
    wearType: z.string().default("full_wear").openapi({ description: "Wear Type FK referencing wear_types(id)", example: "full_wear" }),
    wearTypeId: z.string().optional().openapi({ description: "Alias for wearType", example: "full_wear" }),
    workspace: z.string().default("garment").openapi({ description: "Workspace FK referencing workspaces(id)", example: "garment" }),
    genderTarget: z.string().default("unisex").openapi({ description: "Gender FK referencing genders(id)", example: "female" }),
    nameEn: z.string().min(1).max(100).openapi({ example: "Anarkali Suit" }),
    nameTe: z.string().min(1).max(100).openapi({ example: "అనార్కలి సూట్" }),
    promptDirective: z.string().min(5).max(1000).openapi({ example: "a regal flowing Anarkali suit with gold zari embroidery" }),
    placementDirective: z.string().max(1000).nullable().optional().openapi({ example: "Drapes gracefully with full flare down to ankles" }),
    icon: z.string().nullable().optional(),
    sampleImageUrl: z.string().url().nullable().optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
    metadata: z.record(z.any()).optional(),
    presentationIds: z.array(z.string()).optional().openapi({ description: "Multiple linked presentation mode IDs", example: ["model", "flat_lay"] }),
    backgroundIds: z.array(z.string()).optional().openapi({ description: "Multiple linked background IDs (indoor + outdoor)", example: ["studio", "traditional"] }),
    poseIds: z.array(z.string()).optional().openapi({ description: "Multiple linked pose IDs", example: ["standing_front", "standing_side"] }),
  })
  .openapi("CreateCatalogItemRequest");

export const UpdateCatalogItemSchema = CreateCatalogItemSchema.partial().omit({ id: true }).openapi("UpdateCatalogItemRequest");

export const CatalogItemListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    items: z.array(CatalogItemModel),
    total: z.number().openapi({ example: 34 }),
  })
  .openapi("CatalogItemListResponse");

export const CatalogItemResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    item: CatalogItemModel,
  })
  .openapi("CatalogItemResponse");

export type CatalogItem = z.infer<typeof CatalogItemModel>;
export type CatalogQuery = z.infer<typeof CatalogQuerySchema>;
export type CreateCatalogItemInput = z.infer<typeof CreateCatalogItemSchema>;
export type UpdateCatalogItemInput = z.infer<typeof UpdateCatalogItemSchema>;
