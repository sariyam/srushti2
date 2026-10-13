-- ==============================================================================
-- SRUSHTI AI — BACKEND-DRIVEN STUDIO CONFIG & PRESETS MIGRATION
-- Migration Version: 20261003000000_studio_config.sql
-- Description: Tables for Business Categories, Catalog Items, Studio Presets,
--              System Settings, and Supabase Storage bucket for model faces.
-- ==============================================================================

-- 1. Business Categories / Verticals Table
CREATE TABLE IF NOT EXISTS "business_categories" (
    "id" text PRIMARY KEY,
    "workspace" text DEFAULT 'garment' NOT NULL CHECK ("workspace" IN ('garment', 'jewelry', 'general')),
    "gender_target" text DEFAULT 'all' NOT NULL CHECK ("gender_target" IN ('female', 'male', 'all')),
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "icon" text,
    "banner_url" text,
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Catalog Items Table (Garment & Jewelry styles with prompt directives)
CREATE TABLE IF NOT EXISTS "catalog_items" (
    "id" text PRIMARY KEY,
    "business_category_id" text REFERENCES "business_categories"("id") ON DELETE SET NULL,
    "workspace" text DEFAULT 'garment' NOT NULL CHECK ("workspace" IN ('garment', 'jewelry')),
    "gender_target" text DEFAULT 'unisex' NOT NULL CHECK ("gender_target" IN ('female', 'male', 'unisex')),
    "category_label" text NOT NULL, -- 'Full wear', 'Top wear', 'Bottom wear', 'Neckwear', etc.
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "prompt_directive" text NOT NULL,
    "placement_directive" text,
    "icon" text,
    "sample_image_url" text,
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Studio Presets Table (Poses, Backgrounds, Faces, Presentations, Styles)
CREATE TABLE IF NOT EXISTS "studio_presets" (
    "id" text PRIMARY KEY,
    "type" text NOT NULL CHECK ("type" IN ('pose', 'background', 'face', 'presentation', 'style')),
    "workspace" text DEFAULT 'all' NOT NULL CHECK ("workspace" IN ('garment', 'jewelry', 'all')),
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "prompt_directive" text NOT NULL,
    "camera_framing" text,
    "face_visibility_rule" text,
    "thumbnail_url" text,
    "preview_image_url" text, -- Public Supabase Storage CDN URL for model faces
    "storage_path" text,       -- Internal Storage path: e.g. 'model-faces/ananya.jpg'
    "color_hex" text,         -- for plain backgrounds
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. System Settings Table (AI Model Gateways, Pricing, Fidelity Guardrails)
CREATE TABLE IF NOT EXISTS "system_settings" (
    "key" text PRIMARY KEY,
    "category" text NOT NULL CHECK ("category" IN ('ai', 'pricing', 'fidelity', 'security', 'general')),
    "value" jsonb NOT NULL,
    "description" text,
    "updated_by" uuid REFERENCES "users"("id") ON DELETE SET NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS "business_categories_workspace_idx" ON "business_categories" USING btree ("workspace");
CREATE INDEX IF NOT EXISTS "business_categories_gender_idx" ON "business_categories" USING btree ("gender_target");
CREATE INDEX IF NOT EXISTS "catalog_items_workspace_idx" ON "catalog_items" USING btree ("workspace");
CREATE INDEX IF NOT EXISTS "catalog_items_gender_idx" ON "catalog_items" USING btree ("gender_target");
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studio_presets' AND table_type = 'BASE TABLE') THEN
        CREATE INDEX IF NOT EXISTS "studio_presets_type_idx" ON "studio_presets" USING btree ("type");
        CREATE INDEX IF NOT EXISTS "studio_presets_workspace_idx" ON "studio_presets" USING btree ("workspace");
        CREATE INDEX IF NOT EXISTS "studio_presets_is_active_idx" ON "studio_presets" USING btree ("is_active");

        DROP TRIGGER IF EXISTS set_studio_presets_updated_at ON "studio_presets";
        CREATE TRIGGER set_studio_presets_updated_at
            BEFORE UPDATE ON "studio_presets"
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS "system_settings_category_idx" ON "system_settings" USING btree ("category");

-- 6. Attach updated_at triggers
DROP TRIGGER IF EXISTS set_business_categories_updated_at ON "business_categories";
CREATE TRIGGER set_business_categories_updated_at
    BEFORE UPDATE ON "business_categories"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_catalog_items_updated_at ON "catalog_items";
CREATE TRIGGER set_catalog_items_updated_at
    BEFORE UPDATE ON "catalog_items"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_system_settings_updated_at ON "system_settings";
CREATE TRIGGER set_system_settings_updated_at
    BEFORE UPDATE ON "system_settings"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Supabase Storage: 'model-faces' Public Bucket Provisioning
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'storage' AND table_name = 'buckets'
    ) THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'model-faces',
            'model-faces',
            true,
            10485760, -- 10 MB limit for high-res model face portraits
            ARRAY['image/jpeg', 'image/png', 'image/webp']
        )
        ON CONFLICT (id) DO UPDATE 
        SET public = true,
            file_size_limit = 10485760,
            allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];
    END IF;
END $$;

-- 8. Storage Object Public Read Policy for 'model-faces'
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'storage' AND table_name = 'objects'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Model Faces'
        ) THEN
            CREATE POLICY "Public Access for Model Faces"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'model-faces');
        END IF;
    END IF;
END $$;
