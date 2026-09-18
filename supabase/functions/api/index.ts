var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// functions/api/entry.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// functions/api/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// functions/api/config/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// functions/api/config/schema.ts
var schema_exports = {};
__export(schema_exports, {
  otps: () => otps,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  usage: () => usage,
  usageRelations: () => usageRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull().unique(),
    avatarUrl: text("avatar_url"),
    role: text("role", { enum: ["user", "admin", "superadmin"] }).notNull().default("user"),
    walletBalance: integer("wallet_balance").notNull().default(10),
    // default free credits
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("users_phone_idx").on(table.phone)
  ]
);
var otps = pgTable(
  "otps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    // Phone or email
    codeHash: text("code_hash").notNull(),
    // Bcrypt hashed OTP code
    purpose: text("purpose", { enum: ["login", "register", "recharge"] }).notNull().default("login"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    isUsed: boolean("is_used").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("otps_identifier_idx").on(table.identifier),
    index("otps_expires_at_idx").on(table.expiresAt)
  ]
);
var payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    amount: integer("amount").notNull(),
    // in paise (e.g. 10000 = ₹100)
    currency: text("currency").notNull().default("INR"),
    status: text("status", { enum: ["created", "paid", "failed"] }).notNull().default("created"),
    creditsAdded: integer("credits_added").notNull().default(0),
    metadata: jsonb("metadata").$type(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("payments_user_id_idx").on(table.userId),
    index("payments_razorpay_order_id_idx").on(table.razorpayOrderId)
  ]
);
var usage = pgTable(
  "usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    workspace: text("workspace", { enum: ["garment", "jewelry", "face", "general"] }).notNull().default("garment"),
    itemType: text("item_type").notNull(),
    // e.g. 'saree', 'lehenga', 'necklace', etc.
    creditsDeducted: integer("credits_deducted").notNull().default(1),
    prompt: text("prompt"),
    status: text("status", { enum: ["pending", "success", "failed"] }).notNull().default("pending"),
    errorMessage: text("error_message"),
    latencyMs: integer("latency_ms"),
    metadata: jsonb("metadata").$type(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("usage_user_id_idx").on(table.userId),
    index("usage_workspace_idx").on(table.workspace),
    index("usage_created_at_idx").on(table.createdAt)
  ]
);
var usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  usageLogs: many(usage)
}));
var paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  })
}));
var usageRelations = relations(usage, ({ one }) => ({
  user: one(users, {
    fields: [usage.userId],
    references: [users.id]
  })
}));

// functions/api/config/env.ts
import * as dotenv from "dotenv";
import { z } from "zod";
if (typeof Deno !== "undefined" && typeof Deno?.env?.toObject === "function") {
  try {
    const denoEnv = Deno.env.toObject();
    for (const [k, v] of Object.entries(denoEnv)) {
      if (v !== void 0 && typeof v === "string") {
        process.env[k] = v;
      }
    }
  } catch (_err) {
  }
}
try {
  dotenv.config();
} catch (_err) {
}
var envSchema = z.object({
  PORT: z.coerce.number().default(4e3),
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
  SUPERADMIN_INITIAL_CREDITS: z.coerce.number().default(1e3)
});
var env = envSchema.parse(process.env);

// functions/api/config/index.ts
var isPooler = env.DATABASE_URL.includes("6543") || env.DATABASE_URL.includes("pgbouncer");
var queryClient = postgres(env.DATABASE_URL, {
  prepare: !isPooler,
  ssl: env.DATABASE_URL.includes("localhost") ? false : "require",
  max: env.NODE_ENV === "production" ? 10 : 2,
  idle_timeout: 20,
  connect_timeout: 15
});
var db = drizzle(queryClient, { schema: schema_exports });
async function checkDbConnection() {
  try {
    const [row] = await queryClient`SELECT current_database() as db_name, now() as server_time`;
    return {
      success: true,
      database: row.db_name,
      serverTime: row.server_time
    };
  } catch (err) {
    return {
      success: false,
      error: err?.message || String(err)
    };
  }
}

// functions/api/routes/index.ts
import { Router as Router5 } from "express";

// functions/api/routes/auth.routes.ts
import { Router } from "express";

// functions/api/services/otp.service.ts
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, and, desc, gt } from "drizzle-orm";

