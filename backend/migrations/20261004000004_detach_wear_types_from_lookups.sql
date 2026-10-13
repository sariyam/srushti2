-- ==============================================================================
-- SRUSHTI AI — DETACH WEAR TYPES FROM LOOKUP TABLE & CREATE DEDICATED WEAR_TYPES TABLE WITH FKS
-- Migration Version: 20261004000004_detach_wear_types_from_lookups.sql
-- Description: Creates wear_types table, references workspaces(id), adds foreign keys
--              from catalog_items(wear_type_id, workspace) and studio_presets(wear_type_id),
--              and cleans up wear categories from system_lookups.
-- ==============================================================================

-- 1. Create wear_types Table
CREATE TABLE IF NOT EXISTS "wear_types" (
    "id" text PRIMARY KEY,
    "workspace" text NOT NULL REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "code" text NOT NULL UNIQUE,
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

-- Unique constraint on (id, workspace) for composite FK integrity
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_wear_types_id_workspace'
    ) THEN
        ALTER TABLE "wear_types"
            ADD CONSTRAINT "uq_wear_types_id_workspace"
            UNIQUE ("id", "workspace");
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "wear_types_workspace_idx" ON "wear_types" USING btree ("workspace");
CREATE INDEX IF NOT EXISTS "wear_types_code_idx" ON "wear_types" USING btree ("code");
CREATE INDEX IF NOT EXISTS "wear_types_is_active_idx" ON "wear_types" USING btree ("is_active");

-- 2. Seed initial wear types for garment and jewelry workspaces
INSERT INTO "wear_types" ("id", "workspace", "code", "name_en", "name_te", "description", "icon", "display_order", "is_active")
VALUES
    -- Garment Workspace Wear Types
    ('top_wear', 'garment', 'top_wear', 'Top Wear', 'పై దుస్తులు', 'Shirts, T-shirts, Kurtis, Blouses, Tops, Hoodies, Blazers', 'lucide:shirt', 1, true),
    ('bottom_wear', 'garment', 'bottom_wear', 'Bottom Wear', 'కింది దుస్తులు', 'Jeans, Trousers, Skirts, Pants, Trackpants', 'lucide:scissors', 2, true),
    ('full_wear', 'garment', 'full_wear', 'Full Wear', 'పూర్తి దుస్తులు', 'Dresses, Sarees, Suits, Jumpsuits, Gowns, Sherwanis, Dhotis', 'lucide:sparkles', 3, true),

    -- Jewelry Workspace Wear Types
    ('neck_wear', 'jewelry', 'neck_wear', 'Neck Wear', 'నెక్ వేర్', 'Necklaces, Chokers, Chains, Pendants, Mangalsutras', 'lucide:gem', 4, true),
    ('ear_wear', 'jewelry', 'ear_wear', 'Ear Wear', 'ఇయర్ వేర్', 'Earrings, Jhumkas, Studs, Drops, Hoops', 'lucide:sparkle', 5, true),
    ('wrist_wear', 'jewelry', 'wrist_wear', 'Wrist Wear', 'రిస్ట్ వేర్', 'Bangles, Bracelets, Kadas, Watches', 'lucide:watch', 6, true),
    ('hip_wear', 'jewelry', 'hip_wear', 'Hip Wear', 'హిప్ వేర్', 'Vaddanams, Waistbands, Kamarbands, Hip Chains', 'lucide:shield', 7, true),
    ('nose_wear', 'jewelry', 'nose_wear', 'Nose Wear', 'ముక్కుపుడక', 'Nose pins, Naths, Bridal Nose Rings', 'lucide:circle-dot', 8, true),
    ('leg_wear', 'jewelry', 'leg_wear', 'Leg Wear', 'లెగ్ వేర్', 'Anklets, Payals, Toe rings', 'lucide:footprints', 9, true),
    ('forehead_wear', 'jewelry', 'forehead_wear', 'Forehead Wear', 'నుదురు ఆభరణాలు', 'Maang tikkas, Mathapattis, Borlas', 'lucide:crown', 10, true),
    ('other_wear', 'jewelry', 'other_wear', 'Other Wear', 'ఇతర ఆభరణాలు', 'Brooches, Rings, Accessories', 'lucide:award', 11, true)
ON CONFLICT ("id") DO UPDATE SET
    "workspace" = EXCLUDED."workspace",
    "name_en" = EXCLUDED."name_en",
    "name_te" = EXCLUDED."name_te",
    "description" = EXCLUDED."description",
    "icon" = EXCLUDED."icon",
    "display_order" = EXCLUDED."display_order",
    "updated_at" = now();

