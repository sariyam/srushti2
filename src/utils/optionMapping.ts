/**
 * Option Mapping and Relationships Configuration for Srushti AI
 * This serves as the single source of truth for allowed option combinations
 * and relationships across the Garment and Jewelry workspaces.
 */

// Categorization of garments
export const GARMENT_CATEGORY_MAPPING = {
  full_wear: ["saree", "kurta", "suit", "salwar", "western_wear", "lehenga", "gown", "sherwani", "dhoti", "tracksuit"],
  top_wear: ["tshirt", "shirt", "crop_top", "blouse", "blazer", "hoodie"],
  bottom_wear: ["jeans", "skirt"]
} as const;

// Categorization of jewelry
export const JEWELRY_CATEGORY_MAPPING = {
  neck_ear: ["necklace", "chain", "choker", "pendant"],
  ear_wear: ["earrings"],
  wrist_ring: ["bracelet", "watch", "bangles", "kada", "cufflinks"],
  hip: ["waistband", "hip_chain", "kamarbandh"],
  nose: ["nose_ring", "nose_pin", "nath", "nose", "noise"],
  finger: [],
  leg: ["anklet", "payal", "toe_ring", "toe"],
  forehead: ["maang_tikka", "matha_patti", "borla", "passa", "headband"],
  accessories: []
} as const;

export function getGarmentCategoryLabel(type: string): string {
  if ((GARMENT_CATEGORY_MAPPING.full_wear as readonly string[]).includes(type)) return "Full wear";
  if ((GARMENT_CATEGORY_MAPPING.top_wear as readonly string[]).includes(type)) return "Top wear";
  if ((GARMENT_CATEGORY_MAPPING.bottom_wear as readonly string[]).includes(type)) return "Bottom wear";
  return "Garment";
}

export function getJewelryCategoryLabel(type: string): string {
  if ((JEWELRY_CATEGORY_MAPPING.neck_ear as readonly string[]).includes(type)) return "Neckwear";
  if ((JEWELRY_CATEGORY_MAPPING.ear_wear as readonly string[]).includes(type)) return "Earwear";
  if ((JEWELRY_CATEGORY_MAPPING.wrist_ring as readonly string[]).includes(type)) return "Wristwear & Bangles";
  if ((JEWELRY_CATEGORY_MAPPING.hip as readonly string[]).includes(type)) return "Hip & Waist Jewellery";
  if ((JEWELRY_CATEGORY_MAPPING.nose as readonly string[]).includes(type)) return "Nose Jewellery (Nath)";
  if ((JEWELRY_CATEGORY_MAPPING.finger as readonly string[]).includes(type)) return "Finger Rings";
  if ((JEWELRY_CATEGORY_MAPPING.leg as readonly string[]).includes(type)) return "Leg Jewellery (Anklets & Toe Rings)";
  if ((JEWELRY_CATEGORY_MAPPING.forehead as readonly string[]).includes(type)) return "Forehead & Head Jewellery";
  if ((JEWELRY_CATEGORY_MAPPING.accessories as readonly string[]).includes(type)) return "Other Accessories";
  return "Jewelry";
}

// 1. Gender-specific Garment style selections
export const GENDER_GARMENT_MAPPING = {
  female: [
    "saree",
    "kurta",
    "suit",
    "salwar",
    "western_wear",
    "tshirt",
    "jeans",
    "lehenga",
    "gown",
    "skirt",
    "crop_top",
    "blouse"
  ] as const,
  male: [
    "shirt",
    "kurta",
    "suit",
    "western_wear",
    "tshirt",
    "jeans",
    "sherwani",
    "dhoti",
    "blazer",
    "tracksuit",
    "hoodie"
  ] as const
};

// 2. Gender-specific Jewelry style selections
export const GENDER_JEWELRY_MAPPING = {
  female: [
    "necklace",
    "earrings",
    "chain",
    "choker",
    "pendant",
    "bracelet",
    "watch",
    "bangles",
    "kada",
    "cufflinks",
    "waistband",
    "hip_chain",
    "kamarbandh",
    "nose_ring",
    "nose_pin",
    "nath",
    "nose",
    "noise",
    "anklet",
    "payal",
    "toe_ring",
    "toe",
    "maang_tikka",
    "matha_patti",
    "borla",
    "passa",
    "headband"
  ] as const,
  male: [
    "chain",
    "earrings",
    "pendant",
    "bracelet",
    "watch",
    "anklet",
    "payal",
    "toe_ring",
    "toe",
    "cufflinks",
    "kada",
    "waistband",
    "hip_chain",
    "kamarbandh",
    "nose_ring",
    "nose_pin",
    "nath",
    "nose",
    "noise"
  ] as const
};

