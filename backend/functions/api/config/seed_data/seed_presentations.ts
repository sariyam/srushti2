/**
 * Seed data for all Garment and Jewelry Presentation Modes
 * Enforcing Face Visibility Rules:
 * - 'full_face': Live Human Model (shows Model Face selector)
 * - 'partial_face': Human Model Partial Face (shows Model Face selector)
 * - 'no_face': Headless / Non-human / Mounts / Flat Lay (hides Model Face selector)
 */

export interface SeedPresentation {
  id: string;
  type: "presentation";
  workspace: "garment" | "jewelry" | "all";
  nameEn: string;
  nameTe: string;
  promptDirective: string;
  faceVisibilityRule?: "full_face" | "partial_face" | "no_face" | null;
  metadata?: Record<string, any>;
  displayOrder: number;
  isActive: boolean;
}

export const SEED_PRESENTATIONS: SeedPresentation[] = [
  // --- Common & Garment Presentations ---
  {
    id: "model",
    type: "presentation",
    workspace: "all",
    nameEn: "Live Human Model",
    nameTe: "మనిషి మోడల్",
    promptDirective: "worn gracefully by a professional fashion model with authentic natural posture and realistic fabric drape",
    faceVisibilityRule: "full_face",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "partial_face",
    type: "presentation",
    workspace: "all",
    nameEn: "Human Model (Partial Face)",
    nameTe: "మానవ మోడల్ (పాక్షిక ముఖం)",
    promptDirective: "worn on authentic human skin with a human skin partial face macro close-up framing, showing clean skin texture, natural pores, and soft studio lighting while cropping full facial identity",
    faceVisibilityRule: "partial_face",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "no_face",
    type: "presentation",
    workspace: "all",
    nameEn: "Human Model (No Face / Headless)",
    nameTe: "మానవ మోడల్ (ముఖం లేకుండా)",
    promptDirective: "worn on an authentic live human model skin backdrop, with primary macro camera focus and razor-sharp depth-of-field centered strictly on product details, while the human face is strictly cropped out of frame, turned away, or headless (showing NO human eyes, nose, lips, or face)",
    faceVisibilityRule: "no_face",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "body_part",
    type: "presentation",
    workspace: "jewelry",
    nameEn: "Body Part Close-Up",
    nameTe: "శరీర భాగం (క్లోజప్ షాట్)",
    promptDirective: "macro close-up shot focused on the jewelry item placed cleanly and naturally on a real human body part (such as neck, ear, wrist, finger, waist, nose, or ankle depending on item type) with smooth authentic skin texture and natural pores. This mode strictly uses NO face reference and does NOT generate any face identity, head, eyes, nose, or lips",
    faceVisibilityRule: "no_face",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "mannequin",
    type: "presentation",
    workspace: "garment",
    nameEn: "Realistic Studio Mannequin",
    nameTe: "బొమ్మ (మెనకిన్)",
    promptDirective: "displayed on a modern high-end realistic studio showroom clothing mannequin without human skin",
    faceVisibilityRule: "no_face",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "hanger",
    type: "presentation",
    workspace: "garment",
    nameEn: "Boutique Hanger Display",
    nameTe: "హ్యాంగర్ స్టాండ్",
    promptDirective: "hanging neatly on a minimalist wooden hanger in a beautiful high-end boutique wardrobe",
    faceVisibilityRule: "no_face",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "ghost",
    type: "presentation",
    workspace: "garment",
    nameEn: "3D Ghost Mannequin",
    nameTe: "అదృశ్య బొమ్మ",
    promptDirective: "photographed in flat lay ghost mannequin style, 3D hollow garment fit showing inner lining",
    faceVisibilityRule: "no_face",
    displayOrder: 7,
    isActive: true,
  },
  {
    id: "flat_lay",
    type: "presentation",
    workspace: "garment",
    nameEn: "Studio Flat Lay",
    nameTe: "ఫ్లాట్ లే డిజైన్",
    promptDirective: "perfectly arranged in a professional fashion flat-lay style on a clean neutral studio board",
    faceVisibilityRule: "no_face",
    displayOrder: 8,
    isActive: true,
  },
  {
    id: "folded",
    type: "presentation",
    workspace: "garment",
    nameEn: "Retail Folded Display",
    nameTe: "మడతపెట్టిన ప్రదర్శన",
    promptDirective: "folded immaculately in a clean neat square shape in high-end luxury retail boutique style on a flat surface, with the main signature feature, pallu, collar, chest embroidery, or primary decorative motif prominently visible on top facing directly up towards the camera",
    faceVisibilityRule: "no_face",
    displayOrder: 9,
    isActive: true,
  },
  {
    id: "shelf",
    type: "presentation",
    workspace: "garment",
    nameEn: "Boutique Retail Shelf",
    nameTe: "రిటైల్ షెల్ఫ్",
    promptDirective: "placed beautifully on a minimalist floating boutique retail shelf, warm soft spot lighting",
    faceVisibilityRule: "no_face",
    displayOrder: 10,
    isActive: true,
  },
  {
    id: "shopwindow",
    type: "presentation",
    workspace: "garment",
    nameEn: "Showroom Window Display",
    nameTe: "షాప్ విండో",
    promptDirective: "featured in a premium luxury high-street showroom window display glass showcase box",
    faceVisibilityRule: "no_face",
    displayOrder: 11,
    isActive: true,
  },

  // --- Jewelry Bust / Non-Human Presentation Mounts ---
  {
    id: "bust",
    type: "presentation",
    workspace: "jewelry",
    nameEn: "Jewelry Display Stand / Bust",
    nameTe: "ఆభరణాల స్టాండ్",
    promptDirective: "mounted elegantly on a specialized luxury non-human jewelry display stand mount, neck bust, cushion, or porcelain sculpture",
    faceVisibilityRule: "no_face",
    metadata: {
      subMounts: ["head", "neck", "wrist", "ankle", "finger", "hand", "naturally", "ear"]
    },
    displayOrder: 12,
    isActive: true,
  }
];
