-- Migration: Split studio_presets into 4 separate tables: faces, poses, presentations, backgrounds
-- File: 20261004000006_split_studio_presets_into_4_tables.sql

-- 1. Create faces table
CREATE TABLE IF NOT EXISTS "faces" (
    "id" text PRIMARY KEY,
    "workspace" text NOT NULL DEFAULT 'all',
    "gender_target" text DEFAULT 'all',
    "wear_type_id" text,
    "sub_category" text,
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "prompt_directive" text NOT NULL,
    "preview_image_url" text,
    "storage_path" text,
    "thumbnail_url" text,
    "display_order" integer NOT NULL DEFAULT 0,
    "is_active" boolean NOT NULL DEFAULT true,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "fk_faces_workspace" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_faces_gender_target" FOREIGN KEY ("gender_target") REFERENCES "genders"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
    CONSTRAINT "fk_faces_wear_type" FOREIGN KEY ("wear_type_id") REFERENCES "wear_types"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2. Create poses table
CREATE TABLE IF NOT EXISTS "poses" (
    "id" text PRIMARY KEY,
    "workspace" text NOT NULL DEFAULT 'all',
    "gender_target" text DEFAULT 'all',
    "wear_type_id" text,
    "sub_category" text,
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "prompt_directive" text NOT NULL,
    "camera_framing" text,
    "face_visibility_rule" text,
    "thumbnail_url" text,
    "display_order" integer NOT NULL DEFAULT 0,
    "is_active" boolean NOT NULL DEFAULT true,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "fk_poses_workspace" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_poses_gender_target" FOREIGN KEY ("gender_target") REFERENCES "genders"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
    CONSTRAINT "fk_poses_wear_type" FOREIGN KEY ("wear_type_id") REFERENCES "wear_types"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 3. Create presentations table
CREATE TABLE IF NOT EXISTS "presentations" (
    "id" text PRIMARY KEY,
    "workspace" text NOT NULL DEFAULT 'all',
    "gender_target" text DEFAULT 'all',
    "wear_type_id" text,
    "sub_category" text,
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "prompt_directive" text NOT NULL,
    "camera_framing" text,
    "face_visibility_rule" text,
    "thumbnail_url" text,
    "display_order" integer NOT NULL DEFAULT 0,
    "is_active" boolean NOT NULL DEFAULT true,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "fk_presentations_workspace" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_presentations_gender_target" FOREIGN KEY ("gender_target") REFERENCES "genders"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
    CONSTRAINT "fk_presentations_wear_type" FOREIGN KEY ("wear_type_id") REFERENCES "wear_types"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4. Create backgrounds table
CREATE TABLE IF NOT EXISTS "backgrounds" (
    "id" text PRIMARY KEY,
    "workspace" text NOT NULL DEFAULT 'all',
    "gender_target" text DEFAULT 'all',
    "wear_type_id" text,
    "sub_category" text,
    "name_en" text NOT NULL,
    "name_te" text NOT NULL,
    "prompt_directive" text NOT NULL,
    "color_hex" text,
    "thumbnail_url" text,
    "display_order" integer NOT NULL DEFAULT 0,
    "is_active" boolean NOT NULL DEFAULT true,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "fk_backgrounds_workspace" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_backgrounds_gender_target" FOREIGN KEY ("gender_target") REFERENCES "genders"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
    CONSTRAINT "fk_backgrounds_wear_type" FOREIGN KEY ("wear_type_id") REFERENCES "wear_types"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 5. Migrate existing data from studio_presets into the 4 new tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studio_presets' AND table_type = 'BASE TABLE') THEN
        -- 5a. Migrate faces
        INSERT INTO "faces" (
            "id", "workspace", "gender_target", "wear_type_id", "sub_category",
            "name_en", "name_te", "prompt_directive", "preview_image_url", "storage_path",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        )
        SELECT
            "id",
            COALESCE("workspace", 'all'),
            COALESCE("gender_target", 'all'),
            "wear_type_id",
            "sub_category",
            "name_en", "name_te", "prompt_directive", "preview_image_url", "storage_path",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        FROM "studio_presets"
        WHERE "type" = 'face'
        ON CONFLICT ("id") DO NOTHING;

        -- 5b. Migrate poses
        INSERT INTO "poses" (
            "id", "workspace", "gender_target", "wear_type_id", "sub_category",
            "name_en", "name_te", "prompt_directive", "camera_framing", "face_visibility_rule",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        )
        SELECT
            "id",
            COALESCE("workspace", 'all'),
            COALESCE("gender_target", 'all'),
            "wear_type_id",
            "sub_category",
            "name_en", "name_te", "prompt_directive", "camera_framing", "face_visibility_rule",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        FROM "studio_presets"
        WHERE "type" = 'pose'
        ON CONFLICT ("id") DO NOTHING;

        -- 5c. Migrate presentations
        INSERT INTO "presentations" (
            "id", "workspace", "gender_target", "wear_type_id", "sub_category",
            "name_en", "name_te", "prompt_directive", "camera_framing", "face_visibility_rule",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        )
        SELECT
            "id",
            COALESCE("workspace", 'all'),
            COALESCE("gender_target", 'all'),
            "wear_type_id",
            "sub_category",
            "name_en", "name_te", "prompt_directive", "camera_framing", "face_visibility_rule",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        FROM "studio_presets"
        WHERE "type" = 'presentation'
        ON CONFLICT ("id") DO NOTHING;

        -- 5d. Migrate backgrounds
        INSERT INTO "backgrounds" (
            "id", "workspace", "gender_target", "wear_type_id", "sub_category",
            "name_en", "name_te", "prompt_directive", "color_hex",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        )
        SELECT
            "id",
            COALESCE("workspace", 'all'),
            COALESCE("gender_target", 'all'),
            "wear_type_id",
            "sub_category",
            "name_en", "name_te", "prompt_directive", "color_hex",
            "thumbnail_url", "display_order", "is_active", "metadata", "created_at", "updated_at"
        FROM "studio_presets"
        WHERE "type" = 'background'
        ON CONFLICT ("id") DO NOTHING;

        -- 5e. Drop base table studio_presets to complete the split
        DROP TABLE "studio_presets" CASCADE;
    END IF;
END $$;

-- 6. Create compatibility views
-- 6a. 'background' view pointing to 'backgrounds' (singular alias)
CREATE OR REPLACE VIEW "background" AS
    SELECT * FROM "backgrounds";

-- 6b. 'studio_presets' view unioning all 4 tables for backward compatibility
CREATE OR REPLACE VIEW "studio_presets" AS
    SELECT
        id,
        'face'::text AS type,
        workspace,
        gender_target,
        wear_type_id,
        sub_category,
        name_en,
        name_te,
        prompt_directive,
        NULL::text AS camera_framing,
        NULL::text AS face_visibility_rule,
        thumbnail_url,
        preview_image_url,
        storage_path,
        NULL::text AS color_hex,
        display_order,
        is_active,
        metadata,
        created_at,
        updated_at
    FROM "faces"
    UNION ALL
    SELECT
        id,
        'pose'::text AS type,
        workspace,
        gender_target,
        wear_type_id,
        sub_category,
        name_en,
        name_te,
        prompt_directive,
        camera_framing,
        face_visibility_rule,
        thumbnail_url,
        NULL::text AS preview_image_url,
        NULL::text AS storage_path,
        NULL::text AS color_hex,
        display_order,
        is_active,
        metadata,
        created_at,
        updated_at
    FROM "poses"
    UNION ALL
    SELECT
        id,
        'presentation'::text AS type,
        workspace,
        gender_target,
        wear_type_id,
        sub_category,
        name_en,
        name_te,
        prompt_directive,
        camera_framing,
        face_visibility_rule,
        thumbnail_url,
        NULL::text AS preview_image_url,
        NULL::text AS storage_path,
        NULL::text AS color_hex,
        display_order,
        is_active,
        metadata,
        created_at,
        updated_at
    FROM "presentations"
    UNION ALL
    SELECT
        id,
        'background'::text AS type,
        workspace,
        gender_target,
        wear_type_id,
        sub_category,
        name_en,
        name_te,
        prompt_directive,
        NULL::text AS camera_framing,
        NULL::text AS face_visibility_rule,
        thumbnail_url,
        NULL::text AS preview_image_url,
        NULL::text AS storage_path,
        color_hex,
        display_order,
        is_active,
        metadata,
        created_at,
        updated_at
    FROM "backgrounds";

-- 7. Create indices on all 4 tables
CREATE INDEX IF NOT EXISTS "faces_workspace_idx" ON "faces"("workspace");
CREATE INDEX IF NOT EXISTS "faces_gender_target_idx" ON "faces"("gender_target");
CREATE INDEX IF NOT EXISTS "faces_wear_type_idx" ON "faces"("wear_type_id");
CREATE INDEX IF NOT EXISTS "faces_sub_category_idx" ON "faces"("sub_category");
CREATE INDEX IF NOT EXISTS "faces_is_active_idx" ON "faces"("is_active");

CREATE INDEX IF NOT EXISTS "poses_workspace_idx" ON "poses"("workspace");
CREATE INDEX IF NOT EXISTS "poses_gender_target_idx" ON "poses"("gender_target");
CREATE INDEX IF NOT EXISTS "poses_wear_type_idx" ON "poses"("wear_type_id");
CREATE INDEX IF NOT EXISTS "poses_sub_category_idx" ON "poses"("sub_category");
CREATE INDEX IF NOT EXISTS "poses_is_active_idx" ON "poses"("is_active");

CREATE INDEX IF NOT EXISTS "presentations_workspace_idx" ON "presentations"("workspace");
CREATE INDEX IF NOT EXISTS "presentations_gender_target_idx" ON "presentations"("gender_target");
CREATE INDEX IF NOT EXISTS "presentations_wear_type_idx" ON "presentations"("wear_type_id");
CREATE INDEX IF NOT EXISTS "presentations_is_active_idx" ON "presentations"("is_active");

CREATE INDEX IF NOT EXISTS "backgrounds_workspace_idx" ON "backgrounds"("workspace");
CREATE INDEX IF NOT EXISTS "backgrounds_gender_target_idx" ON "backgrounds"("gender_target");
CREATE INDEX IF NOT EXISTS "backgrounds_wear_type_idx" ON "backgrounds"("wear_type_id");
CREATE INDEX IF NOT EXISTS "backgrounds_sub_category_idx" ON "backgrounds"("sub_category");
CREATE INDEX IF NOT EXISTS "backgrounds_is_active_idx" ON "backgrounds"("is_active");

-- 8. Attach updated_at triggers to all 4 tables
DROP TRIGGER IF EXISTS set_faces_updated_at ON "faces";
CREATE TRIGGER set_faces_updated_at
    BEFORE UPDATE ON "faces"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_poses_updated_at ON "poses";
CREATE TRIGGER set_poses_updated_at
    BEFORE UPDATE ON "poses"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_presentations_updated_at ON "presentations";
CREATE TRIGGER set_presentations_updated_at
    BEFORE UPDATE ON "presentations"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_backgrounds_updated_at ON "backgrounds";
CREATE TRIGGER set_backgrounds_updated_at
    BEFORE UPDATE ON "backgrounds"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
