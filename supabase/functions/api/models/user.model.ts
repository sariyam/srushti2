import { z } from "@hono/zod-openapi";

export const UserRoleEnum = z.enum(["user", "admin", "superadmin"]).openapi({
  description: "Role assigned to the user",
  example: "user",
});

export const UserModel = z
  .object({
    id: z.string().uuid().openapi({
      description: "Unique identifier for the user",
      example: "570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1",
    }),
    phone: z.string().openapi({
      description: "User phone number with country code",
      example: "+919059108434",
    }),
    role: UserRoleEnum,
    walletBalance: z.number().int().openapi({
      description: "Available generation credits in the user's wallet",
      example: 100,
    }),
    isActive: z.boolean().openapi({
      description: "Whether the user account is active",
      example: true,
    }),
    avatarUrl: z.string().url().nullable().optional().openapi({
      description: "Public URL to the user's avatar image",
      example: "https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/avatars/user-1.jpg",
    }),
    createdAt: z.string().datetime().or(z.date()).openapi({
      description: "Account creation timestamp",
      example: "2026-09-18T10:00:00Z",
    }),
    updatedAt: z.string().datetime().or(z.date()).openapi({
      description: "Last profile update timestamp",
      example: "2026-09-18T10:00:00Z",
    }),
  })
  .openapi("User");

export const UserProfileModel = UserModel.omit({
  isActive: true,
}).openapi("UserProfile");

export type User = z.infer<typeof UserModel>;
export type UserRole = z.infer<typeof UserRoleEnum>;
export type UserProfile = z.infer<typeof UserProfileModel>;