-- 3. Add wear_type_id column to catalog_items and backfill (if category_label still exists prior to migration 5)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'catalog_items' AND column_name = 'category_label'
    ) THEN
        ALTER TABLE "catalog_items" ADD COLUMN IF NOT EXISTS "wear_type_id" text;

        UPDATE "catalog_items" SET "wear_type_id" = 
            CASE 
                WHEN "category_label" ILIKE '%full%wear%' THEN 'full_wear'
                WHEN "category_label" ILIKE '%top%wear%' THEN 'top_wear'
                WHEN "category_label" ILIKE '%bottom%wear%' THEN 'bottom_wear'
                WHEN "category_label" ILIKE '%neck%' THEN 'neck_wear'
                WHEN "category_label" ILIKE '%ear%' THEN 'ear_wear'
                WHEN "category_label" ILIKE '%wrist%' OR "category_label" ILIKE '%bangle%' THEN 'wrist_wear'
                WHEN "category_label" ILIKE '%hip%' OR "category_label" ILIKE '%waist%' THEN 'hip_wear'
                WHEN "category_label" ILIKE '%nose%' THEN 'nose_wear'
                WHEN "category_label" ILIKE '%leg%' OR "category_label" ILIKE '%anklet%' OR "category_label" ILIKE '%toe%' THEN 'leg_wear'
                WHEN "category_label" ILIKE '%forehead%' OR "category_label" ILIKE '%head%' THEN 'forehead_wear'
                WHEN "category_label" ILIKE '%ring%' THEN 'wrist_wear'
                WHEN "workspace" = 'garment' THEN 'full_wear'
                ELSE 'other_wear'
            END
        WHERE "wear_type_id" IS NULL;

        ALTER TABLE "catalog_items" ALTER COLUMN "wear_type_id" SET NOT NULL;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_catalog_items_wear_type'
        ) THEN
            ALTER TABLE "catalog_items"
                ADD CONSTRAINT "fk_catalog_items_wear_type"
                FOREIGN KEY ("wear_type_id")
                REFERENCES "wear_types"("id")
                ON DELETE RESTRICT
                ON UPDATE CASCADE;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_catalog_items_wear_type_workspace'
        ) THEN
            ALTER TABLE "catalog_items"
                ADD CONSTRAINT "fk_catalog_items_wear_type_workspace"
                FOREIGN KEY ("wear_type_id", "workspace")
                REFERENCES "wear_types"("id", "workspace")
                ON DELETE RESTRICT
                ON UPDATE CASCADE;
        END IF;

        CREATE INDEX IF NOT EXISTS "catalog_items_wear_type_idx" ON "catalog_items" USING btree ("wear_type_id");
    END IF;
END $$;

-- 5. Add wear_type_id column to studio_presets and backfill for poses
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studio_presets' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE "studio_presets" ADD COLUMN IF NOT EXISTS "wear_type_id" text;

        UPDATE "studio_presets" SET "wear_type_id" = 
            CASE 
                WHEN "sub_category" = 'full_wear' THEN 'full_wear'
                WHEN "sub_category" = 'top_wear' THEN 'top_wear'
                WHEN "sub_category" = 'bottom_wear' THEN 'bottom_wear'
                WHEN "sub_category" IN ('neck_ear', 'neckwear') THEN 'neck_wear'
                WHEN "sub_category" = 'ear_wear' THEN 'ear_wear'
                WHEN "sub_category" IN ('wrist_ring', 'wrist') THEN 'wrist_wear'
                WHEN "sub_category" = 'hip' THEN 'hip_wear'
                WHEN "sub_category" = 'nose' THEN 'nose_wear'
                WHEN "sub_category" = 'leg' THEN 'leg_wear'
                WHEN "sub_category" = 'forehead' THEN 'forehead_wear'
                WHEN "sub_category" = 'finger' THEN 'wrist_wear'
                ELSE NULL
            END
        WHERE "wear_type_id" IS NULL AND "type" = 'pose';

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_studio_presets_wear_type'
        ) THEN
            ALTER TABLE "studio_presets"
                ADD CONSTRAINT "fk_studio_presets_wear_type"
                FOREIGN KEY ("wear_type_id")
                REFERENCES "wear_types"("id")
                ON DELETE SET NULL
                ON UPDATE CASCADE;
        END IF;

        CREATE INDEX IF NOT EXISTS "studio_presets_wear_type_idx" ON "studio_presets" USING btree ("wear_type_id");
    END IF;
END $$;

-- 6. Detach wear categories from system_lookups table
DELETE FROM "system_lookups" 
WHERE "type" IN ('garment_category', 'jewelry_category');
