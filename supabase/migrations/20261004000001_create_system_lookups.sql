-- =========================================================================
-- Migration: 20261004000001_create_system_lookups.sql
-- Description: Creates system_lookups table for background types (indoor, outdoor),
-- genders (male, female), garment categories (top_wear, bottom_wear, full_wear),
-- and jewelry categories (neck_wear, ear_wear, wrist_wear, etc.)
-- =========================================================================

CREATE TABLE IF NOT EXISTS system_lookups (
  id text PRIMARY KEY,
  type text NOT NULL,
  code text NOT NULL,
  name_en text NOT NULL,
  name_te text NOT NULL,
  description text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Relational and filtering indexes
CREATE INDEX IF NOT EXISTS system_lookups_type_idx ON system_lookups(type);
CREATE INDEX IF NOT EXISTS system_lookups_code_idx ON system_lookups(code);
CREATE INDEX IF NOT EXISTS system_lookups_is_active_idx ON system_lookups(is_active);

-- Initial Lookups Seed Data
INSERT INTO system_lookups (id, type, code, name_en, name_te, description, icon, display_order, is_active)
VALUES
  -- 1. Background Types [indoor, outdoor]
  ('bg_indoor', 'background_type', 'indoor', 'Indoor', 'ఇండోర్', 'Studio lighting, luxury rooms, showroom setups, and architectural interior spaces', 'lucide:home', 1, true),
  ('bg_outdoor', 'background_type', 'outdoor', 'Outdoor', 'అవుట్‌డోర్', 'Indian heritage courtyards, architecture, gardens, nature, and scenic outdoor environments', 'lucide:trees', 2, true),

  -- 2. Genders [male, female]
  ('gender_female', 'gender', 'female', 'Female', 'మహిళలు', 'Women fashion models and feminine presentation', 'lucide:user', 1, true),
  ('gender_male', 'gender', 'male', 'Male', 'పురుషులు', 'Men fashion models and masculine presentation', 'lucide:user', 2, true),

  -- 3. Garment Categories [top_wear, bottom_wear, full_wear]
  ('garment_top_wear', 'garment_category', 'top_wear', 'Top Wear', 'పై దుస్తులు', 'T-shirts, shirts, crop tops, blouses, blazers, and hoodies', 'lucide:shirt', 1, true),
  ('garment_bottom_wear', 'garment_category', 'bottom_wear', 'Bottom Wear', 'కింది దుస్తులు', 'Jeans, trousers, formal pants, and skirts', 'lucide:scissors', 2, true),
  ('garment_full_wear', 'garment_category', 'full_wear', 'Full Wear', 'పూర్తి దుస్తులు', 'Sarees, kurtas, suits, lehengas, gowns, sherwanis, and dhotis', 'lucide:sparkles', 3, true),

  -- 4. Jewelry Categories [neck_wear, ear_wear, wrist_wear, etc.]
  ('jewelry_neck_wear', 'jewelry_category', 'neck_wear', 'Neckwear', 'నెక్ వేర్', 'Necklaces, chains, chokers, and pendants', 'lucide:gem', 1, true),
  ('jewelry_ear_wear', 'jewelry_category', 'ear_wear', 'Earwear', 'చెవి కమ్మలు', 'Earrings, studs, jhumkas, and ear drops', 'lucide:circle', 2, true),
  ('jewelry_wrist_wear', 'jewelry_category', 'wrist_wear', 'Wristwear & Bangles', 'రిస్ట్ వేర్ & గాజులు', 'Bracelets, watches, bangles, kadas, and cufflinks', 'lucide:watch', 3, true),
  ('jewelry_hip_wear', 'jewelry_category', 'hip_wear', 'Hip & Waist Jewellery', 'వడ్డాణం & మొలతాడు', 'Waistbands, kamarbandhs, and hip chains', 'lucide:sparkles', 4, true),
  ('jewelry_nose_wear', 'jewelry_category', 'nose_wear', 'Nose Jewellery (Nath)', 'ముక్కు పుడక & నత్తు', 'Nose rings, nose pins, and bridal naths', 'lucide:sparkles', 5, true),
  ('jewelry_leg_wear', 'jewelry_category', 'leg_wear', 'Leg Jewellery (Anklets)', 'పట్టీలు & మెట్టెలు', 'Anklets, payals, and toe rings', 'lucide:sparkles', 6, true),
  ('jewelry_forehead_wear', 'jewelry_category', 'forehead_wear', 'Forehead & Head Jewellery', 'పాపిడి బిళ్ళ & మాటీలు', 'Maang tikkas, matha pattis, and headbands', 'lucide:crown', 7, true)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  code = EXCLUDED.code,
  name_en = EXCLUDED.name_en,
  name_te = EXCLUDED.name_te,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active,
  updated_at = now();
