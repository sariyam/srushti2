-- Migration: Remove category_label from catalog_items and set wear_type as foreign key to wear_types
-- File: 20261004000005_remove_category_label_add_wear_type.sql

-- 1. Ensure wear_types table exists with primary key and unique (id, workspace) constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'wear_types'
    ) THEN
        RAISE EXCEPTION 'Table wear_types must exist before running this migration';
    END IF;
END $$;

-- 2. Add column wear_type to catalog_items if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'catalog_items' AND column_name = 'wear_type'
    ) THEN
        -- If wear_type_id exists, we can migrate its values or add wear_type
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'catalog_items' AND column_name = 'wear_type_id'
        ) THEN
            ALTER TABLE "catalog_items" ADD COLUMN "wear_type" text;
            UPDATE "catalog_items" SET "wear_type" = "wear_type_id";
        ELSE
            ALTER TABLE "catalog_items" ADD COLUMN "wear_type" text;
            -- Backfill by workspace and category
            UPDATE "catalog_items"
            SET "wear_type" = CASE
                WHEN "workspace" = 'garment' AND "category_label" ILIKE '%top%' THEN 'top_wear'
                WHEN "workspace" = 'garment' AND "category_label" ILIKE '%bottom%' THEN 'bottom_wear'
                WHEN "workspace" = 'garment' THEN 'full_wear'
                WHEN "workspace" = 'jewelry' AND "category_label" ILIKE '%neck%' THEN 'neck_wear'
                WHEN "workspace" = 'jewelry' AND "category_label" ILIKE '%ear%' THEN 'ear_wear'
                WHEN "workspace" = 'jewelry' AND ("category_label" ILIKE '%wrist%' OR "category_label" ILIKE '%bangle%') THEN 'wrist_wear'
                WHEN "workspace" = 'jewelry' AND ("category_label" ILIKE '%hip%' OR "category_label" ILIKE '%waist%') THEN 'hip_wear'
                WHEN "workspace" = 'jewelry' AND "category_label" ILIKE '%nose%' THEN 'nose_wear'
                WHEN "workspace" = 'jewelry' AND ("category_label" ILIKE '%leg%' OR "category_label" ILIKE '%anklet%') THEN 'leg_wear'
                WHEN "workspace" = 'jewelry' AND ("category_label" ILIKE '%forehead%' OR "category_label" ILIKE '%head%') THEN 'forehead_wear'
                ELSE 'other_wear'
            END;
        END IF;
    END IF;
END $$;

-- 3. Set NOT NULL on wear_type
ALTER TABLE "catalog_items" ALTER COLUMN "wear_type" SET NOT NULL;

-- 4. Drop old foreign keys on wear_type_id if they exist
ALTER TABLE "catalog_items" DROP CONSTRAINT IF EXISTS "fk_catalog_items_wear_type";
ALTER TABLE "catalog_items" DROP CONSTRAINT IF EXISTS "fk_catalog_items_wear_type_workspace";
ALTER TABLE "catalog_items" DROP CONSTRAINT IF EXISTS "catalog_items_wear_type_id_fkey";

-- 5. Add new foreign key constraints on wear_type
ALTER TABLE "catalog_items"
ADD CONSTRAINT "fk_catalog_items_wear_type"
FOREIGN KEY ("wear_type") REFERENCES "wear_types"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "catalog_items"
ADD CONSTRAINT "fk_catalog_items_wear_type_workspace"
FOREIGN KEY ("wear_type", "workspace") REFERENCES "wear_types"("id", "workspace")
ON UPDATE CASCADE ON DELETE RESTRICT;

-- 6. Drop old wear_type_id column if present
ALTER TABLE "catalog_items" DROP COLUMN IF EXISTS "wear_type_id";

-- 7. Drop column category_label from catalog_items
ALTER TABLE "catalog_items" DROP COLUMN IF EXISTS "category_label";

-- 8. Add index on wear_type for fast query performance
CREATE INDEX IF NOT EXISTS "catalog_items_wear_type_idx" ON "catalog_items"("wear_type");
