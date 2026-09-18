import { z } from "@hono/zod-openapi";
import { WorkspaceEnum, GenerationStatusEnum, UsageModel } from "../models/usage.model";

export const RecordUsageSchema = z
  .object({
    workspace: WorkspaceEnum,
    itemType: z.string().min(1, "itemType is required (e.g. saree, necklace)").openapi({
      description: "Category of item or garment/jewelry/face being generated",
      example: "necklace",
    }),
    creditsDeducted: z.number().int().min(0).default(1).openapi({
      description: "Credits to deduct (default 1)",
      example: 1,
    }),
    prompt: z.string().optional().openapi({
      description: "Prompt or generation parameters",
      example: "South Indian traditional bridal gold choker on model",
    }),
    status: GenerationStatusEnum.default("success"),
    errorMessage: z.string().optional().openapi({
      description: "Error message if generation failed",
    }),
    latencyMs: z.number().optional().openapi({
      description: "Generation time in milliseconds",
      example: 1840,
    }),
    metadata: z.record(z.any()).optional().openapi({
      description: "Custom metadata (resolution, aspect ratio, seed)",
    }),
  })
  .openapi("RecordUsageRequest");

export const RecordUsageResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    usageId: z.string().uuid().openapi({ example: "7128527a-8f5b-4ec5-9db1-137fa7bead33" }),
    creditsDeducted: z.number().openapi({ example: 1 }),
    remainingBalance: z.number().openapi({ example: 99 }),
  })
  .openapi("RecordUsageResponse");

export const UserBalanceResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    walletBalance: z.number().openapi({ example: 99 }),
  })
  .openapi("UserBalanceResponse");

export const UsageHistoryResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    history: z.array(UsageModel),
    total: z.number().openapi({ example: 12 }),
  })
  .openapi("UsageHistoryResponse");

export type RecordUsageInput = z.infer<typeof RecordUsageSchema>;

export const recordUsageSchema = RecordUsageSchema;
