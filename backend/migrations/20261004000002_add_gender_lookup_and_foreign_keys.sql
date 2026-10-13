-- =========================================================================
-- Migration: 20261004000002_add_gender_lookup_and_foreign_keys.sql
-- Description:
-- 1. Creates dedicated `genders` lookup table (female, male, unisex, all)
-- 2. Adds missing gender records to `system_lookups` (unisex, all)
-- 3. Adds `gender_target` column to `studio_presets` and backfills from metadata
-- 4. Adds `gender` column to `users`
-- 5. Adds `gender_target` column to `usage`
-- 6. Replaces rigid CHECK constraints with Foreign Key constraints (FK)
--    referencing `genders(id)` on `catalog_items`, `business_categories`,
--    `studio_presets`, `users`, and `usage`.
-- =========================================================================

-- 1. Create dedicated `genders` lookup table
CREATE TABLE IF NOT EXISTS "genders" (
    "id" text PRIMARY KEY,                -- 'female', 'male', 'unisex', 'all'
    "code" text UNIQUE NOT NULL,          -- 'female', 'male', 'unisex', 'all'
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "description" text,
    "icon" text,
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Index for lookup queries
CREATE INDEX IF NOT EXISTS "genders_code_idx" ON "genders" ("code");
CREATE INDEX IF NOT EXISTS "genders_is_active_idx" ON "genders" ("is_active");

-- Attach updated_at trigger to `genders`
DROP TRIGGER IF EXISTS set_genders_updated_at ON "genders";
CREATE TRIGGER set_genders_updated_at
    BEFORE UPDATE ON "genders"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Seed `genders` lookup table
INSERT INTO "genders" ("id", "code", "name_en", "name_te", "description", "icon", "display_order", "is_active")
VALUES
    ('female', 'female', 'Female', 'మహిళలు', 'Women fashion models, garments, jewelry, and feminine presentation', 'lucide:user', 1, true),
    ('male', 'male', 'Male', 'పురుషులు', 'Men fashion models, garments, jewelry, and masculine presentation', 'lucide:user-check', 2, true),
    ('unisex', 'unisex', 'Unisex', 'యూనిసెక్స్', 'Gender-neutral fashion garments, jewelry, and versatile items', 'lucide:users', 3, true),
    ('all', 'all', 'All Collections', 'అన్ని కలెక్షన్లు', 'Universal vertical and presentation modes for all audiences', 'lucide:asterisk', 4, true)
ON CONFLICT ("id") DO UPDATE SET
    "code" = EXCLUDED."code",
    "name_en" = EXCLUDED."name_en",
    "name_te" = EXCLUDED."name_te",
    "description" = EXCLUDED."description",
    "icon" = EXCLUDED."icon",
    "display_order" = EXCLUDED."display_order",
    "is_active" = EXCLUDED."is_active",
    "updated_at" = now();

-- 3. Also synchronize `system_lookups` with unisex and all
INSERT INTO "system_lookups" ("id", "type", "code", "name_en", "name_te", "description", "icon", "display_order", "is_active")
VALUES
    ('gender_unisex', 'gender', 'unisex', 'Unisex', 'యూనిసెక్స్', 'Gender-neutral garments and versatile options', 'lucide:users', 3, true),
    ('gender_all', 'gender', 'all', 'All Collections', 'అన్ని కలెక్షన్లు', 'Universal options across all categories', 'lucide:asterisk', 4, true)
ON CONFLICT ("id") DO UPDATE SET
    "type" = EXCLUDED."type",
    "code" = EXCLUDED."code",
    "name_en" = EXCLUDED."name_en",
    "name_te" = EXCLUDED."name_te",
    "description" = EXCLUDED."description",
    "icon" = EXCLUDED."icon",
    "display_order" = EXCLUDED."display_order",
    "is_active" = EXCLUDED."is_active",
    "updated_at" = now();

-- 4. Drop restrictive CHECK constraints on existing tables so foreign keys govern validity
ALTER TABLE "business_categories" DROP CONSTRAINT IF EXISTS "business_categories_gender_target_check";
ALTER TABLE "catalog_items" DROP CONSTRAINT IF EXISTS "catalog_items_gender_target_check";

-- 5. Add columns to remaining tables if they don't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studio_presets' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE "studio_presets" ADD COLUMN IF NOT EXISTS "gender_target" text DEFAULT 'all';
        UPDATE "studio_presets"
        SET "gender_target" = CASE
            WHEN metadata->>'gender' = 'female' THEN 'female'
            WHEN metadata->>'gender' = 'male' THEN 'male'
            WHEN metadata->>'gender' = 'unisex' THEN 'unisex'
            ELSE 'all'
        END
        WHERE "gender_target" IS NULL OR "gender_target" = 'all';

        ALTER TABLE "studio_presets" DROP CONSTRAINT IF EXISTS "fk_studio_presets_gender_target";
        ALTER TABLE "studio_presets"
            ADD CONSTRAINT "fk_studio_presets_gender_target"
            FOREIGN KEY ("gender_target") REFERENCES "genders"("id")
            ON UPDATE CASCADE ON DELETE SET DEFAULT;

        CREATE INDEX IF NOT EXISTS "studio_presets_gender_target_idx" ON "studio_presets" ("gender_target");
    END IF;
END $$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "gender" text;
ALTER TABLE "usage" ADD COLUMN IF NOT EXISTS "gender_target" text;

-- 7. Add Foreign Key constraints (FK) to all remaining tables
-- 7a. business_categories -> genders(id)
ALTER TABLE "business_categories" DROP CONSTRAINT IF EXISTS "fk_business_categories_gender_target";
ALTER TABLE "business_categories"
    ADD CONSTRAINT "fk_business_categories_gender_target"
    FOREIGN KEY ("gender_target") REFERENCES "genders"("id")
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- 7b. catalog_items -> genders(id)
ALTER TABLE "catalog_items" DROP CONSTRAINT IF EXISTS "fk_catalog_items_gender_target";
ALTER TABLE "catalog_items"
    ADD CONSTRAINT "fk_catalog_items_gender_target"
    FOREIGN KEY ("gender_target") REFERENCES "genders"("id")
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- 7d. users -> genders(id)
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_users_gender";
ALTER TABLE "users"
    ADD CONSTRAINT "fk_users_gender"
    FOREIGN KEY ("gender") REFERENCES "genders"("id")
    ON UPDATE CASCADE ON DELETE SET NULL;

-- 7e. usage -> genders(id)
ALTER TABLE "usage" DROP CONSTRAINT IF EXISTS "fk_usage_gender_target";
ALTER TABLE "usage"
    ADD CONSTRAINT "fk_usage_gender_target"
    FOREIGN KEY ("gender_target") REFERENCES "genders"("id")
    ON UPDATE CASCADE ON DELETE SET NULL;

-- 8. Create performance indexes on Foreign Key columns
CREATE INDEX IF NOT EXISTS "users_gender_idx" ON "users" ("gender");
CREATE INDEX IF NOT EXISTS "usage_gender_target_idx" ON "usage" ("gender_target");
