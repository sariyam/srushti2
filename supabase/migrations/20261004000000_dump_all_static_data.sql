-- =========================================================================
-- Migration: 20261004000000_dump_all_static_data.sql
-- Description: Adds sub_category to studio_presets and enhances system_settings
-- for complete frontend static data extraction and backend-driven presets.
-- =========================================================================

-- 1. Add sub_category to studio_presets (for pose/bg/face categorization)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studio_presets' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE studio_presets ADD COLUMN IF NOT EXISTS sub_category TEXT;
        CREATE INDEX IF NOT EXISTS studio_presets_sub_category_idx ON studio_presets(sub_category);
    END IF;
END $$;

-- 2. Ensure system_settings supports category indexing and fast JSON queries
CREATE INDEX IF NOT EXISTS system_settings_category_idx ON system_settings(category);
