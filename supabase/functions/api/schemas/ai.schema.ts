import { z } from "@hono/zod-openapi";
import { WorkspaceEnum } from "../models/usage.model";

export const GenerateAiImageSchema = z
  .object({
    workspace: WorkspaceEnum.default("garment"),
    itemType: z.string().min(1, "itemType is required").default("item"),
    requiredCredits: z.number().min(0).default(1),
    prompt: z.string().min(1, "prompt is required"),
    size: z.string().default("1024x1024"),
    quality: z.string().default("low"),
    model: z.string().default("gpt-image-2.5-sunburst"),
    productImage: z.string().min(1, "productImage is required"),
    faceImage: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  })
  .openapi("GenerateAiImageRequest");

export type GenerateAiImageInput = z.infer<typeof GenerateAiImageSchema>;
export const generateAiImageSchema = GenerateAiImageSchema;
