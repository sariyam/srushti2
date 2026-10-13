-- Migration: Link catalog_items to presentations, backgrounds (indoor + outdoor), and poses via junction tables
-- File: 20261004000008_link_catalog_items_to_presets.sql

-- 1. Create catalog_item_presentations junction table
CREATE TABLE IF NOT EXISTS "catalog_item_presentations" (
    "catalog_item_id" text NOT NULL,
    "presentation_id" text NOT NULL,
    "display_order" integer NOT NULL DEFAULT 0,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "pk_catalog_item_presentations" PRIMARY KEY ("catalog_item_id", "presentation_id"),
    CONSTRAINT "fk_cat_item_pres_item" FOREIGN KEY ("catalog_item_id") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_cat_item_pres_pres" FOREIGN KEY ("presentation_id") REFERENCES "presentations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cat_item_pres_item_idx" ON "catalog_item_presentations"("catalog_item_id");
CREATE INDEX IF NOT EXISTS "cat_item_pres_pres_idx" ON "catalog_item_presentations"("presentation_id");

-- 2. Create catalog_item_backgrounds junction table
CREATE TABLE IF NOT EXISTS "catalog_item_backgrounds" (
    "catalog_item_id" text NOT NULL,
    "background_id" text NOT NULL,
    "display_order" integer NOT NULL DEFAULT 0,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "pk_catalog_item_backgrounds" PRIMARY KEY ("catalog_item_id", "background_id"),
    CONSTRAINT "fk_cat_item_bg_item" FOREIGN KEY ("catalog_item_id") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_cat_item_bg_bg" FOREIGN KEY ("background_id") REFERENCES "backgrounds"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cat_item_bg_item_idx" ON "catalog_item_backgrounds"("catalog_item_id");
CREATE INDEX IF NOT EXISTS "cat_item_bg_bg_idx" ON "catalog_item_backgrounds"("background_id");

-- 3. Create catalog_item_poses junction table
CREATE TABLE IF NOT EXISTS "catalog_item_poses" (
    "catalog_item_id" text NOT NULL,
    "pose_id" text NOT NULL,
    "display_order" integer NOT NULL DEFAULT 0,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "pk_catalog_item_poses" PRIMARY KEY ("catalog_item_id", "pose_id"),
    CONSTRAINT "fk_cat_item_poses_item" FOREIGN KEY ("catalog_item_id") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_cat_item_poses_pose" FOREIGN KEY ("pose_id") REFERENCES "poses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cat_item_poses_item_idx" ON "catalog_item_poses"("catalog_item_id");
CREATE INDEX IF NOT EXISTS "cat_item_poses_pose_idx" ON "catalog_item_poses"("pose_id");

-- 4. Initial Backfill / Seeding for existing catalog_items:
-- 4a. Link catalog_items to compatible presentations
INSERT INTO "catalog_item_presentations" ("catalog_item_id", "presentation_id", "display_order")
SELECT 
    ci.id,
    pr.id,
    pr.display_order
FROM "catalog_items" ci
JOIN "presentations" pr ON (pr.workspace = 'all' OR pr.workspace = ci.workspace)
WHERE (pr.wear_type_id IS NULL OR pr.wear_type_id = ci.wear_type)
ON CONFLICT ("catalog_item_id", "presentation_id") DO NOTHING;

-- 4b. Link catalog_items to compatible backgrounds (both indoor and outdoor)
INSERT INTO "catalog_item_backgrounds" ("catalog_item_id", "background_id", "display_order")
SELECT 
    ci.id,
    bg.id,
    bg.display_order
FROM "catalog_items" ci
JOIN "backgrounds" bg ON (bg.workspace = 'all' OR bg.workspace = ci.workspace)
WHERE (bg.wear_type_id IS NULL OR bg.wear_type_id = ci.wear_type)
ON CONFLICT ("catalog_item_id", "background_id") DO NOTHING;

-- 4c. Link catalog_items to compatible poses
INSERT INTO "catalog_item_poses" ("catalog_item_id", "pose_id", "display_order")
SELECT 
    ci.id,
    p.id,
    p.display_order
FROM "catalog_items" ci
JOIN "poses" p ON (p.workspace = 'all' OR p.workspace = ci.workspace)
WHERE (p.wear_type_id IS NULL OR p.wear_type_id = ci.wear_type)
ON CONFLICT ("catalog_item_id", "pose_id") DO NOTHING;
