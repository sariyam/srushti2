import { z } from "@hono/zod-openapi";

export const WorkspaceEnum = z.enum(["garment", "jewelry", "face", "general"]).openapi({
  description: "Workspace / studio module where generation was executed",
  example: "jewelry",
});

export const GenerationStatusEnum = z.enum(["pending", "success", "failed"]).openapi({
  description: "Outcome of the AI generation request",
  example: "success",
});

export const UsageModel = z
  .object({
    id: z.string().uuid().openapi({
      description: "Unique usage log identifier",
      example: "7128527a-8f5b-4ec5-9db1-137fa7bead33",
    }),
    userId: z.string().uuid().openapi({
      description: "UUID of user consuming credits",
      example: "570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1",
    }),
    workspace: WorkspaceEnum,
    itemType: z.string().openapi({
      description: "Type of item generated (e.g. necklace, saree, portrait)",
      example: "necklace",
    }),
    creditsDeducted: z.number().int().openapi({
      description: "Credits deducted for this execution",
      example: 1,
    }),
    prompt: z.string().nullable().optional().openapi({
      description: "Prompt or generation parameters used",
      example: "South Indian traditional gold necklace on editorial model",
    }),
    status: GenerationStatusEnum,
    errorMessage: z.string().nullable().optional().openapi({
      description: "Error message if generation failed",
    }),
    latencyMs: z.number().int().nullable().optional().openapi({
      description: "Execution time in milliseconds",
      example: 2350,
    }),
    metadata: z.record(z.any()).nullable().optional().openapi({
      description: "Custom execution metadata (aspect ratio, seed, model parameters)",
    }),
    createdAt: z.string().datetime().or(z.date()).openapi({
      description: "Timestamp when generation was recorded",
      example: "2026-09-18T10:05:00Z",
    }),
  })
  .openapi("Usage");

export type Usage = z.infer<typeof UsageModel>;
export type Workspace = z.infer<typeof WorkspaceEnum>;
export type GenerationStatus = z.infer<typeof GenerationStatusEnum>;