// functions/api/services/jwt.service.ts
import jwt from "jsonwebtoken";
var JwtService = class {
  /**
   * Generates both Access and Refresh tokens for a user
   */
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN
    });
    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: env.JWT_EXPIRES_IN
    };
  }
  /**
   * Verifies an incoming Bearer Access Token
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Access token expired");
      }
      throw new Error("Invalid access token");
    }
  }
  /**
   * Verifies a Refresh Token
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token expired");
      }
      throw new Error("Invalid refresh token");
    }
  }
};

// functions/api/services/otp.service.ts
var OtpService = class {
  /**
   * Generates a cryptographically strong 6-digit OTP
   */
  static generateCode() {
    return crypto.randomInt(1e5, 999999).toString();
  }
  /**
   * Normalizes phone numbers (e.g. 9876543210 or 09876543210 -> +919876543210)
   * while preserving email identifiers. Ensures consistent user identity.
   */
  static normalizeIdentifier(identifier) {
    const trimmed = identifier.trim().toLowerCase();
    if (trimmed.includes("@")) {
      return trimmed;
    }
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length >= 10) {
      return `+91${digits.slice(-10)}`;
    }
    return trimmed;
  }
  /**
   * Sends or generates an OTP for a phone number or email
   */
  static async sendOtp({ identifier, purpose = "login" }) {
    const cleanIdentifier = this.normalizeIdentifier(identifier);
    const cooldownAgo = new Date(Date.now() - env.OTP_COOLDOWN_SECONDS * 1e3);
    const [recentOtp] = await db.select().from(otps).where(
      and(
        eq(otps.identifier, cleanIdentifier),
        eq(otps.purpose, purpose),
        gt(otps.createdAt, cooldownAgo)
      )
    ).limit(1);
    if (recentOtp) {
      const waitSeconds = Math.ceil(
        (recentOtp.createdAt.getTime() + env.OTP_COOLDOWN_SECONDS * 1e3 - Date.now()) / 1e3
      );
      throw new Error(`Please wait ${waitSeconds}s before requesting a new OTP.`);
    }
    const plainCode = this.generateCode();
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(plainCode, salt);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1e3);
    await db.insert(otps).values({
      identifier: cleanIdentifier,
      codeHash,
      purpose,
      expiresAt,
      isUsed: false,
      attempts: 0
    });
    await this.dispatchOtpToGateway(cleanIdentifier, plainCode);
    return {
      success: true,
      identifier: cleanIdentifier,
      expiresInMinutes: env.OTP_EXPIRY_MINUTES
    };
  }
  /**
   * Verifies an OTP and authenticates/registers the user
   */
  static async verifyOtp({ identifier, code, purpose = "login" }) {
    const cleanIdentifier = this.normalizeIdentifier(identifier);
    const cleanCode = code.trim();
    const [otpRecord] = await db.select().from(otps).where(
      and(
        eq(otps.identifier, cleanIdentifier),
        eq(otps.purpose, purpose),
        eq(otps.isUsed, false),
        gt(otps.expiresAt, /* @__PURE__ */ new Date())
      )
    ).orderBy(desc(otps.createdAt)).limit(1);
    if (!otpRecord) {
      throw new Error("Invalid or expired OTP. Please request a new one.");
    }
    if (otpRecord.attempts >= env.OTP_MAX_ATTEMPTS) {
      await db.update(otps).set({ isUsed: true }).where(eq(otps.id, otpRecord.id));
      throw new Error("Too many failed attempts. This OTP has been invalidated.");
    }
    const isValid = await bcrypt.compare(cleanCode, otpRecord.codeHash);
    if (!isValid) {
      await db.update(otps).set({ attempts: otpRecord.attempts + 1 }).where(eq(otps.id, otpRecord.id));
      throw new Error(`Incorrect OTP. ${env.OTP_MAX_ATTEMPTS - (otpRecord.attempts + 1)} attempts remaining.`);
    }
    await db.update(otps).set({ isUsed: true }).where(eq(otps.id, otpRecord.id));
    let [user] = await db.select().from(users).where(eq(users.phone, cleanIdentifier)).limit(1);
    if (!user) {
      const [newUser] = await db.insert(users).values({
        phone: cleanIdentifier,
        walletBalance: 10,
        role: cleanIdentifier === env.SUPERADMIN_PHONE ? "superadmin" : "user",
        isActive: true
      }).returning();
      user = newUser;
    }
    if (!user.isActive) {
      throw new Error("Your account has been deactivated. Please contact support.");
    }
    const tokens = JwtService.generateTokens({
      userId: user.id,
      phone: user.phone,
      role: user.role
    });
    return {
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance,
        avatarUrl: user.avatarUrl
      },
      tokens
    };
  }
  /**
   * Helper to dispatch SMS / Notification
   */
  static async dispatchOtpToGateway(identifier, code) {
    if (env.SMS_GATEWAY_PROVIDER === "console") {
      console.log("==========================================");
      console.log(`\u{1F4F1} [CUSTOM OTP SERVICE] Mock SMS to ${identifier}`);
      console.log(`\u{1F511} Verification Code: [ ${code} ] (Expires in ${env.OTP_EXPIRY_MINUTES} min)`);
      console.log("==========================================");
      return;
    }
    if (env.SMS_GATEWAY_PROVIDER === "colourmoon") {
      const rawDigits = identifier.replace(/\D/g, "");
      const mobile = rawDigits.length > 10 ? rawDigits.slice(-10) : rawDigits;
      const username = env.COLOURMOON_USERNAME || "Srushti";
      const messageText = `Dear ${username} your one time password (OTP) ${code} Regards CMTOTP`;
      const encodedMessage = encodeURIComponent(messageText);
      const userId = encodeURIComponent(env.COLOURMOON_USER_ID || "invtechnologies");
      const baseUrl = env.COLOURMOON_SMS_URL || "http://colourmoontraining.com/otp_sms/sendsms";
      const requestUrl = `${baseUrl}?user_id=${userId}&mobile=${mobile}&message=${encodedMessage}`;
      console.log("==========================================");
      console.log(`\u{1F4E1} [COLOURMOON SMS] Dispatching OTP SMS:`);
      console.log(`   \u2022 Mobile:   ${mobile}`);
      console.log(`   \u2022 Username: ${username}`);
      console.log(`   \u2022 OTP:      ${code}`);
      console.log(`   \u2022 Request:  ${requestUrl}`);
      try {
        const response = await fetch(requestUrl, {
          method: "GET",
          redirect: "follow"
        });
        const responseBody = await response.text();
        console.log(`\u{1F4F1} [COLOURMOON SMS] Gateway Response Status: ${response.status}`);
        console.log(`\u{1F4F1} [COLOURMOON SMS] Gateway Response Body:`, responseBody);
      } catch (err) {
        console.error(`\u274C [COLOURMOON SMS] Failed to dispatch SMS to ${mobile}:`, err.message);
      }
      console.log("==========================================");
      return;
    }
    if (env.SMS_GATEWAY_PROVIDER === "fast2sms" && env.FAST2SMS_API_KEY) {
      try {
        const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: env.FAST2SMS_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            route: "otp",
            variables_values: code,
            numbers: identifier.replace("+91", "").trim()
          })
        });
        const resData = await response.json();
        console.log("Fast2SMS Response:", resData);
      } catch (err) {
        console.error("Failed to send OTP via Fast2SMS:", err.message);
      }
    }
  }
};

