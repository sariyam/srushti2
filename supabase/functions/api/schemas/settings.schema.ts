import { z } from "@hono/zod-openapi";

export const SystemSettingModel = z
  .object({
    key: z.string().openapi({ example: "ai_gateway" }),
    category: z.enum(["ai", "pricing", "fidelity", "security", "general"]).openapi({ example: "ai" }),
    value: z.record(z.any()).openapi({ example: { defaultModel: "gpt-image-2.5-sunburst" } }),
    description: z.string().nullable().optional().openapi({ example: "AI Model Gateway Configuration" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
  })
  .openapi("SystemSetting");

export const UpdateSystemSettingSchema = z
  .object({
    category: z.enum(["ai", "pricing", "fidelity", "security", "general"]).optional().openapi({ example: "ai" }),
    value: z.record(z.any()).openapi({ example: { defaultModel: "gpt-image-2.5-sunburst" } }),
    description: z.string().optional().openapi({ example: "Updated AI parameters" }),
  })
  .openapi("UpdateSystemSettingRequest");

export const SystemSettingListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    settings: z.array(SystemSettingModel),
  })
  .openapi("SystemSettingListResponse");

export const SystemSettingResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    setting: SystemSettingModel,
  })
  .openapi("SystemSettingResponse");

export type SystemSetting = z.infer<typeof SystemSettingModel>;
export type UpdateSystemSettingInput = z.infer<typeof UpdateSystemSettingSchema>;
