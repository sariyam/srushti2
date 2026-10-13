import { z } from "@hono/zod-openapi";
import { UserModel } from "../models/user.model";

export const AdjustCreditsSchema = z
  .object({
    userId: z.string().uuid("Invalid user UUID").openapi({
      description: "UUID of user whose credits will be altered",
      example: "570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1",
    }),
    creditChange: z.number().int("creditChange must be an integer").openapi({
      description: "Amount of credits to add (positive) or deduct (negative)",
      example: 50,
    }),
    reason: z.string().optional().openapi({
      description: "Admin reason for manual adjustment",
      example: "Promotional promotional top-up bonus",
    }),
  })
  .openapi("AdjustCreditsRequest");

export const AdjustCreditsResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Credits updated successfully" }),
    userId: z.string().uuid().openapi({ example: "570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1" }),
    previousBalance: z.number().openapi({ example: 100 }),
    creditChange: z.number().openapi({ example: 50 }),
    newBalance: z.number().openapi({ example: 150 }),
  })
  .openapi("AdjustCreditsResponse");

export const AdminUserListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    users: z.array(UserModel),
    limit: z.number().openapi({ example: 50 }),
    offset: z.number().openapi({ example: 0 }),
    totalUsers: z.number().openapi({ example: 142 }),
  })
  .openapi("AdminUserListResponse");

export const AdminAnalyticsResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    analytics: z
      .object({
        totalUsers: z.number().openapi({ example: 142 }),
        totalPaidRevenuePaise: z.number().openapi({ example: 2500000 }),
        totalGenerationsLogged: z.number().openapi({ example: 4320 }),
      })
      .openapi("AdminAnalyticsSummary"),
  })
  .openapi("AdminAnalyticsResponse");

export type AdjustCreditsInput = z.infer<typeof AdjustCreditsSchema>;

export const adjustCreditsSchema = AdjustCreditsSchema;