// functions/api/services/storage.service.ts
import { createClient } from "@supabase/supabase-js";
import { eq as eq2 } from "drizzle-orm";
import path from "node:path";
var StorageService = class {
  static supabase;
  static getClient() {
    if (!this.supabase) {
      if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error(
          "Supabase storage credentials missing. Please define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
        );
      }
      this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          persistSession: false
        }
      });
    }
    return this.supabase;
  }
  /**
   * Uploads or updates a user profile avatar in Supabase Storage bucket and updates the users table
   */
  static async uploadUserAvatar({
    userId,
    fileBuffer,
    mimeType,
    originalName
  }) {
    const supabase = this.getClient();
    const bucket = env.SUPABASE_STORAGE_BUCKET || "avatars";
    const ext = path.extname(originalName) || (mimeType.includes("png") ? ".png" : ".jpg");
    const filePath = `profiles/${userId}/avatar${ext}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });
    if (uploadError) {
      throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    const [updatedUser] = await db.update(users).set({
      avatarUrl: publicUrl,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(users.id, userId)).returning();
    return {
      success: true,
      avatarUrl: publicUrl,
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl
      }
    };
  }
  /**
   * Deletes a user avatar from Supabase Storage and clears users.avatar_url
   */
  static async deleteUserAvatar(userId) {
    const [user] = await db.select().from(users).where(eq2(users.id, userId)).limit(1);
    if (!user || !user.avatarUrl) {
      return { success: true, message: "No avatar to delete." };
    }
    try {
      const supabase = this.getClient();
      const bucket = env.SUPABASE_STORAGE_BUCKET || "avatars";
      const urlParts = user.avatarUrl.split(`${bucket}/`);
      if (urlParts.length > 1) {
        const storagePath = urlParts[1];
        await supabase.storage.from(bucket).remove([storagePath]);
      }
    } catch (err) {
      console.warn("Storage deletion warning:", err.message);
    }
    await db.update(users).set({
      avatarUrl: null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(users.id, userId));
    return { success: true, message: "Avatar deleted successfully." };
  }
};

// functions/api/controllers/auth.controller.ts
import { eq as eq3 } from "drizzle-orm";
import { z as z2 } from "zod";
var sendOtpSchema = z2.object({
  identifier: z2.string().min(3, "Phone number or email is required"),
  purpose: z2.enum(["login", "register", "recharge"]).optional()
});
var verifyOtpSchema = z2.object({
  identifier: z2.string().min(3, "Phone number is required"),
  code: z2.string().length(6, "OTP must be exactly 6 digits"),
  purpose: z2.enum(["login", "register", "recharge"]).optional()
});
var refreshTokenSchema = z2.object({
  refreshToken: z2.string().min(1, "Refresh token is required")
});
var AuthController = class {
  static async sendOtp(req, res, next) {
    try {
      const { identifier, purpose } = req.body;
      const result = await OtpService.sendOtp({ identifier, purpose });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async verifyOtp(req, res, next) {
    try {
      const { identifier, code, purpose } = req.body;
      const result = await OtpService.verifyOtp({ identifier, code, purpose });
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const payload = JwtService.verifyRefreshToken(refreshToken);
      const [user] = await db.select().from(users).where(eq3(users.id, payload.userId)).limit(1);
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, error: "User is no longer active" });
      }
      const tokens = JwtService.generateTokens({
        userId: user.id,
        phone: user.phone,
        role: user.role
      });
      return res.status(200).json({ success: true, tokens });
    } catch (error) {
      next(error);
    }
  }
  static async getProfile(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const [user] = await db.select({
        id: users.id,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
        role: users.role,
        walletBalance: users.walletBalance,
        isActive: users.isActive,
        createdAt: users.createdAt
      }).from(users).where(eq3(users.id, req.user.userId)).limit(1);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }
  static async uploadAvatar(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, error: "No image file provided in field 'avatar'" });
      }
      const result = await StorageService.uploadUserAvatar({
        userId: req.user.userId,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async deleteAvatar(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const result = await StorageService.deleteUserAvatar(req.user.userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

// functions/api/middlewares/auth.ts
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Bearer token missing."
    });
  }
  try {
    const payload = JwtService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message || "Invalid or expired token."
    });
  }
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' lacks required permissions.`
      });
    }
    next();
  };
}

// functions/api/middlewares/validate.ts
import { ZodError } from "zod";
function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message
          }))
        });
      }
      return res.status(400).json({ success: false, error: "Invalid request payload" });
    }
  };
}

// functions/api/middlewares/upload.ts
import multer from "multer";
var storage = multer.memoryStorage();
var allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP image formats are allowed."));
  }
}
var avatarUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    // 5MB maximum
    files: 1
  },
  fileFilter
}).single("avatar");

