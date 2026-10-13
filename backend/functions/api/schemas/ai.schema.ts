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
    presentationMode: z
      .string()
      .optional()
      .openapi({
        description: "Presentation mode (e.g. 'model', 'partial_face', 'no_face', 'mannequin'). Face image reference is strictly applied only when mode is 'model' or 'partial_face'.",
        example: "model",
      }),
    faceImage: z
      .string()
      .optional()
      .openapi({
        description: "Reference image URL or base64 data of the human model face for 100% facial identity preservation.",
      }),
    metadata: z.record(z.any()).optional(),
  })
  .openapi("GenerateAiImageRequest");

export type GenerateAiImageInput = z.infer<typeof GenerateAiImageSchema>;
export const generateAiImageSchema = GenerateAiImageSchema;

export const GenerateAiImageResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    imageUrl: z.string().optional().openapi({ example: "https://example.com/photos/generated.png" }),
    remainingCredits: z.number().openapi({ example: 49 }),
    latencyMs: z.number().optional().openapi({ example: 1420 }),
    usageLog: z.any().optional(),
    faceFidelityApplied: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("GenerateAiImageResponse");

