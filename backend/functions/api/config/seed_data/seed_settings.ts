/**
 * Seed data for all system settings, option mappings, mockups, hero slides, and translations
 * Completely decoupled and self-contained within backend Supabase functions
 */

import seedSettingsJson from "./seed_settings.json";

export interface SeedSetting {
  key: string;
  category: "ai" | "pricing" | "fidelity" | "security" | "general";
  value: any;
  description: string;
}

export const SEED_SETTINGS: SeedSetting[] = seedSettingsJson as SeedSetting[];