// functions/api/routes/auth.routes.ts
var router = Router();
router.post("/otp/send", validateBody(sendOtpSchema), AuthController.sendOtp);
router.post("/otp/verify", validateBody(verifyOtpSchema), AuthController.verifyOtp);
router.post("/refresh", validateBody(refreshTokenSchema), AuthController.refreshToken);
router.get("/me", authenticateToken, AuthController.getProfile);
router.post("/avatar", authenticateToken, avatarUploadMiddleware, AuthController.uploadAvatar);
router.delete("/avatar", authenticateToken, AuthController.deleteAvatar);
var auth_routes_default = router;

// functions/api/routes/payment.routes.ts
import { Router as Router2 } from "express";

// functions/api/services/razorpay.service.ts
import Razorpay from "razorpay";
import crypto2 from "node:crypto";
import { eq as eq4, sql } from "drizzle-orm";
var RazorpayService = class {
  static instance;
  static getClient() {
    if (!this.instance) {
      this.instance = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET
      });
    }
    return this.instance;
  }
  /**
   * Generates a new Razorpay order and logs it in the payments table
   */
  static async createOrder({ userId, amount, credits, packName, notes }) {
    const rzp = this.getClient();
    const amountInPaise = Math.round(amount * 100);
    const receipt = `rcpt_${Date.now()}_${userId.slice(0, 5)}`;
    const rzpOrder = await rzp.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        userId,
        credits: credits.toString(),
        packName: packName || "Credit Recharge",
        ...notes
      }
    });
    const [paymentRecord] = await db.insert(payments).values({
      userId,
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency: "INR",
      status: "created",
      creditsAdded: credits,
      metadata: {
        packName,
        notes
      }
    }).returning();
    return {
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: env.RAZORPAY_KEY_ID,
      configId: env.RAZORPAY_CHECKOUT_CONFIG_ID || "config_SVPwn8f33zfhsP",
      credits,
      paymentId: paymentRecord.id
    };
  }
  /**
   * Verifies Razorpay payment signature and credits the user's wallet atomically
   */
  static async verifyPayment({
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  }) {
    const generatedSignature = crypto2.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
    if (generatedSignature !== razorpaySignature) {
      await db.update(payments).set({ status: "failed", razorpayPaymentId, razorpaySignature }).where(eq4(payments.razorpayOrderId, razorpayOrderId));
      throw new Error("Invalid payment signature. Verification failed.");
    }
    const [existingPayment] = await db.select().from(payments).where(eq4(payments.razorpayOrderId, razorpayOrderId)).limit(1);
    if (!existingPayment) {
      throw new Error("Order not found in records.");
    }
    if (existingPayment.status === "paid") {
      const [currentUser] = await db.select().from(users).where(eq4(users.id, userId)).limit(1);
      return {
        success: true,
        alreadyProcessed: true,
        walletBalance: currentUser?.walletBalance ?? 0
      };
    }
    const creditsToAdd = existingPayment.creditsAdded;
    await db.transaction(async (tx) => {
      await tx.update(payments).set({
        status: "paid",
        razorpayPaymentId,
        razorpaySignature,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(payments.id, existingPayment.id));
      await tx.update(users).set({
        walletBalance: sql`${users.walletBalance} + ${creditsToAdd}`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(users.id, userId));
    });
    const [updatedUser] = await db.select().from(users).where(eq4(users.id, userId)).limit(1);
    return {
      success: true,
      creditsAdded: creditsToAdd,
      walletBalance: updatedUser.walletBalance,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId
    };
  }
  /**
   * Razorpay Webhook processor for automated server-to-server confirmation
   */
  static async handleWebhook(body, signature) {
    if (!env.RAZORPAY_WEBHOOK_SECRET)
      return { status: "ignored" };
    const expectedSignature = crypto2.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(typeof body === "string" ? body : JSON.stringify(body)).digest("hex");
    if (expectedSignature !== signature) {
      throw new Error("Invalid webhook signature");
    }
    const event = body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const userId = paymentEntity?.notes?.userId;
      const credits = Number(paymentEntity?.notes?.credits || 0);
      if (orderId && userId && credits > 0) {
        await db.transaction(async (tx) => {
          await tx.update(payments).set({ status: "paid", razorpayPaymentId: paymentId, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(payments.razorpayOrderId, orderId));
          await tx.update(users).set({ walletBalance: sql`${users.walletBalance} + ${credits}`, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(users.id, userId));
        });
      }
    }
    return { received: true };
  }
};

// functions/api/controllers/payment.controller.ts
import { eq as eq5, desc as desc2 } from "drizzle-orm";
import { z as z3 } from "zod";
var createOrderSchema = z3.object({
  amount: z3.number().positive("Amount must be greater than 0"),
  credits: z3.number().int().positive("Credits must be greater than 0"),
  packName: z3.string().optional(),
  notes: z3.record(z3.string()).optional()
});
var verifyPaymentSchema = z3.object({
  razorpayOrderId: z3.string().min(1, "razorpayOrderId is required"),
  razorpayPaymentId: z3.string().min(1, "razorpayPaymentId is required"),
  razorpaySignature: z3.string().min(1, "razorpaySignature is required")
});
var PaymentController = class {
  static async createOrder(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const { amount, credits, packName, notes } = req.body;
      const order = await RazorpayService.createOrder({
        userId: req.user.userId,
        amount,
        credits,
        packName,
        notes
      });
      return res.status(200).json({ success: true, order });
    } catch (error) {
      next(error);
    }
  }
  static async verifyPayment(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const result = await RazorpayService.verifyPayment({
        userId: req.user.userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async getHistory(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const records = await db.select().from(payments).where(eq5(payments.userId, req.user.userId)).orderBy(desc2(payments.createdAt)).limit(limit).offset(offset);
      return res.status(200).json({ success: true, payments: records });
    } catch (error) {
      next(error);
    }
  }
  static async handleWebhook(req, res, next) {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const result = await RazorpayService.handleWebhook(req.body, signature || "");
      return res.status(200).json(result);
    } catch (error) {
      console.error("Webhook processing error:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }
};

// functions/api/routes/payment.routes.ts
var router2 = Router2();
router2.post("/create-order", authenticateToken, validateBody(createOrderSchema), PaymentController.createOrder);
router2.post("/verify", authenticateToken, validateBody(verifyPaymentSchema), PaymentController.verifyPayment);
router2.get("/history", authenticateToken, PaymentController.getHistory);
router2.post("/webhook", PaymentController.handleWebhook);
var payment_routes_default = router2;

// functions/api/routes/usage.routes.ts
import { Router as Router3 } from "express";

// functions/api/services/usage.service.ts
import { eq as eq6, and as and2, gte, sql as sql2, desc as desc3 } from "drizzle-orm";
var UsageService = class {
  /**
   * Atomically checks wallet balance, deducts credits, and logs the AI usage
   */
  static async recordUsage({
    userId,
    workspace,
    itemType,
    creditsDeducted = 1,
    prompt,
    status = "success",
    errorMessage,
    latencyMs,
    metadata
  }) {
    return await db.transaction(async (tx) => {
      const [user] = await tx.select().from(users).where(eq6(users.id, userId)).limit(1);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.walletBalance < creditsDeducted) {
        throw new Error(
          `Insufficient wallet credits. You have ${user.walletBalance} credits, but ${creditsDeducted} is required.`
        );
      }
      if (status !== "failed" && creditsDeducted > 0) {
        await tx.update(users).set({
          walletBalance: sql2`${users.walletBalance} - ${creditsDeducted}`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq6(users.id, userId));
      }
      const [usageLog] = await tx.insert(usage).values({
        userId,
        workspace,
        itemType,
        creditsDeducted,
        prompt,
        status,
        errorMessage,
        latencyMs,
        metadata
      }).returning();
      const [updatedUser] = await tx.select().from(users).where(eq6(users.id, userId)).limit(1);
      return {
        usageLog,
        remainingCredits: updatedUser.walletBalance
      };
    });
  }
  /**
   * Fetches paginated AI usage logs for a specific user
   */
  static async getUserUsageHistory(userId, limit = 20, offset = 0) {
    const logs = await db.select().from(usage).where(eq6(usage.userId, userId)).orderBy(desc3(usage.createdAt)).limit(limit).offset(offset);
    return logs;
  }
  /**
   * Returns current user balance and credit stats
   */
  static async getUserBalance(userId) {
    const [user] = await db.select({
      id: users.id,
      phone: users.phone,
      walletBalance: users.walletBalance,
      role: users.role
    }).from(users).where(eq6(users.id, userId)).limit(1);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  /**
   * Fetches paginated AI usage logs across all users (Admin view)
   */
  static async getAllUsageLogs(limit = 50, offset = 0) {
    const logs = await db.select({
      id: usage.id,
      userId: usage.userId,
      userPhone: users.phone,
      workspace: usage.workspace,
      itemType: usage.itemType,
      creditsDeducted: usage.creditsDeducted,
      prompt: usage.prompt,
      status: usage.status,
      errorMessage: usage.errorMessage,
      latencyMs: usage.latencyMs,
      metadata: usage.metadata,
      createdAt: usage.createdAt
    }).from(usage).leftJoin(users, eq6(usage.userId, users.id)).orderBy(desc3(usage.createdAt)).limit(limit).offset(offset);
    return logs;
  }
  /**
   * Fetches unified chronological timeline of user's activity from both [payments, usage] tables
   * Supports filtering by type ('payment' | 'usage') and time range period ('1w', '1m', '3m', '6m', '1y', 'all')
   */
  static async getCombinedTimeline(userId, limit = 50, offset = 0, type, period) {
    const sinceDate = this.getPeriodStartDate(period);
    let paymentItems = [];
    if (!type || type === "payment") {
      const paymentConditions = [eq6(payments.userId, userId)];
      if (sinceDate) {
        paymentConditions.push(gte(payments.createdAt, sinceDate));
      }
      const userPayments = await db.select({
        id: payments.id,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        creditsAdded: payments.creditsAdded,
        razorpayOrderId: payments.razorpayOrderId,
        razorpayPaymentId: payments.razorpayPaymentId,
        metadata: payments.metadata,
        createdAt: payments.createdAt
      }).from(payments).where(and2(...paymentConditions)).orderBy(desc3(payments.createdAt)).limit(offset + limit);
      paymentItems = userPayments.map((p) => ({
        id: p.id,
        type: "payment",
        timestamp: new Date(p.createdAt).getTime(),
        createdAt: p.createdAt,
        status: p.status,
        creditsChange: p.creditsAdded,
        amountPaise: p.amount,
        amountFiat: p.amount / 100,
        currency: p.currency,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        packName: p.metadata?.packName,
        title: `Top-up / Recharge (${p.currency === "INR" ? "\u20B9" : "$"}${p.amount / 100})`,
        titleTe: `\u0C30\u0C40\u0C1B\u0C3E\u0C30\u0C4D\u0C1C\u0C4D \u0C1A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C2A\u0C41 (${p.currency === "INR" ? "\u20B9" : "$"}${p.amount / 100})`,
        description: p.razorpayPaymentId ? `Razorpay ID: ${p.razorpayPaymentId}` : `Order: ${p.razorpayOrderId}`,
        descriptionTe: p.razorpayPaymentId ? `\u0C30\u0C47\u0C1C\u0C30\u0C4D\u200C\u0C2A\u0C47 ID: ${p.razorpayPaymentId}` : `\u0C06\u0C30\u0C4D\u0C21\u0C30\u0C4D: ${p.razorpayOrderId}`
      }));
    }
    let usageItems = [];
    if (!type || type === "usage") {
      const usageConditions = [eq6(usage.userId, userId)];
      if (sinceDate) {
        usageConditions.push(gte(usage.createdAt, sinceDate));
      }
      const userUsages = await db.select({
        id: usage.id,
        workspace: usage.workspace,
        itemType: usage.itemType,
        creditsDeducted: usage.creditsDeducted,
        prompt: usage.prompt,
        status: usage.status,
        errorMessage: usage.errorMessage,
        latencyMs: usage.latencyMs,
        metadata: usage.metadata,
        createdAt: usage.createdAt
      }).from(usage).where(and2(...usageConditions)).orderBy(desc3(usage.createdAt)).limit(offset + limit);
      usageItems = userUsages.map((u) => ({
        id: u.id,
        type: "usage",
        timestamp: new Date(u.createdAt).getTime(),
        createdAt: u.createdAt,
        status: u.status,
        creditsChange: -u.creditsDeducted,
        workspace: u.workspace,
        itemType: u.itemType,
        prompt: u.prompt,
        errorMessage: u.errorMessage,
        latencyMs: u.latencyMs,
        metadata: u.metadata,
        title: `${u.workspace === "garment" ? "Garment" : "Jewelry"} Shoot \u2022 ${u.itemType.toUpperCase()}`,
        titleTe: `${u.workspace === "garment" ? "\u0C2C\u0C1F\u0C4D\u0C1F\u0C32" : "\u0C28\u0C17\u0C32"} \u0C37\u0C42\u0C1F\u0C4D \u2022 ${u.itemType.toUpperCase()}`,
        description: `${u.metadata?.resolution || "1024x1024"} \u2022 ${u.metadata?.aspectRatio || "1:1"}${u.latencyMs ? ` \u2022 ${u.latencyMs}ms` : ""}`,
        descriptionTe: `${u.metadata?.resolution || "1024x1024"} \u2022 ${u.metadata?.aspectRatio || "1:1"}${u.latencyMs ? ` \u2022 ${u.latencyMs}ms` : ""}`
      }));
    }
    const combined = [...paymentItems, ...usageItems].sort((a, b) => b.timestamp - a.timestamp).slice(offset, offset + limit);
    return {
      timeline: combined,
      summary: {
        totalGenerations: usageItems.length,
        totalPayments: paymentItems.filter((p) => p.status === "paid").length,
        totalCreditsSpent: usageItems.reduce((acc, u) => acc + (u.creditsDeducted || 0), 0),
        totalCreditsPurchased: paymentItems.filter((p) => p.status === "paid").reduce((acc, p) => acc + (p.creditsChange || 0), 0)
      }
    };
  }
  static getPeriodStartDate(period) {
    if (!period || period === "all")
      return null;
    const now = Date.now();
    switch (period.toLowerCase()) {
      case "1w":
      case "1week":
        return new Date(now - 7 * 24 * 60 * 60 * 1e3);
      case "1m":
      case "1month":
        return new Date(now - 30 * 24 * 60 * 60 * 1e3);
      case "3m":
      case "3months":
        return new Date(now - 90 * 24 * 60 * 60 * 1e3);
      case "6m":
      case "6months":
        return new Date(now - 180 * 24 * 60 * 60 * 1e3);
      case "1y":
      case "1year":
        return new Date(now - 365 * 24 * 60 * 60 * 1e3);
      default:
        return null;
    }
  }
};

// functions/api/controllers/usage.controller.ts
import { z as z4 } from "zod";
var recordUsageSchema = z4.object({
  workspace: z4.enum(["garment", "jewelry", "face", "general"]),
  itemType: z4.string().min(1, "itemType is required (e.g. saree, necklace)"),
  creditsDeducted: z4.number().int().min(0).default(1),
  prompt: z4.string().optional(),
  status: z4.enum(["pending", "success", "failed"]).default("success"),
  errorMessage: z4.string().optional(),
  latencyMs: z4.number().optional(),
  metadata: z4.record(z4.any()).optional()
});
var UsageController = class {
  static async recordUsage(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const result = await UsageService.recordUsage({
        userId: req.user.userId,
        ...req.body
      });
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getHistory(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const history = await UsageService.getUserUsageHistory(req.user.userId, limit, offset);
      return res.status(200).json({
        success: true,
        history
      });
    } catch (error) {
      next(error);
    }
  }
  static async getBalance(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const balance = await UsageService.getUserBalance(req.user.userId);
      return res.status(200).json({
        success: true,
        balance
      });
    } catch (error) {
      next(error);
    }
  }
  static async getTimeline(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const type = req.query.type || void 0;
      const period = req.query.period || void 0;
      const result = await UsageService.getCombinedTimeline(
        req.user.userId,
        limit,
        offset,
        type,
        period
      );
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
};

// functions/api/routes/usage.routes.ts
var router3 = Router3();
router3.post("/record", authenticateToken, validateBody(recordUsageSchema), UsageController.recordUsage);
router3.get("/history", authenticateToken, UsageController.getHistory);
router3.get("/balance", authenticateToken, UsageController.getBalance);
router3.get("/timeline", authenticateToken, UsageController.getTimeline);
var usage_routes_default = router3;

// functions/api/routes/admin.routes.ts
import { Router as Router4 } from "express";

// functions/api/controllers/admin.controller.ts
import { eq as eq7, desc as desc4, sql as sql3 } from "drizzle-orm";
import { z as z5 } from "zod";
var adjustCreditsSchema = z5.object({
  userId: z5.string().uuid("Invalid user UUID"),
  creditChange: z5.number().int("creditChange must be an integer"),
  // positive to add, negative to deduct
  reason: z5.string().optional()
});
var AdminController = class {
  static async getAllUsers(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const userList = await db.select({
        id: users.id,
        phone: users.phone,
        role: users.role,
        walletBalance: users.walletBalance,
        isActive: users.isActive,
        createdAt: users.createdAt
      }).from(users).orderBy(desc4(users.createdAt)).limit(limit).offset(offset);
      return res.status(200).json({ success: true, users: userList });
    } catch (error) {
      next(error);
    }
  }
  static async adjustCredits(req, res, next) {
    try {
      const { userId, creditChange, reason } = req.body;
      const [updatedUser] = await db.update(users).set({
        walletBalance: sql3`GREATEST(0, ${users.walletBalance} + ${creditChange})`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq7(users.id, userId)).returning();
      if (!updatedUser) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      return res.status(200).json({
        success: true,
        message: `Wallet balance adjusted by ${creditChange >= 0 ? "+" : ""}${creditChange} credits.`,
        newBalance: updatedUser.walletBalance,
        reason
      });
    } catch (error) {
      next(error);
    }
  }
  static async toggleUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      const [user] = await db.update(users).set({
        isActive: Boolean(isActive),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq7(users.id, userId)).returning();
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          isActive: user.isActive
        }
      });
    } catch (error) {
      next(error);
    }
  }
  static async getStats(req, res, next) {
    try {
      const [totalUsersRes] = await db.select({ count: sql3`count(*)::int` }).from(users);
      const [totalGenerationsRes] = await db.select({ count: sql3`count(*)::int` }).from(usage);
      const [totalRevenueRes] = await db.select({ sum: sql3`coalesce(sum(${payments.amount}), 0)::int` }).from(payments).where(eq7(payments.status, "paid"));
      return res.status(200).json({
        success: true,
        stats: {
          totalUsers: totalUsersRes?.count || 0,
          totalGenerations: totalGenerationsRes?.count || 0,
          totalRevenuePaise: totalRevenueRes?.sum || 0,
          totalRevenueInr: (totalRevenueRes?.sum || 0) / 100
        }
      });
    } catch (error) {
      next(error);
    }
  }
  static async getUsageLogs(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const logs = await UsageService.getAllUsageLogs(limit, offset);
      return res.status(200).json({
        success: true,
        logs
      });
    } catch (error) {
      next(error);
    }
  }
};

// functions/api/routes/admin.routes.ts
var router4 = Router4();
router4.get("/users", authenticateToken, requireRole(["admin", "superadmin"]), AdminController.getAllUsers);
router4.get("/stats", authenticateToken, requireRole(["admin", "superadmin"]), AdminController.getStats);
router4.get("/usage", authenticateToken, requireRole(["admin", "superadmin"]), AdminController.getUsageLogs);
router4.post(
  "/credits/adjust",
  authenticateToken,
  requireRole(["superadmin"]),
  validateBody(adjustCreditsSchema),
  AdminController.adjustCredits
);
router4.patch(
  "/users/:userId/status",
  authenticateToken,
  requireRole(["superadmin"]),
  AdminController.toggleUserStatus
);
var admin_routes_default = router4;

// functions/api/routes/index.ts
var router5 = Router5();
router5.use("/auth", auth_routes_default);
router5.use("/payments", payment_routes_default);
router5.use("/usage", usage_routes_default);
router5.use("/admin", admin_routes_default);
router5.get("/", (req, res) => {
  const functionSlug = process.env.SUPABASE_FUNCTION_SLUG || "api";
  res.status(200).json({
    name: "Srushti AI API",
    version: "1.0.0",
    architecture: "Supabase Edge Functions (Deno 2) + Express + Serverless + Drizzle ORM",
    slug: functionSlug,
    endpoints: {
      health: `/${functionSlug}/health`,
      auth: `/${functionSlug}/auth`,
      payments: `/${functionSlug}/payments`,
      usage: `/${functionSlug}/usage`,
      admin: `/${functionSlug}/admin`
    },
    docs: `/${functionSlug}/health`
  });
});
router5.get("/health", async (req, res) => {
  const dbStatus = await checkDbConnection();
  const uptime = typeof process?.uptime === "function" ? Math.floor(process.uptime()) : 0;
  res.status(dbStatus.success ? 200 : 503).json({
    status: dbStatus.success ? "healthy" : "degraded",
    service: "supabase",
    database: {
      connected: dbStatus.success,
      ...dbStatus.database ? { name: dbStatus.database } : {},
      ...dbStatus.serverTime ? { serverTime: dbStatus.serverTime } : {},
      ...dbStatus.error ? { error: dbStatus.error } : {}
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptimeSeconds: uptime
  });
});
var routes_default = router5;

// functions/api/middlewares/errorHandler.ts
import { ZodError as ZodError2 } from "zod";
import { MulterError } from "multer";

// functions/api/utils/errors.ts
var AppError = class extends Error {
  statusCode;
  errorCode;
  details;
  isOperational;
  constructor(message, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR", details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// functions/api/middlewares/errorHandler.ts
function errorHandler(err, req, res, next) {
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.errorCode,
      ...err.details ? { details: err.details } : {},
      timestamp: timestamp2
    });
  }
  if (err instanceof ZodError2) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code
    }));
    return res.status(400).json({
      success: false,
      error: "Validation failed. Please check the provided inputs.",
      code: "VALIDATION_ERROR",
      details: formattedDetails,
      timestamp: timestamp2
    });
  }
  if (err?.code === "23505") {
    const detailMsg = err.detail || "";
    let cleanMsg = "A record with this identifier already exists.";
    if (detailMsg.includes("phone")) {
      cleanMsg = "A user account with this phone number already exists.";
    } else if (detailMsg.includes("email")) {
      cleanMsg = "A user account with this email address already exists.";
    }
    return res.status(409).json({
      success: false,
      error: cleanMsg,
      code: "UNIQUE_CONSTRAINT_VIOLATION",
      timestamp: timestamp2
    });
  }
  if (err?.code === "23503") {
    return res.status(400).json({
      success: false,
      error: "Invalid reference. The associated parent record was not found.",
      code: "FOREIGN_KEY_VIOLATION",
      timestamp: timestamp2
    });
  }
  if (err?.code === "ECONNREFUSED" || err?.code === "ETIMEDOUT" || err?.name === "PostgresError" && err?.message?.includes("Connection")) {
    console.error("\u{1F525} Database Connection Error:", err.message);
    return res.status(503).json({
      success: false,
      error: "Database service is temporarily unavailable. Please retry shortly.",
      code: "DATABASE_UNAVAILABLE",
      timestamp: timestamp2
    });
  }
  if (err?.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Your session has expired. Please log in again.",
      code: "TOKEN_EXPIRED",
      timestamp: timestamp2
    });
  }
  if (err?.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid authentication token. Please log in again.",
      code: "INVALID_TOKEN",
      timestamp: timestamp2
    });
  }
  if (err instanceof MulterError) {
    let multerMsg = `Upload error: ${err.message}`;
    if (err.code === "LIMIT_FILE_SIZE") {
      multerMsg = "Uploaded file exceeds the maximum allowed size (10MB).";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      multerMsg = `Unexpected upload field: '${err.field}'. Expected 'avatar'.`;
    }
    return res.status(400).json({
      success: false,
      error: multerMsg,
      code: `UPLOAD_${err.code}`,
      timestamp: timestamp2
    });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload in request body.",
      code: "INVALID_JSON",
      timestamp: timestamp2
    });
  }
  console.error("\u{1F525} Unexpected Server Error:", {
    message: err?.message,
    stack: err?.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  const statusCode = typeof err?.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;
  const isProduction = env.NODE_ENV === "production";
  return res.status(statusCode).json({
    success: false,
    error: isProduction ? "An unexpected server error occurred. Please try again later." : err?.message || "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    ...isProduction ? {} : { stack: err?.stack },
    timestamp: timestamp2
  });
}

// functions/api/app.ts
function createApp() {
  const app2 = express();
  const functionSlug = process.env.FUNCTION_SLUG || process.env.SUPABASE_FUNCTION_SLUG || "api";
  app2.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false
    })
  );
  const allowedOriginsList = env.CORS_ORIGIN === "*" ? ["*"] : env.CORS_ORIGIN.split(",").map((s) => s.trim());
  app2.use(
    cors({
      origin: (origin, callback) => {
        if (!origin)
          return callback(null, true);
        if (allowedOriginsList.includes("*") || allowedOriginsList.includes(origin)) {
          return callback(null, true);
        }
        if (env.NODE_ENV !== "production") {
          if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
          }
        }
        return callback(null, false);
      },
      credentials: true
    })
  );
  app2.options("*", cors());
  if (env.NODE_ENV !== "test") {
    app2.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }
  app2.use(express.json({ limit: "10mb" }));
  app2.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app2.use((req, res, next) => {
    const gatewayPrefix = `/functions/v1/${functionSlug}`;
    if (req.url.startsWith(gatewayPrefix)) {
      req.url = req.url.slice(gatewayPrefix.length) || "/";
    }
    next();
  });
  app2.use(`/${functionSlug}`, routes_default);
  if (functionSlug !== "api") {
    app2.use("/api", routes_default);
  }
  app2.use("/", routes_default);
  app2.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl}`
    });
  });
  app2.use(errorHandler);
  return app2;
}
var app = createApp();

// functions/api/entry.ts
if (typeof Deno !== "undefined" && typeof Deno?.env?.toObject === "function") {
  try {
    const allEnv = Deno.env.toObject();
    for (const [key, val] of Object.entries(allEnv)) {
      if (val !== void 0 && typeof val === "string") {
        process.env[key] = val;
      }
    }
  } catch (_e) {
  }
}
if (!process.env.FUNCTION_SLUG && !process.env.SUPABASE_FUNCTION_SLUG) {
  process.env.FUNCTION_SLUG = "api";
  process.env.SUPABASE_FUNCTION_SLUG = "api";
}
var port = Number(Deno?.env?.get?.("PORT")) || 8e3;
app.listen(port, () => {
  console.log(`\u{1F680} Srushti AI Express Edge Function running on port ${port} (slug: ${process.env.SUPABASE_FUNCTION_SLUG})`);
});
var entry_default = app;
export {
  entry_default as default
};
