import { z } from "@hono/zod-openapi";

export const OtpPurposeEnum = z.enum(["login", "register", "recharge"]).openapi({
  description: "Purpose of the requested OTP",
  example: "login",
});

export const OtpModel = z
  .object({
    id: z.string().uuid().openapi({
      description: "Unique OTP verification record ID",
      example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    }),
    identifier: z.string().openapi({
      description: "Phone number or email receiving the OTP",
      example: "+919059108434",
    }),
    otpHash: z.string().openapi({
      description: "Bcrypt hash of the 6-digit OTP code",
    }),
    purpose: OtpPurposeEnum,
    attempts: z.number().int().openapi({
      description: "Failed validation attempt counter",
      example: 0,
    }),
    isUsed: z.boolean().openapi({
      description: "Whether the OTP has already been verified",
      example: false,
    }),
    expiresAt: z.string().datetime().or(z.date()).openapi({
      description: "Expiration timestamp (default 10 minutes)",
      example: "2026-09-18T10:10:00Z",
    }),
    createdAt: z.string().datetime().or(z.date()).openapi({
      description: "OTP generation timestamp",
      example: "2026-09-18T10:00:00Z",
    }),
  })
  .openapi("Otp");

export type Otp = z.infer<typeof OtpModel>;
export type OtpPurpose = z.infer<typeof OtpPurposeEnum>;
