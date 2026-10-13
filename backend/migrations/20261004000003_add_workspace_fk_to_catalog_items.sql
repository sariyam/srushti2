-- ==============================================================================
-- SRUSHTI AI — WORKSPACE LOOKUP & CATALOG_ITEMS WORKSPACE FOREIGN KEY MIGRATION
-- Migration Version: 20261004000003_add_workspace_fk_to_catalog_items.sql
-- Description: Creates workspaces lookup table, links business_categories.workspace,
--              catalog_items.workspace, and adds composite foreign key from
--              catalog_items(business_category_id, workspace) to business_categories(id, workspace).
-- ==============================================================================

-- 1. Create Workspaces Table
CREATE TABLE IF NOT EXISTS "workspaces" (
    "id" text PRIMARY KEY,
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

-- 2. Seed initial workspaces (garment, jewelry, general, all, face)
INSERT INTO "workspaces" ("id", "code", "name_en", "name_te", "description", "icon", "display_order", "is_active")
VALUES
    ('garment', 'garment', 'Garment Studio', 'దుస్తుల స్టూడియో', 'Apparel, sarees, lehengas, westernwear photoshoot studio', 'Shirt', 1, true),
    ('jewelry', 'jewelry', 'Jewelry Studio', 'నగల స్టూడియో', 'Precious jewelry, necklaces, earrings, watches product studio', 'Gem', 2, true),
    ('general', 'general', 'General Studio', 'సాధారణ స్టూడియో', 'General multipurpose studio and presentations', 'Sparkles', 3, true),
    ('all', 'all', 'All Workspaces', 'అన్ని స్టూడియోలు', 'Universal presets applicable to both garment and jewelry', 'Globe', 4, true),
    ('face', 'face', 'Face & Model Studio', 'మోడల్ ఫేస్ స్టూడియో', 'Model face generator and custom headshot workspace', 'ScanFace', 5, true)
ON CONFLICT ("id") DO UPDATE SET
    "name_en" = EXCLUDED."name_en",
    "name_te" = EXCLUDED."name_te",
    "description" = EXCLUDED."description",
    "icon" = EXCLUDED."icon",
    "display_order" = EXCLUDED."display_order",
    "updated_at" = now();

CREATE INDEX IF NOT EXISTS "workspaces_code_idx" ON "workspaces" USING btree ("code");
CREATE INDEX IF NOT EXISTS "workspaces_is_active_idx" ON "workspaces" USING btree ("is_active");

-- 3. Add Foreign Key: business_categories.workspace -> workspaces(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_business_categories_workspace'
    ) THEN
        ALTER TABLE "business_categories"
            ADD CONSTRAINT "fk_business_categories_workspace"
            FOREIGN KEY ("workspace")
            REFERENCES "workspaces"("id")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
    END IF;
END $$;

-- 4. Add Unique Constraint on business_categories(id, workspace) for composite FK
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_business_categories_id_workspace'
    ) THEN
        ALTER TABLE "business_categories"
            ADD CONSTRAINT "uq_business_categories_id_workspace"
            UNIQUE ("id", "workspace");
    END IF;
END $$;

-- 5. Add Foreign Key: catalog_items.workspace -> workspaces(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_catalog_items_workspace'
    ) THEN
        ALTER TABLE "catalog_items"
            ADD CONSTRAINT "fk_catalog_items_workspace"
            FOREIGN KEY ("workspace")
            REFERENCES "workspaces"("id")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
    END IF;
END $$;

-- 6. Add Composite Foreign Key: catalog_items(business_category_id, workspace) -> business_categories(id, workspace)
DO $$
BEGIN
    -- Drop old single-column FK if exists to replace with composite or keep both
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_catalog_items_business_category_workspace'
    ) THEN
        ALTER TABLE "catalog_items"
            ADD CONSTRAINT "fk_catalog_items_business_category_workspace"
            FOREIGN KEY ("business_category_id", "workspace")
            REFERENCES "business_categories"("id", "workspace")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
    END IF;
END $$;

-- 7. Add Foreign Key: studio_presets.workspace -> workspaces(id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studio_presets' AND table_type = 'BASE TABLE') 
       AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_studio_presets_workspace'
    ) THEN
        ALTER TABLE "studio_presets"
            ADD CONSTRAINT "fk_studio_presets_workspace"
            FOREIGN KEY ("workspace")
            REFERENCES "workspaces"("id")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
    END IF;
END $$;

-- 8. Add Foreign Key: usage.workspace -> workspaces(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_usage_workspace'
    ) THEN
        ALTER TABLE "usage"
            ADD CONSTRAINT "fk_usage_workspace"
            FOREIGN KEY ("workspace")
            REFERENCES "workspaces"("id")
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
    END IF;
END $$;
