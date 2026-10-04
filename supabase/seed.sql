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

-- 5. Enforce Presentation Face Visibility Rules
UPDATE "presentations" SET "face_visibility_rule" = 'full_face', "updated_at" = now() WHERE "id" = 'model';
UPDATE "presentations" SET "face_visibility_rule" = 'partial_face', "updated_at" = now() WHERE "id" = 'partial_face';
UPDATE "presentations" SET "face_visibility_rule" = 'no_face', "updated_at" = now() WHERE "id" NOT IN ('model', 'partial_face');

-- 6. Seed Face Matching and 100% Identity Fidelity Directives
INSERT INTO "system_settings" ("key", "category", "value", "description", "updated_at")
VALUES (
  'face_matching_rules',
  'fidelity',
  '{
    "enforce_100_percent_fidelity": true,
    "allowed_presentation_modes": ["model", "partial_face"],
    "prohibited_presentation_modes": ["no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow", "bust", "body_part"],
    "face_visibility_ui_title_en": "Select Human Model Face",
    "face_visibility_ui_title_te": "మానవ మోడల్ ముఖాన్ని ఎంచుకోండి",
    "face_fidelity_instruction": "The reference image of the human model (second uploaded image) is for 100% FACE IDENTITY REPLICATION. Maintain identical facial structure, eyes, nose, lips, jawline, skin tone, and ethnic identity from the face reference image with zero morphing."
  }'::jsonb,
  'Face reference UI visibility rules and 100% face identity replication guardrails',
  now()
)
ON CONFLICT ("key") DO UPDATE SET
  "value" = EXCLUDED."value",
  "description" = EXCLUDED."description",
  "updated_at" = now();

