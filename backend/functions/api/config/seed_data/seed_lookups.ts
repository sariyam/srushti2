/**
 * Seed data for system lookups:
 * 1. Background types: [indoor, outdoor]
 * 2. Genders: [male, female, unisex, all]
 * (Wear types are detached to wear_types table via seed_wear_types.ts)
 */

export interface SeedLookup {
  id: string;
  type: "background_type" | "gender";
  code: string;
  nameEn: string;
  nameTe: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export const SEED_LOOKUPS: SeedLookup[] = [
  // 1. Background Types [indoor, outdoor]
  {
    id: "bg_indoor",
    type: "background_type",
    code: "indoor",
    nameEn: "Indoor",
    nameTe: "ఇండోర్",
    description: "Studio lighting, luxury rooms, showroom setups, and ambient interior decors",
    icon: "lucide:home",
    displayOrder: 1,
    isActive: true,
    metadata: {
      tags: ["studio", "lighting", "interior", "luxury"],
    },
  },
  {
    id: "bg_outdoor",
    type: "background_type",
    code: "outdoor",
    nameEn: "Outdoor",
    nameTe: "అవుట్‌డోర్",
    description: "Indian heritage courtyards, architecture, gardens, nature, and scenic outdoor environments",
    icon: "lucide:trees",
    displayOrder: 2,
    isActive: true,
    metadata: {
      tags: ["courtyard", "heritage", "nature", "scenic"],
    },
  },

  // 2. Genders [female, male, unisex, all]
  {
    id: "gender_female",
    type: "gender",
    code: "female",
    nameEn: "Female",
    nameTe: "మహిళలు",
    description: "Women fashion models and feminine presentation",
    icon: "lucide:user",
    displayOrder: 1,
    isActive: true,
    metadata: {
      defaultWorkspace: "garment",
    },
  },
  {
    id: "gender_male",
    type: "gender",
    code: "male",
    nameEn: "Male",
    nameTe: "పురుషులు",
    description: "Men fashion models and masculine presentation",
    icon: "lucide:user",
    displayOrder: 2,
    isActive: true,
    metadata: {
      defaultWorkspace: "garment",
    },
  },
  {
    id: "gender_unisex",
    type: "gender",
    code: "unisex",
    nameEn: "Unisex",
    nameTe: "యూనిసెక్స్",
    description: "Gender-neutral garments and versatile options",
    icon: "lucide:users",
    displayOrder: 3,
    isActive: true,
    metadata: {
      defaultWorkspace: "garment",
    },
  },
  {
    id: "gender_all",
    type: "gender",
    code: "all",
    nameEn: "All Collections",
    nameTe: "అన్ని కలెక్షన్లు",
    description: "Universal options across all categories",
    icon: "lucide:asterisk",
    displayOrder: 4,
    isActive: true,
    metadata: {
      defaultWorkspace: "all",
    },
  },
];
