import { z } from "@hono/zod-openapi";

export const WorkspaceModel = z
  .object({
    id: z.string().openapi({ example: "garment" }),
    code: z.string().openapi({ example: "garment" }),
    nameEn: z.string().openapi({ example: "Garment Studio" }),
    nameTe: z.string().openapi({ example: "దుస్తుల స్టూడియో" }),
    description: z.string().nullable().optional().openapi({ example: "Apparel, sarees, and clothing studio" }),
    icon: z.string().nullable().optional().openapi({ example: "Shirt" }),
    displayOrder: z.number().int().default(0).openapi({ example: 1 }),
    isActive: z.boolean().default(true).openapi({ example: true }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-04T00:00:00Z" }),
  })
  .openapi("Workspace");

export const WorkspaceListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    workspaces: z.array(WorkspaceModel),
  })
  .openapi("WorkspaceListResponse");

export const WorkspaceResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    workspace: WorkspaceModel,
  })
  .openapi("WorkspaceResponse");

export const CreateWorkspaceSchema = z
  .object({
    id: z.string().min(2).max(50).openapi({ example: "footwear" }),
    code: z.string().min(2).max(50).openapi({ example: "footwear" }),
    nameEn: z.string().min(1).max(100).openapi({ example: "Footwear Studio" }),
    nameTe: z.string().min(1).max(100).openapi({ example: "పాదరక్షల స్టూడియో" }),
    description: z.string().max(255).optional(),
    icon: z.string().max(100).optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  })
  .openapi("CreateWorkspaceRequest");

export const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial().omit({ id: true }).openapi("UpdateWorkspaceRequest");

export type WorkspaceType = z.infer<typeof WorkspaceModel>;
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
