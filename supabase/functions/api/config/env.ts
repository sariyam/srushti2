import * as dotenv from "dotenv";
import { z } from "zod";

// Bridge Deno.env to process.env if running in Deno / Supabase Edge Functions
declare const Deno: any;
if (typeof Deno !== "undefined" && typeof Deno?.env?.toObject === "function") {
  try {
    const denoEnv = Deno.env.toObject();
    for (const [k, v] of Object.entries(denoEnv)) {
      if (v !== undefined && typeof v === "string") {
        process.env[k] = v;
      }
    }
  } catch (_err) {
    // Ignore if permission is denied
  }
}

// In standard Node.js environments, safely load local .env
try {
  dotenv.config();
} catch (_err) {
  // Ignore in cloud edge environments without filesystem access
}

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("*"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Supabase
  SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  SUPABASE_STORAGE_BUCKET: z.string().default("avatars"),

  // JWT
  JWT_SECRET: z.string().default("default_dev_secret_key_srushti"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().default("default_dev_refresh_secret_key_srushti"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().default("rzp_test_placeholder"),
  RAZORPAY_KEY_SECRET: z.string().default("rzp_test_secret_placeholder"),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(""),
  RAZORPAY_CHECKOUT_CONFIG_ID: z.string().optional().default("config_SVPwn8f33zfhsP"),

  // OTP & SMS Gateway
  OTP_EXPIRY_MINUTES: z.coerce.number().default(10),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(3),
  OTP_COOLDOWN_SECONDS: z.coerce.number().default(120),
  SMS_GATEWAY_PROVIDER: z.enum(["console", "fast2sms", "twilio", "colourmoon"]).default("colourmoon"),
  COLOURMOON_USER_ID: z.string().default("invtechnologies"),
  COLOURMOON_USERNAME: z.string().default("Srushti"),
  COLOURMOON_SMS_URL: z.string().default("http://colourmoontraining.com/otp_sms/sendsms"),
  FAST2SMS_API_KEY: z.string().optional(),

  // SuperAdmin
  SUPERADMIN_PHONE: z.string().default("+919876543210"),
  SUPERADMIN_EMAIL: z.string().email().default("superadmin@srushti.ai"),
  SUPERADMIN_NAME: z.string().default("Super Admin"),
  SUPERADMIN_INITIAL_CREDITS: z.coerce.number().default(1000),
});

export const env = envSchema.parse(process.env);
