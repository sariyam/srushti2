-- Migration: Add uniform optional columns across all 4 split preset tables and update studio_presets view
-- File: 20261004000007_align_all_preset_columns.sql

-- 1. Ensure all 4 tables have consistent nullable fields
ALTER TABLE "faces" ADD COLUMN IF NOT EXISTS "camera_framing" text;
ALTER TABLE "faces" ADD COLUMN IF NOT EXISTS "face_visibility_rule" text;
ALTER TABLE "faces" ADD COLUMN IF NOT EXISTS "color_hex" text;

ALTER TABLE "poses" ADD COLUMN IF NOT EXISTS "preview_image_url" text;
ALTER TABLE "poses" ADD COLUMN IF NOT EXISTS "storage_path" text;
ALTER TABLE "poses" ADD COLUMN IF NOT EXISTS "color_hex" text;

ALTER TABLE "presentations" ADD COLUMN IF NOT EXISTS "preview_image_url" text;
ALTER TABLE "presentations" ADD COLUMN IF NOT EXISTS "storage_path" text;
ALTER TABLE "presentations" ADD COLUMN IF NOT EXISTS "color_hex" text;

ALTER TABLE "backgrounds" ADD COLUMN IF NOT EXISTS "camera_framing" text;
ALTER TABLE "backgrounds" ADD COLUMN IF NOT EXISTS "face_visibility_rule" text;
ALTER TABLE "backgrounds" ADD COLUMN IF NOT EXISTS "preview_image_url" text;
ALTER TABLE "backgrounds" ADD COLUMN IF NOT EXISTS "storage_path" text;

-- 2. Drop and recreate views with consistent column lists
DROP VIEW IF EXISTS "studio_presets";
DROP VIEW IF EXISTS "background";

CREATE VIEW "studio_presets" AS
  SELECT id, 'face'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "faces"
  UNION ALL
  SELECT id, 'pose'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "poses"
  UNION ALL
  SELECT id, 'presentation'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "presentations"
  UNION ALL
  SELECT id, 'background'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "backgrounds";

CREATE VIEW "background" AS SELECT * FROM "backgrounds";
