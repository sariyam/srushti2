-- ==============================================================================
-- SRUSHTI AI — SUPABASE DATABASE SEED DATA
-- File: seed.sql
-- Purpose: Initial users, SuperAdmin credentials, and demo records
-- ==============================================================================

-- 1. Ensure SuperAdmin User exists
INSERT INTO "users" ("id", "phone", "role", "wallet_balance", "is_active", "created_at", "updated_at")
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '+919876543210',
    'superadmin',
    1000,
    true,
    now(),
    now()
)
ON CONFLICT ("phone") DO UPDATE SET
    "role" = 'superadmin',
    "wallet_balance" = GREATEST("users"."wallet_balance", 1000),
    "is_active" = true,
    "updated_at" = now();

-- 2. Seed Demo / Test User
INSERT INTO "users" ("id", "phone", "role", "wallet_balance", "is_active", "created_at", "updated_at")
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '+919999999999',
    'user',
    50,
    true,
    now(),
    now()
)
ON CONFLICT ("phone") DO NOTHING;

-- 3. Seed Sample Usage Activity for Demo User
INSERT INTO "usage" ("id", "user_id", "workspace", "item_type", "credits_deducted", "prompt", "status", "latency_ms", "metadata", "created_at")
VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000002',
    'garment',
    'saree',
    1,
    'Royal Kanjeevaram Silk Saree on Indian studio model with warm lighting',
    'success',
    1240,
    '{"resolution": "2048x2048", "lighting": "Heritage Studio", "photoStyle": "editorial"}'::jsonb,
    now() - interval '1 day'
)
ON CONFLICT ("id") DO NOTHING;

-- 4. Ensure Avatars Storage Bucket Exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'storage' AND table_name = 'buckets'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true)
        ON CONFLICT (id) DO UPDATE SET public = true;
    END IF;
END $$;