// 3. Jewelry item type to valid display mount (Bust region) mappings
// This guarantees contextually relevant display options (e.g. Earrings on head, Necklace on neck)
export const JEWELRY_BUST_MAPPING: Record<string, readonly string[]> = {
  earrings: ["head", "ear", "naturally"] as const,
  necklace: ["neck", "naturally"] as const,
  chain: ["neck", "naturally"] as const,
  ring: ["finger", "hand", "naturally"] as const,
  finger_ring: ["finger", "hand", "naturally"] as const,
  thumb_ring: ["finger", "hand", "naturally"] as const,
  solitaire: ["finger", "hand", "naturally"] as const,
  bracelet: ["wrist", "hand", "naturally"] as const,
  watch: ["wrist", "naturally"] as const,
  anklet: ["ankle", "naturally"] as const,
  payal: ["ankle", "naturally"] as const,
  toe_ring: ["ankle", "naturally"] as const,
  toe: ["ankle", "naturally"] as const,
  nose_ring: ["head", "naturally"] as const,
  nose_pin: ["head", "naturally"] as const,
  nath: ["head", "naturally"] as const,
  nose: ["head", "naturally"] as const,
  noise: ["head", "naturally"] as const,
  waistband: ["wrist", "naturally"] as const,
  hip_chain: ["wrist", "naturally"] as const,
  kamarbandh: ["wrist", "naturally"] as const,
  bangles: ["wrist", "naturally"] as const,
  choker: ["neck", "naturally"] as const,
  cufflinks: ["wrist", "naturally"] as const,
  pendant: ["neck", "naturally"] as const,
  kada: ["wrist", "naturally"] as const,
  maang_tikka: ["head", "naturally"] as const,
  matha_patti: ["head", "naturally"] as const,
  borla: ["head", "naturally"] as const,
  passa: ["head", "naturally"] as const,
  headband: ["head", "naturally"] as const
};

