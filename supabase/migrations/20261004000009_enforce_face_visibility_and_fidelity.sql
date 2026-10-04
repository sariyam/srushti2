-- Migration: Enforce Face Visibility Rules on Presentations and 100% Face Identity Replication Directives
-- File: 20261004000009_enforce_face_visibility_and_fidelity.sql

-- 1. Ensure column face_visibility_rule exists on presentations
ALTER TABLE "presentations" ADD COLUMN IF NOT EXISTS "face_visibility_rule" text;

-- 2. Populate and align face_visibility_rule for presentation modes
-- 'model' requires full face model selector UI
UPDATE "presentations" 
SET "face_visibility_rule" = 'full_face',
    "updated_at" = now()
WHERE "id" = 'model';

-- 'partial_face' requires partial face model selector UI
UPDATE "presentations" 
SET "face_visibility_rule" = 'partial_face',
    "updated_at" = now()
WHERE "id" = 'partial_face';

-- All other presentation modes strictly hide the face selector UI
UPDATE "presentations" 
SET "face_visibility_rule" = 'no_face',
    "updated_at" = now()
WHERE "id" NOT IN ('model', 'partial_face');

-- 3. Upsert Face Matching & 100% Identity Replication System Setting
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
    "face_fidelity_instruction": "The reference image of the human model (second uploaded image) is for 100% FACE IDENTITY REPLICATION. Maintain identical facial structure, eyes, nose, lips, jawline, skin tone, and ethnic identity from the face reference image with zero morphing or substitution."
  }'::jsonb,
  'Face reference UI visibility rules and 100% face identity replication guardrails',
  now()
)
ON CONFLICT ("key") DO UPDATE SET
  "value" = EXCLUDED."value",
  "description" = EXCLUDED."description",
  "updated_at" = now();

-- 4. Update fidelity_directives in system_settings with 100% face identity mandate
UPDATE "system_settings"
SET "value" = jsonb_set(
  jsonb_set(
    "value",
    '{highest_priority_face_rule}',
    '"100% IDENTICAL HUMAN FACE IDENTITY REPLICATION REQUIRED - EXACT SAME PERSON PRESERVED"'::jsonb,
    true
  ),
  '{mandatory_face_replications}',
  '[
    "Exact 1:1 reproduction of the reference human model face with 100% photographic fidelity",
    "Preserve identical bone structure, eye contour, iris color, nose profile, lip anatomy, jawline, skin tone, and facial landmarks",
    "Strictly zero facial morphing, zero generic AI face substitution, zero ethnic drift, and zero age shifting",
    "Seamless natural blend of the exact same person onto the generated body pose and outfit"
  ]'::jsonb,
  true
),
"updated_at" = now()
WHERE "key" = 'fidelity_directives';

-- 5. Refresh studio_presets unified view
DROP VIEW IF EXISTS "studio_presets";
CREATE VIEW "studio_presets" AS
  SELECT id, 'face'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "faces"
  UNION ALL
  SELECT id, 'pose'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "poses"
  UNION ALL
  SELECT id, 'presentation'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "presentations"
  UNION ALL
  SELECT id, 'background'::text as type, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, preview_image_url, storage_path, color_hex, display_order, is_active, metadata, created_at, updated_at FROM "backgrounds";
