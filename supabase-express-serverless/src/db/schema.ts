import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull().unique(),
    avatarUrl: text("avatar_url"),
    role: text("role", { enum: ["user", "admin", "superadmin"] })
      .notNull()
      .default("user"),
    walletBalance: integer("wallet_balance").notNull().default(10), // default free credits
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("users_phone_idx").on(table.phone),
  ]
);

// 2. OTPs Table (Custom OTP Service)
export const otps = pgTable(
  "otps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(), // Phone or email
    codeHash: text("code_hash").notNull(), // Bcrypt hashed OTP code
    purpose: text("purpose", { enum: ["login", "register", "recharge"] })
      .notNull()
      .default("login"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    isUsed: boolean("is_used").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("otps_identifier_idx").on(table.identifier),
    index("otps_expires_at_idx").on(table.expiresAt),
  ]
);

// 3. Payments Table (Razorpay Integration)
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    amount: integer("amount").notNull(), // in paise (e.g. 10000 = ₹100)
    currency: text("currency").notNull().default("INR"),
    status: text("status", { enum: ["created", "paid", "failed"] })
      .notNull()
      .default("created"),
    creditsAdded: integer("credits_added").notNull().default(0),
    metadata: jsonb("metadata").$type<{
      packName?: string;
      notes?: Record<string, any>;
      payerEmail?: string;
      payerContact?: string;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payments_user_id_idx").on(table.userId),
    index("payments_razorpay_order_id_idx").on(table.razorpayOrderId),
  ]
);

// 4. Usage Table (AI Photoshoot & Generation Tracking)
export const usage = pgTable(
  "usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspace: text("workspace", { enum: ["garment", "jewelry", "face", "general"] })
      .notNull()
      .default("garment"),
    itemType: text("item_type").notNull(), // e.g. 'saree', 'lehenga', 'necklace', etc.
    creditsDeducted: integer("credits_deducted").notNull().default(1),
    prompt: text("prompt"),
    status: text("status", { enum: ["pending", "success", "failed"] })
      .notNull()
      .default("pending"),
    errorMessage: text("error_message"),
    latencyMs: integer("latency_ms"),
    metadata: jsonb("metadata").$type<{
      aspectRatio?: string;
      resolution?: string;
      photoStyle?: string;
      lighting?: string;
      background?: string;
      modelDetails?: Record<string, any>;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("usage_user_id_idx").on(table.userId),
    index("usage_workspace_idx").on(table.workspace),
    index("usage_created_at_idx").on(table.createdAt),
  ]
);

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  usageLogs: many(usage),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const usageRelations = relations(usage, ({ one }) => ({
  user: one(users, {
    fields: [usage.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Usage = typeof usage.$inferSelect;
export type NewUsage = typeof usage.$inferInsert;