// 4. Garment Type to allowed presentation modes mapping
export const GARMENT_PRESENTATION_MAPPING = {
  saree: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  tshirt: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  jeans: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  shirt: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  western_wear: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  kurta: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  suit: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  salwar: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  lehenga: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  gown: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  skirt: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  crop_top: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  blouse: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  sherwani: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  dhoti: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  blazer: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  tracksuit: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const,
  hoodie: ["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const
};

// 5. Allowed background categories per workspace
export const BACKGROUND_STYLES = {
  garment: ["plain", "studio", "traditional", "festival", "luxury", "royal", "urban", "vintage", "modern_office"] as const,
  jewelry: ["plain", "studio", "luxury", "festival", "traditional", "wood", "beach", "velvet", "silk", "granite", "mirror"] as const
};

// 6. Allowed model poses/angles per item type
export const GARMENT_POSES_BY_CATEGORY = {
  full_wear: [
    "standing_front",
    "standing_side",
    "standing_three_quarter",
    "walking_candid",
    "sitting_chair",
    "sitting_casual"
  ],
  top_wear: [
    "top_upper_portrait",
    "top_standing_mid",
    "top_three_quarter",
    "top_shoulder_profile",
    "top_casual_cross",
    "top_front_direct"
  ],
  bottom_wear: [
    "bottom_full_leg",
    "bottom_walking_step",
    "bottom_side_leg",
    "bottom_seated_cross",
    "bottom_3q_lower",
    "bottom_front_stance"
  ],
  partial_face_full: [
    "partial_face_chin_torso",
    "partial_face_shoulder_profile",
    "partial_face_lips_mid",
    "partial_face_back_shoulder"
  ],
  partial_face_top: [
    "partial_face_top_collar_crop",
    "partial_face_top_jawline_chest",
    "partial_face_top_side_profile",
    "partial_face_top_mid_torso"
  ],
  partial_face_bottom: [
    "partial_face_bottom_waist_chest",
    "partial_face_bottom_hip_stride",
    "partial_face_bottom_seated_lap",
    "partial_face_bottom_side_profile"
  ],
  no_face_full: [
    "no_face_full_body_crop",
    "no_face_torso_hips_drape",
    "no_face_walking_stride",
    "no_face_seated_outfit"
  ],
  no_face_top: [
    "no_face_top_chest_shoulders",
    "no_face_top_front_fit",
    "no_face_top_side_sleeve",
    "no_face_top_back_detail"
  ],
  no_face_bottom: [
    "no_face_bottom_waist_to_toe",
    "no_face_bottom_side_seam",
    "no_face_bottom_walking_stride",
    "no_face_bottom_seated_trouser"
  ]
} as const;

export const JEWELRY_POSES_BY_CATEGORY = {
  partial_face_neck: [
    "partial_face_lips_collarbone",
    "partial_face_chin_neck_drape",
    "partial_face_jawline_decollete",
    "partial_face_neck_side_throat"
  ],
  partial_face_ear: [
    "partial_face_cheek_ear_close",
    "partial_face_jawline_macro",
    "partial_face_ear_neck_profile",
    "partial_face_hairline_ear_crop"
  ],
  partial_face_nose: [
    "partial_face_nose_lips_profile",
    "partial_face_nostril_cheek_macro",
    "partial_face_lips_nose_front"
  ],
  partial_face_forehead: [
    "partial_face_forehead_brows_crop",
    "partial_face_hairline_temple_macro",
    "partial_face_upper_bridge_forehead"
  ],
  partial_skin_wrist: [
    "partial_skin_wrist_pulse_macro",
    "partial_skin_forearm_wrist_drape",
    "partial_skin_hand_wrist_profile"
  ],
  partial_skin_finger: [
    "partial_skin_finger_knuckle_macro",
    "partial_skin_hand_resting_skin",
    "partial_skin_interlocked_fingers"
  ],
  partial_skin_hip: [
    "partial_skin_waist_hip_curve_macro",
    "partial_skin_navel_hip_drape",
    "partial_skin_lower_waist_profile"
  ],
  partial_skin_leg: [
    "partial_skin_ankle_foot_macro",
    "partial_skin_toes_instep_close",
    "partial_skin_heel_anklet_profile"
  ],
  partial_skin_accessories: [
    "partial_skin_chest_lapel_macro",
    "partial_skin_wrist_cuff_close"
  ],
  no_face_neck: [
    "no_face_neck_collarbone_drape",
    "no_face_decollete_torso",
    "no_face_throat_collarbone_macro"
  ],
  no_face_ear: [
    "no_face_side_neck_ear_macro",
    "no_face_ear_nape_profile",
    "no_face_shoulder_ear_line"
  ],
  no_face_wrist: [
    "no_face_wrist_hand_waist",
    "no_face_forearm_cross_body",
    "no_face_hand_lap_drape"
  ],
  no_face_finger: [
    "no_face_finger_touching_hip",
    "no_face_interlocked_hands_chest",
    "no_face_finger_ring_lap"
  ],
  no_face_hip: [
    "no_face_waist_midriff_front",
    "no_face_hip_curve_side",
    "no_face_back_waist_drape"
  ],
  no_face_leg: [
    "no_face_anklet_stepping",
    "no_face_seated_feet_drape",
    "no_face_toe_ring_step"
  ],
  no_face_nose: [
    "no_face_side_nostril_neck",
    "no_face_chin_lips_nose"
  ],
  no_face_forehead: [
    "no_face_forehead_hairline_only",
    "no_face_top_crown_hair"
  ],
  no_face_accessories: [
    "no_face_chest_shoulder_accessory",
    "no_face_arm_wrist_cuff"
  ],
  partial_face: [
    "partial_face_jawline_macro",
    "partial_face_lips_collarbone",
    "partial_face_cheek_ear_close",
    "partial_face_nose_lips_profile",
    "partial_face_chin_neck_drape",
    "partial_face_forehead_brows_crop"
  ],
  neck_ear: [
    "neck_collarbone",
    "neck_chest_portrait",
    "neck_3q_shoulder",
    "neck_royal_gaze",
    "neck_front_direct",
    "neck_side_drape"
  ],
  ear_wear: [
    "side_ear_profile",
    "ear_hair_tuck",
    "ear_head_tilt",
    "ear_3q_face",
    "ear_front_balanced",
    "ear_over_shoulder"
  ],
  wrist_ring: [
    "wrist_hand_display",
    "wrist_resting_lap",
    "wrist_cross_arms",
    "wrist_hand_chest",
    "wrist_side_arm",
    "wrist_gesture"
  ],
  hip: [
    "hip_waist_mid",
    "hip_hands_on_waist",
    "hip_royal_standing",
    "hip_side_turn",
    "hip_saree_drape",
    "hip_front_direct"
  ],
  nose: [
    "nose_close_profile",
    "nose_front_portrait",
    "nose_3q_headturn",
    "nose_bridal_veil",
    "nose_soft_smile",
    "nose_macro_focus"
  ],
  finger: [
    "finger_hand_gesture",
    "finger_chin_rest",
    "finger_hands_clasped",
    "finger_holding_prop",
    "finger_macro_ring",
    "finger_side_hand"
  ],
  leg: [
    "anklet_floor_cross_legged",
    "anklet_floor_legs_extended",
    "anklet_floor_kneeling_mehendi"
  ],
  forehead: [
    "forehead_tikka_center",
    "forehead_mathapatti_frame",
    "forehead_3q_headturn",
    "forehead_bridal_veil",
    "forehead_side_passa",
    "forehead_front_portrait"
  ],
  accessories: [
    "acc_forehead_tikka",
    "acc_front_direct",
    "acc_3q_gaze",
    "acc_side_profile"
  ]
} as const;

export function getGarmentPoses(garmentType: string, presentationMode?: string): readonly string[] {
  if (presentationMode === "no_face") {
    if ((GARMENT_CATEGORY_MAPPING.top_wear as readonly string[]).includes(garmentType)) {
      return GARMENT_POSES_BY_CATEGORY.no_face_top;
    }
    if ((GARMENT_CATEGORY_MAPPING.bottom_wear as readonly string[]).includes(garmentType)) {
      return GARMENT_POSES_BY_CATEGORY.no_face_bottom;
    }
    return GARMENT_POSES_BY_CATEGORY.no_face_full;
  }
  if (presentationMode === "partial_face") {
    if ((GARMENT_CATEGORY_MAPPING.top_wear as readonly string[]).includes(garmentType)) {
      return GARMENT_POSES_BY_CATEGORY.partial_face_top;
    }
    if ((GARMENT_CATEGORY_MAPPING.bottom_wear as readonly string[]).includes(garmentType)) {
      return GARMENT_POSES_BY_CATEGORY.partial_face_bottom;
    }
    return GARMENT_POSES_BY_CATEGORY.partial_face_full;
  }
  if ((GARMENT_CATEGORY_MAPPING.top_wear as readonly string[]).includes(garmentType)) {
    return GARMENT_POSES_BY_CATEGORY.top_wear;
  }
  if ((GARMENT_CATEGORY_MAPPING.bottom_wear as readonly string[]).includes(garmentType)) {
    return GARMENT_POSES_BY_CATEGORY.bottom_wear;
  }
  return GARMENT_POSES_BY_CATEGORY.full_wear;
}

export function getJewelryPoses(jewelryType: string, presentationMode?: string): readonly string[] {
  if (presentationMode === "no_face" || presentationMode === "body_part") {
    if ((JEWELRY_CATEGORY_MAPPING.ear_wear as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_ear;
    }
    if ((JEWELRY_CATEGORY_MAPPING.wrist_ring as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_wrist;
    }
    if ((JEWELRY_CATEGORY_MAPPING.hip as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_hip;
    }
    if ((JEWELRY_CATEGORY_MAPPING.nose as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_nose;
    }
    if ((JEWELRY_CATEGORY_MAPPING.finger as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_finger;
    }
    if ((JEWELRY_CATEGORY_MAPPING.leg as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_leg;
    }
    if ((JEWELRY_CATEGORY_MAPPING.forehead as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_forehead;
    }
    if ((JEWELRY_CATEGORY_MAPPING.accessories as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.no_face_accessories;
    }
    return JEWELRY_POSES_BY_CATEGORY.no_face_neck;
  }
  if (presentationMode === "partial_face") {
    if ((JEWELRY_CATEGORY_MAPPING.ear_wear as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_face_ear;
    }
    if ((JEWELRY_CATEGORY_MAPPING.wrist_ring as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_skin_wrist;
    }
    if ((JEWELRY_CATEGORY_MAPPING.hip as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_skin_hip;
    }
    if ((JEWELRY_CATEGORY_MAPPING.nose as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_face_nose;
    }
    if ((JEWELRY_CATEGORY_MAPPING.finger as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_skin_finger;
    }
    if ((JEWELRY_CATEGORY_MAPPING.leg as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_skin_leg;
    }
    if ((JEWELRY_CATEGORY_MAPPING.forehead as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_face_forehead;
    }
    if ((JEWELRY_CATEGORY_MAPPING.accessories as readonly string[]).includes(jewelryType)) {
      return JEWELRY_POSES_BY_CATEGORY.partial_skin_accessories;
    }
    return JEWELRY_POSES_BY_CATEGORY.partial_face_neck;
  }
  if ((JEWELRY_CATEGORY_MAPPING.ear_wear as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.ear_wear;
  }
  if ((JEWELRY_CATEGORY_MAPPING.wrist_ring as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.wrist_ring;
  }
  if ((JEWELRY_CATEGORY_MAPPING.hip as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.hip;
  }
  if ((JEWELRY_CATEGORY_MAPPING.nose as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.nose;
  }
  if ((JEWELRY_CATEGORY_MAPPING.finger as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.finger;
  }
  if ((JEWELRY_CATEGORY_MAPPING.leg as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.leg;
  }
  if ((JEWELRY_CATEGORY_MAPPING.forehead as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.forehead;
  }
  if ((JEWELRY_CATEGORY_MAPPING.accessories as readonly string[]).includes(jewelryType)) {
    return JEWELRY_POSES_BY_CATEGORY.accessories;
  }
  return JEWELRY_POSES_BY_CATEGORY.neck_ear;
}

// Legacy array for compatibility
export const JEWELRY_MODEL_POSES = [
  "neck_collarbone",
  "side_ear_profile",
  "hand_face_gesture",
  "three_quarter_gaze",
  "wrist_hand_display",
  "front_direct_portrait"
] as const;

// 6. Validation and auto-correction utilities to prevent inconsistent states
export const OptionValidator = {
  /**
   * Get valid jewelry bust region based on selected jewelry type.
   * If current region is invalid, returns the first valid region.
   */
  getValidJewelryBustRegion(
    type: keyof typeof JEWELRY_BUST_MAPPING,
    currentRegion: string
  ): "head" | "neck" | "wrist" | "ankle" | "finger" | "hand" | "naturally" | "ear" {
    const allowed = JEWELRY_BUST_MAPPING[type] || ["head", "neck", "wrist", "ankle", "finger", "hand", "naturally", "ear"];
    if ((allowed as readonly string[]).includes(currentRegion)) {
      return currentRegion as "head" | "neck" | "wrist" | "ankle" | "finger" | "hand" | "naturally" | "ear";
    }
    return allowed[0] as "head" | "neck" | "wrist" | "ankle" | "finger" | "hand" | "naturally" | "ear";
  },

  /**
   * Check if a garment type is valid for the chosen gender.
   * If not, returns a valid fallback type.
   */
  getValidGarmentType(
    gender: "female" | "male",
    currentType: string
  ): string {
    const allowed = GENDER_GARMENT_MAPPING[gender];
    if ((allowed as readonly string[]).includes(currentType)) {
      return currentType;
    }
    return allowed[0];
  },

  /**
   * Check if a jewelry type is valid for the chosen gender.
   * If not, returns a valid fallback type.
   */
  getValidJewelryType(
    gender: "female" | "male",
    currentType: string
  ): string {
    const allowed = GENDER_JEWELRY_MAPPING[gender];
    if ((allowed as readonly string[]).includes(currentType)) {
      return currentType;
    }
    return allowed[0];
  }
};
