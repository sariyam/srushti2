import * as dotenv from "dotenv";
import { z } from "zod";

declare const Deno: any;

// 1. In Deno runtime, read and parse .env file directly into Deno.env if available
if (typeof Deno !== "undefined") {
  const envCandidates = [
    ".env",
    "functions/.env",
    "supabase/functions/.env",
    "../.env",
    "../../.env",
    "../../../.env",
  ];

  for (const candidate of envCandidates) {
    try {
      if (typeof Deno.readTextFileSync === "function") {
        const text = Deno.readTextFileSync(candidate);
        for (const line of text.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (typeof Deno.env?.get === "function" && !Deno.env.get(key)) {
              Deno.env.set(key, val);
            }
          }
        }
        break;
      }
    } catch (_err) {
      // File not found or read permission not granted, try next
    }
  }
}

// 2. In standard Node.js environments, safely load local .env
try {
  dotenv.config();
  dotenv.config({ path: "functions/.env" });
  dotenv.config({ path: "supabase/functions/.env" });
  dotenv.config({ path: "../.env" });
} catch (_err) {
  // Ignore in cloud edge environments without filesystem access
}

/**
 * Reads an environment variable using Deno.env first (for Deno / Supabase Edge Functions)
 * with fallback to process.env (for standard Node.js runtime)
 */
export function getEnv(key: string, defaultValue = ""): string {
  if (typeof Deno !== "undefined" && typeof Deno?.env?.get === "function") {
    try {
      const val = Deno.env.get(key);
      if (val !== undefined && val !== null) return String(val);
    } catch (_err) {
      // Ignore if permission denied
    }
  }
  if (typeof process !== "undefined" && process?.env && process.env[key] !== undefined) {
    return String(process.env[key]);
  }
  return defaultValue;
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

  // OpenAI Server-Side Key
  OPENAI_API_KEY: z.string().optional().default(""),

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

// Build environment data object prioritizing Deno.env
const rawEnv: Record<string, any> = {};

if (typeof process !== "undefined" && process?.env) {
  Object.assign(rawEnv, process.env);
}

if (typeof Deno !== "undefined" && typeof Deno?.env?.toObject === "function") {
  try {
    Object.assign(rawEnv, Deno.env.toObject());
  } catch (_err) {
    // Ignore if permission denied
  }
}

// Explicitly query Deno.env.get for each declared schema field
if (typeof Deno !== "undefined" && typeof Deno?.env?.get === "function") {
  for (const key of Object.keys(envSchema.shape)) {
    try {
      const val = Deno.env.get(key);
      if (val !== undefined) {
        rawEnv[key] = val;
      }
    } catch (_err) {
      // Ignore if permission denied
    }
  }
}

// Sync back to process.env so dependencies relying on process.env (Express, pg, etc.) function smoothly
if (typeof process !== "undefined" && process?.env) {
  for (const [k, v] of Object.entries(rawEnv)) {
    if (v !== undefined && process.env[k] === undefined) {
      process.env[k] = v;
    }
  }
}

export const env = envSchema.parse(rawEnv);
