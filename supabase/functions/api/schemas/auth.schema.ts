import { z } from "@hono/zod-openapi";
import { OtpPurposeEnum } from "../models/otp.model";
import { UserModel, UserProfileModel } from "../models/user.model";

export const SendOtpSchema = z
  .object({
    identifier: z.string().min(3, "Phone number or email is required").openapi({
      description: "User phone number or email address",
      example: "+919059108434",
    }),
    purpose: OtpPurposeEnum.optional().default("login").openapi({
      description: "OTP authentication intent",
      example: "login",
    }),
  })
  .openapi("SendOtpRequest");

export const SendOtpResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "OTP sent successfully" }),
    expiresInSeconds: z.number().openapi({ example: 600 }),
  })
  .openapi("SendOtpResponse");

export const VerifyOtpSchema = z
  .object({
    identifier: z.string().min(3, "Phone number or email is required").openapi({
      description: "User phone number or email address used when sending OTP",
      example: "+919059108434",
    }),
    code: z.string().length(6, "OTP must be exactly 6 digits").openapi({
      description: "6-digit OTP code received via SMS/Email",
      example: "123456",
    }),
    purpose: OtpPurposeEnum.optional().default("login").openapi({
      description: "OTP purpose matching the request",
      example: "login",
    }),
  })
  .openapi("VerifyOtpRequest");

export const VerifyOtpResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    user: UserProfileModel,
    tokens: z
      .object({
        accessToken: z.string().openapi({ description: "Short-lived JWT access token" }),
        refreshToken: z.string().openapi({ description: "Long-lived JWT refresh token" }),
        expiresIn: z.string().openapi({ example: "7d" }),
      })
      .openapi("AuthTokens"),
    isNewUser: z.boolean().openapi({ example: false }),
  })
  .openapi("VerifyOtpResponse");

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1, "Refresh token is required").openapi({
      description: "Valid refresh token previously issued",
    }),
  })
  .openapi("RefreshTokenRequest");

export const RefreshTokenResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    tokens: z
      .object({
        accessToken: z.string().openapi({ description: "Renewed JWT access token" }),
        refreshToken: z.string().openapi({ description: "Renewed JWT refresh token" }),
        expiresIn: z.string().openapi({ example: "7d" }),
      })
      .openapi("RefreshedAuthTokens"),
  })
  .openapi("RefreshTokenResponse");

export const UserMeResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    user: UserProfileModel,
  })
  .openapi("UserMeResponse");

export const UpdateProfileSchema = z
  .object({
    avatarUrl: z.string().url("Invalid avatar image URL").optional().openapi({
      description: "Updated avatar storage URL",
      example: "https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/avatars/avatar.jpg",
    }),
  })
  .openapi("UpdateProfileRequest");

export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const sendOtpSchema = SendOtpSchema;
export const verifyOtpSchema = VerifyOtpSchema;
export const refreshTokenSchema = RefreshTokenSchema;
export const updateProfileSchema = UpdateProfileSchema;
