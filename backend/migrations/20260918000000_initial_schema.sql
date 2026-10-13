-- ==============================================================================
-- SRUSHTI AI — SUPABASE INITIAL DATABASE SCHEMA MIGRATION
-- Migration Version: 20260918000000_initial_schema.sql
-- Description: Core tables for Users, Custom OTPs, Razorpay Payments, and AI Usage
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "phone" text NOT NULL,
    "avatar_url" text,
    "role" text DEFAULT 'user' NOT NULL CHECK ("role" IN ('user', 'admin', 'superadmin')),
    "wallet_balance" integer DEFAULT 10 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "users_phone_unique" UNIQUE ("phone")
);

-- 3. Create Custom OTPs Table
CREATE TABLE IF NOT EXISTS "otps" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "identifier" text NOT NULL,
    "code_hash" text NOT NULL,
    "purpose" text DEFAULT 'login' NOT NULL CHECK ("purpose" IN ('login', 'register', 'recharge')),
    "expires_at" timestamp with time zone NOT NULL,
    "is_used" boolean DEFAULT false NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Create Payments Table (Razorpay Orders & Transactions)
CREATE TABLE IF NOT EXISTS "payments" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "razorpay_order_id" text NOT NULL,
    "razorpay_payment_id" text,
    "razorpay_signature" text,
    "amount" integer NOT NULL,
    "currency" text DEFAULT 'INR' NOT NULL,
    "status" text DEFAULT 'created' NOT NULL CHECK ("status" IN ('created', 'paid', 'failed')),
    "credits_added" integer DEFAULT 0 NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "payments_razorpay_order_id_unique" UNIQUE ("razorpay_order_id")
);

-- 5. Create AI Usage & Generation Tracking Table
CREATE TABLE IF NOT EXISTS "usage" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "workspace" text DEFAULT 'garment' NOT NULL CHECK ("workspace" IN ('garment', 'jewelry', 'face', 'general')),
    "item_type" text NOT NULL,
    "credits_deducted" integer DEFAULT 1 NOT NULL,
    "prompt" text,
    "status" text DEFAULT 'pending' NOT NULL CHECK ("status" IN ('pending', 'success', 'failed')),
    "error_message" text,
    "latency_ms" integer,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS "users_phone_idx" ON "users" USING btree ("phone");
CREATE INDEX IF NOT EXISTS "otps_identifier_idx" ON "otps" USING btree ("identifier");
CREATE INDEX IF NOT EXISTS "otps_expires_at_idx" ON "otps" USING btree ("expires_at");
CREATE INDEX IF NOT EXISTS "payments_user_id_idx" ON "payments" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "payments_razorpay_order_id_idx" ON "payments" USING btree ("razorpay_order_id");
CREATE INDEX IF NOT EXISTS "usage_user_id_idx" ON "usage" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "usage_workspace_idx" ON "usage" USING btree ("workspace");
CREATE INDEX IF NOT EXISTS "usage_created_at_idx" ON "usage" USING btree ("created_at");
