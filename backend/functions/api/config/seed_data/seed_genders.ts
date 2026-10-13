/**
 * Srushti AI — Genders Lookup Seed Data
 * Enumerations for model & catalog target genders:
 * - female
 * - male
 * - unisex
 * - all
 */

export interface SeedGenderRecord {
  id: "female" | "male" | "unisex" | "all" | string;
  code: string;
  nameEn: string;
  nameTe: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export const SEED_GENDERS: SeedGenderRecord[] = [
  {
    id: "female",
    code: "female",
    nameEn: "Female",
    nameTe: "మహిళలు",
    description: "Women fashion models, garments, jewelry, and feminine presentation",
    icon: "lucide:user",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "male",
    code: "male",
    nameEn: "Male",
    nameTe: "పురుషులు",
    description: "Men fashion models, garments, jewelry, and masculine presentation",
    icon: "lucide:user-check",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "unisex",
    code: "unisex",
    nameEn: "Unisex",
    nameTe: "యూనిసెక్స్",
    description: "Gender-neutral fashion garments, jewelry, and versatile items",
    icon: "lucide:users",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "all",
    code: "all",
    nameEn: "All Collections",
    nameTe: "అన్ని కలెక్షన్లు",
    description: "Universal vertical and presentation modes for all audiences",
    icon: "lucide:asterisk",
    displayOrder: 4,
    isActive: true,
  },
];
