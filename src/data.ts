import { PROMPT_FRAGMENTS } from "./types";
import { getGarmentCategoryLabel, getJewelryCategoryLabel } from "./utils/optionMapping";
import type { StudioConfigResponse } from "./utils/api";


// Colors for plain background choice
export const PRESET_COLORS = [
  { name: "Cream White", hex: "#fdfbf7" },
  { name: "Soft Charcoal", hex: "#2b2b2b" },
  { name: "Sage Green", hex: "#d1d9cf" },
  { name: "Royal Gold", hex: "#f0dfbd" },
  { name: "Powder Blue", hex: "#d5e2eb" },
  { name: "Blush Pink", hex: "#f2e1e4" },
  { name: "Terracotta", hex: "#dfc0b5" }
];

export function getColorHexByName(name: string): string {
  const found = PRESET_COLORS.find(c => c.name.toLowerCase() === name.toLowerCase());
  return found ? found.hex : name;
}

export function getPoseFaceVisibilityRule(poseKey: string, category: "garment" | "jewelry"): {
  visibility: "FULL_FACE_SHOWN" | "PARTIALLY_SHOWN_FACE" | "CROPPED_LOWER_BODY";
  description: string;
} {
  if (poseKey.startsWith("no_face_")) {
    return {
      visibility: "CROPPED_LOWER_BODY",
      description: "NO FACE SHOWN: Primary macro camera focus on garment item texture, fabric drape, and fit with human face strictly cropped out, turned away, or headless (showing NO human eyes, nose, lips, or facial features)."
    };
  }

  const fullFacePoses = new Set([
    // Garment Poses
    "standing_front", "standing_side", "standing_three_quarter", "walking_candid",
    "sitting_chair", "sitting_casual", "top_upper_portrait", "top_standing_mid",
    "top_three_quarter", "top_shoulder_profile", "top_casual_cross", "top_front_direct",
    // Jewelry Poses
    "neck_chest_portrait", "neck_3q_shoulder", "neck_royal_gaze", "neck_front_direct",
    "ear_head_tilt", "ear_3q_face", "ear_front_balanced", "wrist_cross_arms",
    "wrist_hand_chest", "hip_royal_standing", "hip_hands_on_waist", "hip_saree_drape",
    "nose_front_portrait", "nose_3q_headturn", "nose_soft_smile", "finger_chin_rest",
    "finger_hands_clasped", "forehead_tikka_center", "forehead_mathapatti_frame",
    "forehead_3q_headturn", "forehead_front_portrait", "acc_forehead_tikka",
    "acc_front_direct", "acc_3q_gaze", "hand_face_gesture", "three_quarter_gaze",
    "front_direct_portrait"
  ]);

  const feetOrAnkletPoses = new Set([
    "anklet_floor_cross_legged", "anklet_floor_legs_extended", "anklet_floor_kneeling_mehendi",
    "anklet_ankle_close", "anklet_step_forward", "anklet_seated_foot",
    "anklet_side_foot", "anklet_both_feet", "anklet_toering_focus"
  ]);

  if (feetOrAnkletPoses.has(poseKey)) {
    return {
      visibility: "CROPPED_LOWER_BODY",
      description: "PARTIALLY SHOWN / LOWER BODY CROP: Focus is strictly on lower leg, ankle, and feet. Human model face is cropped out of frame or not visible in lower body focus."
    };
  }

  if (fullFacePoses.has(poseKey)) {
    return {
      visibility: "FULL_FACE_SHOWN",
      description: "FULL FACE SHOWN: Human model face is fully visible in frame with complete facial features, clear expression, and full head framing according to selected pose perspective."
    };
  }

  return {
    visibility: "PARTIALLY_SHOWN_FACE",
    description: "PARTIALLY SHOWN FACE: Human model face is partially shown (e.g., cropped cleanly near chin/lips, side profile angle, veiled frame, or softly blurred/background focus) to prioritize product placement and close-up detail."
  };
}

export function getCameraFramingAndAngle(poseKey: string, itemType: string, category: "garment" | "jewelry"): string {
  const framingMap: Record<string, string> = {
    // Garment - Full Wear
    standing_front: "Full-length catalog shot, direct frontal camera framing capturing head to toe (face fully shown in clean catalog alignment)",
    standing_side: "Full-body three-quarter side profile angle showcasing side silhouette and outfit fall (face fully shown in 3/4 side profile view)",
    standing_three_quarter: "Three-quarter camera perspective balancing full outfit drape and model posture (face fully shown in studio gaze)",
    walking_candid: "Dynamic full-body street-style candid shot with forward stride motion (face fully shown in natural movement)",
    sitting_chair: "Full-body seated studio composition framing outfit drapes on chair (face fully shown in poised sitting posture)",
    sitting_casual: "Relaxed full-length seated lounge framing showcasing fabric folds (face fully shown)",

    // Garment - Top Wear
    top_upper_portrait: "Upper torso portrait framing shoulders, collarline, chest, and face (face fully shown centered in frame)",
    top_standing_mid: "Mid-length camera framing from head down to hips, highlighting waistline and upper fit (face fully shown)",
    top_three_quarter: "Three-quarter angle upper body portrait framing chest, shoulders, and sleeve length (face fully shown in 3/4 turn)",
    top_shoulder_profile: "Side shoulder profile shot showcasing neckline cut, armholes, and back detail (face fully shown in side profile view)",
    top_casual_cross: "Frontal mid-shot framing crossed arms over chest and garment structure (face fully shown facing camera)",
    top_front_direct: "Symmetrical frontal upper-body shot highlighting chest pattern and collar geometry (face fully shown in direct symmetry)",

    // Garment - Bottom Wear
    bottom_full_leg: "Lower body shot framing waist to ankles, prioritizing pant drape and leg silhouette (face partially shown or cropped above waist depending on framing height)",
    bottom_walking_step: "Dynamic lower-body walking stride shot framing legs and hemline motion (face partially shown or cropped above waist)",
    bottom_side_leg: "Side leg profile shot highlighting waistline, side seams, and pocket detailing (face partially shown / lower body focus)",
    bottom_seated_cross: "Seated leg showcase framing crossed knees, fabric stretch, and hem finish (face partially or fully shown in relaxed seating)",
    bottom_3q_lower: "Three-quarter lower body catalog framing centered on hips and trousers (face partially shown or cropped near chest)",
    bottom_front_stance: "Wide stance lower-body shot displaying fabric fall across thighs and legs (face partially or fully shown depending on vertical crop)",

    // Jewelry - Neckwear
    neck_collarbone: "Intimate macro close-up framing upper chest, collarbone, and neck (face partially shown — cropped cleanly from chin/lower lip to chest, emphasizing necklace drape)",
    neck_chest_portrait: "High chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",
    neck_3q_shoulder: "Three-quarter shoulder turn highlighting neckwear angle and shoulder drape (face fully shown in 3/4 beauty angle)",
    neck_royal_gaze: "Regal portrait angle with model looking slightly upward, framing neckwear and facial poise (face fully shown with serene gaze)",
    neck_front_direct: "Direct frontal close-up framing symmetrical necklace and collarbone structure (face fully shown or lower face framed in direct symmetry)",
    neck_side_drape: "Side profile neck drape angle showcasing clasp, side chainwork, and jawline (face partially shown in side profile focusing on neck and jawline)",

    // Jewelry - Earwear
    side_ear_profile: "Side profile beauty camera angle focusing on earlobe, cheekbone, and jawline (face partially shown in side profile, focusing on ear and cheekbone)",
    ear_hair_tuck: "Side angle close-up with hair tucked behind ear, framing dangling earring details (face fully or partially shown in side profile angle)",
    ear_head_tilt: "Gentle head tilt angle showcasing earring drop length and sparkling reflections (face fully shown with graceful head angle)",
    ear_3q_face: "Three-quarter beauty portrait framing earring drop against cheek contour (face fully shown in 3/4 beauty gaze)",
    ear_front_balanced: "Direct frontal symmetry framing both dangling earrings equally alongside facial features (face fully shown centered in frame)",
    ear_over_shoulder: "Over-the-shoulder glance framing ear profile, jawline, and back hair drape (face partially shown in over-the-shoulder view)",

    // Jewelry - Wrist & Rings
    wrist_hand_display: "Close-up hand and wrist gesture shot, framing watch dials, bangles, or bracelets (face partially shown — softly blurred or cropped above chest, prioritizing wrist accessories)",
    wrist_resting_lap: "Lower torso camera framing with hands resting gracefully on lap showcasing wristwear (face partially shown / lower torso frame)",
    wrist_cross_arms: "Mid-shot framing crossed arms showcasing wrist accessories over apparel sleeves (face fully or partially shown in confident pose)",
    wrist_hand_chest: "Upper chest framing bringing manicured wrist and rings near neckline (face fully shown with hand touching chest)",
    wrist_side_arm: "Side arm extension close-up focusing on forearm, wrist stack, and bangles (face partially shown / focused on forearm and wrist)",
    wrist_gesture: "Mid-motion hand gesture framing wristwear against soft studio background (face fully or partially shown in background)",

    // Jewelry - Hip & Waist
    hip_waist_mid: "Midsection waist close-up framing hip chain or kamarbandh over apparel drapes (face partially shown — cropped near lower ribs or chin, prioritizing waistline)",
    hip_hands_on_waist: "Hands-on-waist three-quarter shot framing waistline ornament and hip curve (face fully or partially shown)",
    hip_royal_standing: "Tall standing posture framing full waistline and royal hip ornament (face fully shown with tall posture)",
    hip_side_turn: "Side hip curve angle accentuating waist belt drapes and side clasp (face partially or fully shown in side angle)",
    hip_saree_drape: "Traditional saree drape shot centering waistband motif against pleated silk (face fully or partially shown)",
    hip_front_direct: "Direct frontal midsection alignment highlighting symmetrical waist ornament (face partially shown / lower torso focus)",

    // Jewelry - Nose
    nose_close_profile: "Macro nostril profile camera shot highlighting delicate nath loop and pearl drop (face partially shown — close macro focus on nose, lips, and cheek)",
    nose_front_portrait: "Direct frontal beauty portrait framing nose ring and lips in high fashion symmetry (face fully shown in direct symmetry)",
    nose_3q_headturn: "Three-quarter head turn angle capturing nath chain connecting to hair (face fully shown in 3/4 turn)",
    nose_bridal_veil: "Bridal veil side angle with sheer dupatta framing nose ring, eyes, and cheek (face partially shown / softly veiled)",
    nose_soft_smile: "Subtle smile close-up accentuating nose pin shimmer near lips (face fully shown with gentle expression)",
    nose_macro_focus: "Ultra macro beauty close-up centering the nose ornament and skin texture (face partially shown — tight macro crop on nose and cheek)",

    // Jewelry - Finger
    finger_hand_gesture: "Close-up hand gesture shot displaying rings on manicured fingers (face partially shown — softly blurred or cropped above chest)",
    finger_chin_rest: "Beauty close-up with hand resting softly near chin/cheek, framing finger ring near facial features (face fully shown with hand touching chin)",
    finger_hands_clasped: "Mid-shot framing clasped hands in front of chest showcasing multiple rings (face fully or partially shown)",
    finger_holding_prop: "Close-up hand framing holding silk fabric showcasing ring facets (face partially shown / focus on hand and ring)",
    finger_macro_ring: "Ultra macro focus centering solitaire diamond ring on finger (face partially shown / macro focus on hand)",
    finger_side_hand: "Side profile hand placement highlighting ring band and setting depth (face partially shown / focus on hand profile)",

    // Jewelry - Anklet & Toe (Floor Sitting Poses)
    anklet_floor_cross_legged: "Seated cross-legged posture on smooth floor/carpet framing ankles, payal, and toe rings gracefully (lower body/feet focus)",
    anklet_floor_legs_extended: "Seated floor posture with legs extended forward, ankles and feet resting side by side highlighting payal and toe rings (lower body focus)",
    anklet_floor_kneeling_mehendi: "Kneeling posture on decorative floor/carpet, top-down angle showcasing payal bells, heel drapes, and toe ornaments (lower body focus)",
    anklet_ankle_close: "Lower leg macro close-up framing ankle, payal, and ghungroo bells (face partially shown — strictly lower leg focus, face cropped out of frame)",
    anklet_step_forward: "Dynamic forward step stride framing anklet drape on foot and heel (face partially shown — lower body/feet focus, face cropped out of frame)",
    anklet_seated_foot: "Seated foot framing with foot resting on cushion showcasing anklet links (face partially shown — feet and lower leg focus)",
    anklet_side_foot: "Side angle heel and ankle profile close-up (face partially shown — foot and ankle focus)",
    anklet_both_feet: "Camera framing both feet draped together displaying pair of payals (face partially shown — feet focus)",
    anklet_toering_focus: "Intimate toe ring and foot arch close-up (face partially shown — feet and toes focus)",

    // Jewelry - Forehead
    forehead_tikka_center: "Close-up forehead and hairline camera angle centering maang tikka or borla (face fully shown — centered on upper face, eyes, and forehead)",
    forehead_mathapatti_frame: "Frontal beauty portrait framing full forehead and hairline with matha patti (face fully shown in frontal beauty portrait)",
    forehead_3q_headturn: "Three-quarter head turn angle showcasing forehead ornament and temple detailing (face fully shown in 3/4 angle)",
    forehead_bridal_veil: "Side angle bridal portrait with sheer dupatta framing forehead ornament and eyes (face partially shown / veiled face with eyes and forehead clear)",
    forehead_side_passa: "Side profile head angle highlighting passa / jhumar draped over temple and hair (face partially shown in side profile focusing on temple and hair)",
    forehead_front_portrait: "Direct front-facing beauty portrait centering forehead jewelry, eyes, and regal poise (face fully shown in regal symmetry)",

    // Jewelry - Accessories
    acc_forehead_tikka: "Forehead ornament close-up camera framing centered on forehead and eyes (face fully shown)",
    acc_front_direct: "Direct frontal accessory beauty portrait with symmetrical framing (face fully shown)",
    acc_3q_gaze: "Three-quarter angle camera framing accessory and facial features (face fully shown)",
    acc_side_profile: "Side profile camera angle accentuating accessory placement on head or body (face partially or fully shown in side profile)",

    // Jewelry - Partial Face & Body Skin Macro Poses
    partial_face_lips_collarbone: "Macro close-up crop from lower lips down to collarbone and upper chest, showcasing human skin texture and necklace/pendant drape (eyes cropped out)",
    partial_face_chin_neck_drape: "Macro beauty framing centered on chin, neck, and collarbone, highlighting human skin sheen and neckline jewelry (upper face cropped)",
    partial_face_jawline_decollete: "Macro camera framing focusing on jawline, lower chin, collarbone, and décolletage with human skin texture (eyes cropped out)",
    partial_face_neck_side_throat: "Tight side angle closeup framing the curve of the neck, side throat, and shoulder line against smooth human skin",

    partial_face_cheek_ear_close: "Tight macro partial face profile framing cheekbone, earlobe, and jawline, displaying skin texture and earring brilliance (full head cropped)",
    partial_face_jawline_macro: "Intimate macro partial face camera angle focusing on human skin, jawline, and earlobe profile (eyes and top of head cropped out of frame)",
    partial_face_ear_neck_profile: "Macro profile shot capturing earlobe, side jawline, and neck transition on authentic human skin",
    partial_face_hairline_ear_crop: "Close-up side framing highlighting temple, hairline, and earlobe with natural skin pores and studio lighting",

    partial_face_nose_lips_profile: "Close-up partial face profile shot focusing on nose, lips, and nostril ornament against smooth human skin (eyes and forehead cropped)",
    partial_face_nostril_cheek_macro: "Intimate macro profile angle focusing on nostril, cheekbone, and lip curve on clean human skin",
    partial_face_lips_nose_front: "Lower face macro framing from nostrils down to lips and chin, displaying facial jewelry on real skin",

    partial_face_forehead_brows_crop: "Close-up partial face framing focusing on forehead, eyebrow line, and upper bridge with head ornament (chin and lower face cropped out)",
    partial_face_hairline_temple_macro: "Macro camera angle focusing on upper forehead, hairline, and temple area with authentic skin texture",
    partial_face_upper_bridge_forehead: "Macro close-up framing forehead, eyebrow ridge, and upper nose bridge with head ornament",

    partial_skin_wrist_pulse_macro: "Intimate macro camera angle focused on wrist pulse point and forearm skin texture",
    partial_skin_forearm_wrist_drape: "Close-up camera angle showcasing forearm skin and wrist joint with bracelet or bangle drape",
    partial_skin_hand_wrist_profile: "Macro profile shot of hand back, wrist, and manicured knuckles against smooth human skin",

    partial_skin_finger_knuckle_macro: "Tight macro close-up framing manicured fingers, knuckles, and ring on real skin",
    partial_skin_hand_resting_skin: "Macro shot of hand resting gently on skin, displaying finger rings and hand jewelry",
    partial_skin_interlocked_fingers: "Macro camera framing focusing on interlocked manicured fingers and ring settings",

    partial_skin_waist_hip_curve_macro: "Intimate macro camera angle framing waist curve and hip bone against soft human skin",
    partial_skin_navel_hip_drape: "Close-up macro shot centering midriff, navel area, and hip curve with waist jewelry",
    partial_skin_lower_waist_profile: "Side angle macro camera framing lower waist and hip contour on smooth skin",

    partial_skin_ankle_foot_macro: "Macro close-up camera angle focusing on ankle bone joint and instep skin",
    partial_skin_toes_instep_close: "Tight macro shot showcasing manicured toes, instep, and foot skin texture",
    partial_skin_heel_anklet_profile: "Side profile macro angle framing heel, ankle curve, and anklet drape on real skin",

    partial_skin_chest_lapel_macro: "Macro close-up framing collarbone, upper chest, and shoulder skin texture",
    partial_skin_wrist_cuff_close: "Tight macro camera angle focusing on wrist joint, cuff, and skin texture",

    // Jewelry - No Face Poses (Headless / Face Turned Away / Face Cropped) - Micro Focus on Item (Neck, Ear, Wrist, Finger, etc.)
    no_face_neck_collarbone_drape: "Micro focus on necklace item drape, pendant setting, and gemstone facet luster against smooth neck and collarbone skin (headless, strictly no face)",
    no_face_decollete_torso: "Micro focus on necklace item sparkle, chain links, and pendant detailing on upper chest and décolletage neck skin (headless, strictly no face)",
    no_face_throat_collarbone_macro: "Extreme micro close-up focused directly on necklace item clasp, fit, and gemstone brilliance against throat and neck skin (eyes and face strictly cropped out)",

    no_face_side_neck_ear_macro: "Micro focus on earring item drop, metal luster, and stone setting at the earlobe against smooth side neck skin (face turned away, strictly no face)",
    no_face_ear_nape_profile: "Micro profile focus on earring item dangle, gemstone cut, and setting finish on earlobe and neck skin (no facial features visible)",
    no_face_shoulder_ear_line: "Micro focus on earring item piece and dangle brilliance along the ear and neck skin line (headless, strictly no face)",

    no_face_wrist_hand_waist: "Micro focus on wrist item (bracelet or watch bezel, dial details, clasp) against smooth wrist and hand skin (headless, strictly no face)",
    no_face_forearm_cross_body: "Micro close-up focus on bangles/bracelet item stack, highlighting metal sheen against forearm wrist skin (headless, strictly no face)",
    no_face_hand_lap_drape: "Micro camera focus on bracelet or wristwear item details against hand and wrist skin (headless, strictly no face)",

    no_face_finger_touching_hip: "Micro focus on ring item setting, gemstone cut, and band brilliance on manicured finger skin (headless, strictly no face)",
    no_face_interlocked_hands_chest: "Micro focus on ring item band, solitaire setting, and stone brilliance on interlocked finger skin (headless, strictly no face)",
    no_face_finger_ring_lap: "Micro framing centered tightly on finger ring items, solitaire facets, and metal finish against manicured finger skin (headless, strictly no face)",

    no_face_waist_midriff_front: "Micro focus on kamarbandh waist chain item pattern and gem accents against smooth waist skin (headless, strictly no face)",
    no_face_hip_curve_side: "Micro focus on waist chain item link drapes and ornament luster along hip curve skin (headless, strictly no face)",
    no_face_back_waist_drape: "Micro focus on waistband item ornament and back chainwork against lower back skin (headless, strictly no face)",

    no_face_anklet_stepping: "Micro focus on anklet item links and metal luster on ankle and foot skin (strictly no face)",
    no_face_seated_feet_drape: "Micro focus on anklet and foot jewelry item details against smooth ankle/foot skin (headless, no face visible)",
    no_face_toe_ring_step: "Micro close-up focused on toe ring item settings and gemstone details on toe and instep skin (feet close-up, strictly no face)",

    no_face_side_nostril_neck: "Micro focus on nose pin or ring item design, gemstone sparkle, and metalwork against nostril and neck skin (upper face and eyes cropped out)",
    no_face_chin_lips_nose: "Micro camera focus on nose ornament item craftsmanship and luster against nose, lips, and chin skin (forehead and eyes cropped out)",

    no_face_forehead_hairline_only: "Micro focus on forehead ornament item, maang tikka pendant, and gemstone drop against upper forehead skin (eyes and lower face cropped out)",
    no_face_top_crown_hair: "Micro focus on headband or crown ornament item details against forehead and hairline skin (no face visible)",

    no_face_chest_shoulder_accessory: "Micro focus on chest and shoulder accessory item details against upper chest and shoulder skin (headless, strictly no face)",
    no_face_arm_wrist_cuff: "Micro focus on arm cuff or armlet item details and surface texture against upper arm skin (headless, strictly no face)",

    // Legacy/Fallback poses
    hand_face_gesture: "Hand-to-face beauty gesture shot, manicured fingers touching cheek/chin, framing rings and bracelets alongside facial poise (face fully shown)",
    three_quarter_gaze: "Three-quarter elegance portrait, subtle head tilt and studio gaze, capturing harmonized necklace and earring brilliance (face fully shown)",
    front_direct_portrait: "Direct frontal close-up beauty portrait, framing face, neckline, and shoulders with high-fashion symmetry (face fully shown)"
  };

  return framingMap[poseKey] || `${category === "garment" ? "Catalog camera framing" : "Jewelry studio camera framing"} tailored for ${poseKey}`;
}

// Helper to compile state selections into a rich, structured JSON prompt invisible to the user
export function compilePrompt(state: {
  workspace: "garment" | "jewelry";
  garmentType: string;
  garmentPresentation: string;
  garmentModelGender: string;
  garmentModelPose: string;
  garmentBackground: string;
  garmentBgColor: string;
  jewelryType: string;
  jewelryPresentation: string;
  jewelryModelGender: string;
  jewelryModelPose: string;
  jewelryBustRegion: string;
  jewelryBackground: string;
  jewelryBgColor: string;
  garmentModelFacePrompt?: string;
  jewelryModelFacePrompt?: string;
  hasFaceRef?: boolean;
  photoStyle: "editorial" | "campaign";
  aspectRatio?: string;
  resolution?: string;
  dynamicConfig?: StudioConfigResponse | null;
}): string {
  const activeAspect = state.aspectRatio || "1:1";
  const activeRes = state.resolution || "1k";
  const isSquare = activeAspect === "1:1";
  const isPortrait = activeAspect === "3:4" || activeAspect === "9:16" || activeAspect === "2:3";

  const orientationLabel = isSquare ? "Square (1:1)" : isPortrait ? "Portrait Vertical" : "Landscape Horizontal";
  const framingGuide = isSquare
    ? "Framed precisely for 1:1 square canvas ratio. Maintain balanced centered orientation with equal padding on top, bottom, and side margins."
    : isPortrait
    ? "Framed for vertical portrait ratio. Maintain elegant vertical alignment from shoulder/head to lower hem line or macro pose."
    : "Framed for horizontal landscape ratio. Maintain wide studio composition highlighting background ambiance and subject context.";

  const exportSpecs = {
    canvas_aspect_ratio: activeAspect,
    composition_orientation: orientationLabel,
    export_resolution_tier: activeRes,
    framing_and_cropping_guide: framingGuide
  };

  const dynamicFidelitySettings = state.dynamicConfig?.settings?.["fidelity_directives"] || (state.dynamicConfig as any)?.systemSettings?.fidelityRules;
  const dynamicNegativeExclusions = state.dynamicConfig?.settings?.["negative_exclusions"] || (state.dynamicConfig as any)?.systemSettings?.negativeExclusions;
  const dynamicMandatory = Array.isArray(dynamicFidelitySettings?.mandatory_replications)
    ? dynamicFidelitySettings.mandatory_replications
    : Array.isArray(dynamicFidelitySettings) && dynamicFidelitySettings.length > 0
    ? dynamicFidelitySettings
    : null;
  const dynamicProhibitions = Array.isArray(dynamicNegativeExclusions?.prohibitions)
    ? dynamicNegativeExclusions.prohibitions
    : Array.isArray(dynamicNegativeExclusions) && dynamicNegativeExclusions.length > 0
    ? dynamicNegativeExclusions
    : null;
  const dynamicFaceRules = state.dynamicConfig?.settings?.["face_matching_rules"] || (state.dynamicConfig as any)?.systemSettings?.faceMatchingRules;
  const dynamicFaceMandatory = Array.isArray(dynamicFidelitySettings?.mandatory_face_replications)
    ? dynamicFidelitySettings.mandatory_face_replications
    : null;

  if (state.workspace === "garment") {
    const dynamicItem = state.dynamicConfig?.catalogItems?.find(
      (item) => item.id === state.garmentType && item.workspace === "garment"
    );
    const fallbackGarmentFrag = PROMPT_FRAGMENTS.garment.types[state.garmentType as keyof typeof PROMPT_FRAGMENTS.garment.types] || state.garmentType;
    const garmentFrag = dynamicItem?.promptDirective || fallbackGarmentFrag;
    const isHumanModel = state.garmentPresentation === "model" || state.garmentPresentation === "partial_face" || state.garmentPresentation === "no_face";
    
    let presentationFrag = "";
    let defaultFaceDescription = "";
    let poseDescription = "";
    
    if (isHumanModel) {
      const dynamicPose = state.dynamicConfig?.presets?.poses?.find((p) => p.id === state.garmentModelPose);
      poseDescription = dynamicPose?.promptDirective || (PROMPT_FRAGMENTS.garment as any).poses[state.garmentModelPose] || getCameraFramingAndAngle(state.garmentModelPose, state.garmentType, "garment");
      const isFemale = state.garmentModelGender === "female";
      const expression = state.photoStyle === "campaign" 
        ? "warm, confident commercial expression" 
        : "neutral high-fashion expression, never smiling";
      
      if (state.garmentPresentation === "no_face") {
        defaultFaceDescription = `NO FACE SHOWN: Worn gracefully by an elegant young Indian ${state.garmentModelGender} model with human face strictly cropped out, turned away, or headless (showing NO human eyes, nose, lips, or facial features)`;
      } else if (state.garmentPresentation === "partial_face") {
        defaultFaceDescription = `PARTIAL FACE SHOWN: Worn elegantly by a stylish young Indian ${state.garmentModelGender} model with a partial face composition (lips, jawline, neck, or cheek softly framed, eyes/forehead cropped out or obscured)`;
      } else {
        if (isFemale) {
          defaultFaceDescription = `worn gracefully by a beautiful, professional young Indian female fashion model with a ${expression}`;
        } else {
          defaultFaceDescription = `worn elegantly by a handsome, professional young Indian male fashion model with a ${expression}`;
        }
      }

      const faceDescription = state.garmentModelFacePrompt || defaultFaceDescription;
      let finalFaceDescription = faceDescription;
      if (state.photoStyle === "campaign" && state.garmentPresentation === "model") {
        finalFaceDescription = faceDescription
          .replace(/neutral high-fashion expression, never smiling/gi, "warm, confident commercial expression")
          .replace(/perfectly neutral facial expression/gi, "warm, confident commercial expression")
          .replace(/neutral facial expression/gi, "warm, confident commercial expression");
      } else if (state.garmentPresentation === "model") {
        finalFaceDescription = faceDescription
          .replace(/warm, confident commercial expression/gi, "neutral high-fashion expression, never smiling");
      }
      
      presentationFrag = `${finalFaceDescription}, ${poseDescription}`;
    } else if (state.garmentPresentation === "mannequin") {
      presentationFrag = (PROMPT_FRAGMENTS.garment.presentations.mannequin as any)[state.garmentModelGender as "female" | "male"] || "";
    } else {
      const dynamicPres = state.dynamicConfig?.presets?.presentations?.find((p) => p.id === state.garmentPresentation);
      presentationFrag = dynamicPres?.promptDirective || (PROMPT_FRAGMENTS.garment.presentations as any)[state.garmentPresentation] || state.garmentPresentation;
    }

    let bgFrag = "";
    const dynamicBg = state.dynamicConfig?.presets?.backgrounds?.find((b) => b.id === state.garmentBackground);
    if (state.garmentBackground === "plain") {
      bgFrag = PROMPT_FRAGMENTS.garment.backgrounds.plain(state.garmentBgColor);
    } else {
      bgFrag = dynamicBg?.promptDirective || (PROMPT_FRAGMENTS.garment.backgrounds as any)[state.garmentBackground] || state.garmentBackground;
    }

    let placementDirective = "";
    const gCategory = getGarmentCategoryLabel(state.garmentType);
    if (isHumanModel) {
      if (state.garmentType === "western_wear") {
        placementDirective = `The Western Wear ensemble fits and drapes seamlessly as a complete full-body outfit (chic dress, jumpsuit, or contemporary co-ord set). It covers the torso down to the hemline or trousers with modern tailored lines, crisp fabric structure, clean seams, and elegant urban silhouette on the model's body in the ${state.garmentBackground} setting.`;
      } else if (gCategory === "Full wear") {
        placementDirective = `The full-length garment drapes, wraps, or fits continuously from the shoulders/waist down to the ankles or feet, fully covering the body's main silhouette. It hangs naturally with authentic fabric weight, showing all pleats, folds, and embroidery symmetrically on the model's body in the ${state.garmentBackground} setting.`;
      } else if (gCategory === "Top wear") {
        placementDirective = `The top-wear garment fits cleanly over the upper torso, shoulders, chest, and arms. It drapes naturally, resting precisely at the waistline or hips, displaying realistic fabric tension around the collar, shoulders, sleeves, and chest of the model in the ${state.garmentBackground} environment.`;
      } else if (gCategory === "Bottom wear") {
        placementDirective = `The bottom-wear garment fits the waist, hips, and legs perfectly. It sits cleanly on the waistline, draping naturally down to the thighs, knees, or ankles, showcasing authentic seams, waistband detailing, pockets, and hem structure on the lower body of the model within the ${state.garmentBackground} background.`;
      }
    } else {
      if (state.garmentPresentation === "folded") {
        placementDirective = `The garment is neatly and immaculately folded in a crisp square shape on a clean flat surface in high-end retail boutique display style. The main signature part of the garment (such as the pallu for sarees, chest/collar embroidery motif for kurtas/shirts/t-shirts, or primary design feature) is prominently displayed right on top of the folded square, facing directly up towards the camera. Strictly no human model or skin in frame.`;
      } else {
        placementDirective = `The garment is presented on a ${state.garmentPresentation} display setup without any human model present. It displays authentic fabric drape, crisp seams, pattern integrity, and clean structural silhouette on the ${state.garmentPresentation} within the ${state.garmentBackground} environment. Strictly no human model or skin in frame.`;
      }
    }

    const faceVisibilityInfo = getPoseFaceVisibilityRule(state.garmentModelPose, "garment");

    const jsonPrompt = {
      category: "garment",
      export_specifications: exportSpecs,
      product_info: {
        item_type: gCategory,
        type: state.garmentType,
        detailed_clothing_description: garmentFrag,
        item_placement_and_fit: placementDirective
      },
      presentation_setup: {
        mode: state.garmentPresentation,
        visual_presentation_style: presentationFrag,
        ...(isHumanModel ? {
          model_details: {
            gender: state.garmentModelGender,
            pose_type: state.garmentModelPose,
            pose_details: poseDescription,
            camera_framing_and_angle: getCameraFramingAndAngle(state.garmentModelPose, state.garmentType, "garment"),
            face_visibility_directive: faceVisibilityInfo.description,
            face_description: state.garmentModelFacePrompt || null,
            default_gender_look: defaultFaceDescription,
            face_reference_purpose_note: "Reference image of human model is for face reference purpose only. Same face identity preserved, but head rotation, body pose, camera angle, and expression are altered according to item type and selected Model Pose / Camera Angle. The model face can be fully shown or partially shown (e.g. cropped at lower face/chin, side profile, or lower body focus) according to the chosen Model Pose / Camera Angle."
          }
        } : {
          human_presence: "STRICTLY NONE - NON-HUMAN PRODUCT DISPLAY MODE",
          no_human_directive: `DO NOT GENERATE ANY HUMAN MODEL, PERSON, FACE, BODY PARTS, OR SKIN. Output ONLY the product on its ${state.garmentPresentation} display mount.`
        })
      },
      scene_environment: {
        background_style: state.garmentBackground,
        background_description: bgFrag,
        background_color_hex: state.garmentBackground === "plain" ? getColorHexByName(state.garmentBgColor) : null,
        background_color_name: state.garmentBackground === "plain" ? state.garmentBgColor : null,
        lighting: state.photoStyle === "campaign"
          ? "high-end luxury fashion photography studio, professional softbox three-point lighting, bright even illumination, minimal shadows, clean commercial look"
          : "high-end luxury fashion photography studio, professional softbox three-point lighting, subtle shadows, volumetric styling"
      },
      artistic_style: {
        theme: state.photoStyle === "editorial" ? "Editorial fashion and product photography" : "Commercial campaign and advertising photography",
        photography_style: state.photoStyle,
        style_attributes: state.photoStyle === "editorial" 
          ? "High-fashion narrative, storytelling creative compositions, dramatic soft-focused elements, vogue-style artistic elegance, professional editorial spread aesthetic"
          : "Bold commercial appeal, vibrant brand promotional campaign, crisp studio look, highly optimized for catalog advertisement, premium billboard styling",
        quality_level: isHumanModel
          ? "authentic high-end professional fashion photography, shot on Hasselblad H6D-100c medium format camera, Carl Zeiss prime lens, natural skin texture, exquisite fabric details, perfectly preserved organic look, high fashion magazine feature, neutral color grading, international modeling agency comp card quality, shot on professional full-frame camera, 85mm f/1.4 lens, tack-sharp focus, crisp micro-detail on skin and fabric texture, color-accurate, magazine cover quality, no motion blur, no noise, no artifacts, no CGI plastic look"
          : "authentic high-end professional fashion product photography, shot on Hasselblad H6D-100c medium format camera, Carl Zeiss prime lens, exquisite fabric details, perfectly preserved organic look, high fashion product catalog feature, neutral color grading, shot on professional full-frame camera, 85mm f/1.4 lens, tack-sharp focus, crisp micro-detail on fabric texture, color-accurate, pristine product showcase quality, no human figure, no model, no skin, no motion blur, no noise, no artifacts, no CGI plastic look"
      },
      fidelity_directives: {
        highest_priority_rule: "EXACT REPLICATION OF INPUT PRODUCT DESIGN, FABRIC/MATERIAL, PATTERNS, LENGTH, AND SIZE REQUIRED",
        auto_detect_material_and_fabric_properties: "AUTOMATIC MATERIAL & FABRIC DETECTION: Automatically analyze and detect the fabric and material properties of the uploaded product reference image (such as silk, cotton, denim, velvet, chiffon, satin, leather, linen, wool, jacquard, organza, georgette, lace, embroidery thread, sequin finish, or knitwear), including its weave structure, thread count, thickness, weight, drape, surface sheen, and light reflectance, and apply the exact same material and fabric properties to the generated output product.",
        core_instruction: "The final AI-generated image must EXACTLY REPLICATE and reproduce the input product (garment) shown in the reference image. Automatically detect and analyze the item's exact material and fabric properties, applying the same fabric characteristics to the generated output. The design, artwork, patterns, fabric motifs, exact length, physical size, proportions, and visual features must be 100% faithful and identical to the uploaded item. Do not generate a creative, inspired, redesigned, modified, or re-proportioned version of the product.",
        input_image_guideline: "The input image is the authentic reference of the garment product. Automatically detect and replicate its exact material/fabric properties, design layout, pattern layout, garment length (full-length, knee-length, cropped, short, long-sleeve, 3/4-sleeve), and size proportions precisely.",
        mandatory_replications: dynamicMandatory || [
          "Automatic detection and 1:1 application of the uploaded product's exact fabric and material properties (fabric composition, weave density, surface texture, weight, fall/drape, stiffness or fluidity, matte vs lustrous sheen)",
          "Exact product design, artwork, motifs, prints, embroidery, and weave patterns replicated 1:1 in scale and position",
          "Exact garment length and cut (e.g., full length, ankle-length, knee-length, waist-length, cropped, floor-length drape)",
          "Exact sleeve length, armhole cut, and shoulder fit (e.g., full sleeves, 3/4 sleeves, half sleeves, cap sleeves, sleeveless)",
          "Exact collar, neckline, and lapel depth, shape, and structure",
          "Exact borders, edge trimmings, lace, piping, zardosi, sequin work, and hem details",
          "Exact fabric material, texture, weight, fall, drape, and surface luster",
          "Exact color shades, palette, gradients, and contrasting accents",
          "Exact proportions, silhouette, fit, and overall physical size of the garment",
          "Buttons, zippers, pockets, drawstrings, pleats, and functional hardware in exact counts and positions"
        ]
      },
      exclusion_directives: {
        highest_priority_exclusion_rule: "STRICTLY NO PRICE TAGS, HANGTAGS, BRAND TAGS, COMPANY LOGOS, OR TEXT OVERLAYS",
        instruction: "The output image must be a clean, pristine studio fashion photograph completely FREE of price tags, store price stickers, barcode tags, paper hangtags, security tags, brand labels, company logos, store tags, watermarks, text labels, sale badges, or graphic overlays anywhere on the garment, display mount, or background. If the input reference image has any visible price tag, hanging paper tag, barcode sticker, or brand label attached to the product, digitally remove and omit it entirely, rendering the item clean and pristine.",
        ...(dynamicProhibitions && dynamicProhibitions.length > 0 ? { system_negative_exclusions: dynamicProhibitions } : {}),
        ...(!isHumanModel && {
          strict_no_human_rule: "STRICTLY NO HUMAN MODEL, NO PERSON, NO HUMAN FACE, NO BODY PARTS, NO HANDS, NO SKIN",
          strict_no_human_instruction: `CRITICAL: This is a NON-HUMAN product display presentation mode (${state.garmentPresentation}). There must be STRICTLY NO HUMAN BEING, NO LIVE MODEL, NO PERSON, NO HUMAN FACE, NO HEAD, NO EYES, NO NECK, NO HANDS, NO LEGS, NO SKIN anywhere in the final output image. Render ONLY the product displayed on its non-human setup (${state.garmentPresentation}). The entire image MUST be 100% human-free.`
        }),
        ...(state.garmentPresentation === "no_face" && {
          strict_no_human_face_rule: "STRICTLY NO HUMAN FACE, NO EYES, NO NOSE, NO LIPS, NO FACIAL FEATURES SHOWN",
          strict_no_human_face_instruction: "CRITICAL: This presentation mode requires NO FACE SHOWN. Frame the garment on the model with head strictly cropped out above neck/jawline, or model turned away. Absolutely ZERO human eyes, nose, lips, or facial features in frame."
        })
      },
      ...(isHumanModel && {
        model_expression_directive: state.photoStyle === "campaign" ? {
          highest_priority_expression_rule: "COMMERCIAL CAMPAIGN CONFIDENT EXPRESSION",
          instruction: "The model must have a warm, confident, approachable commercial expression suitable for advertising campaigns — a soft smile or gentle closed-mouth smile, poised and polished, like an international modeling agency campaign face. Avoid overly serious, cold, or moody editorial expressions."
        } : {
          highest_priority_expression_rule: "HIGH-FASHION EDITORIAL NEUTRAL EXPRESSION",
          instruction: "The model must have a neutral, serious, high-fashion editorial expression. Never smiling. Calm, poised, intense gaze, like international runway/editorial models."
        }
      }),
      ...(isHumanModel && state.hasFaceRef && {
        face_matching_directive: {
          highest_priority_rule: dynamicFidelitySettings?.highest_priority_face_rule || "100% IDENTICAL FACE IDENTITY REPLICATION MANDATE - ZERO DRIFT, EXACT SAME PERSON",
          instruction: dynamicFaceRules?.face_fidelity_instruction || "CRITICAL 100% FACE IDENTITY PRESERVATION: The reference image of the human model (second uploaded image) is the authoritative reference for the human model's exact face identity. You MUST replicate 100% of this specific person's facial features with complete photographic fidelity. Maintain identical facial bone structure, jawline, eye contours, iris color, eyelid shape, eyebrow arches, nose bridge and tip proportions, philtrum, lip shape and volume, skin undertone, natural melanin, and facial landmarks without beautification or alteration. Strictly ZERO facial morphing, ZERO generic face substitution, and ZERO face blending. While the head orientation, gaze direction, body posture, and lighting naturally adjust to match the chosen pose and presentation, the identity MUST remain 100% recognizably and unmistakably the EXACT same person as in the reference photo.",
          face_visibility_mode: state.garmentPresentation === "partial_face" ? "PARTIAL_FACE_MACRO_CLOSEUP" : "FULL_FACE_PORTRAIT",
          fidelity_directive: "100% IDENTICAL BONE STRUCTURE, EYES, NOSE, LIPS, AND COMPLEXION",
          ...(dynamicFaceMandatory ? { mandatory_face_replications: dynamicFaceMandatory } : {})
        }
      })
    };

    return JSON.stringify(jsonPrompt, null, 2);
  } else {
    const rawType = state.jewelryType;
    const normalizedType = (rawType === "noise" || rawType === "nose") ? "nose_ring" : rawType;
    const dynamicItem = state.dynamicConfig?.catalogItems?.find(
      (item) => (item.id === rawType || item.id === normalizedType) && item.workspace === "jewelry"
    );
    const fallbackJewelryFrag = PROMPT_FRAGMENTS.jewelry.types[rawType as keyof typeof PROMPT_FRAGMENTS.jewelry.types] 
      || PROMPT_FRAGMENTS.jewelry.types[normalizedType as keyof typeof PROMPT_FRAGMENTS.jewelry.types] 
      || state.jewelryType;
    const jewelryFrag = dynamicItem?.promptDirective || fallbackJewelryFrag;
    const isHumanModel = state.jewelryPresentation === "model" || state.jewelryPresentation === "partial_face" || state.jewelryPresentation === "no_face" || state.jewelryPresentation === "body_part";

    let presentationFrag = "";
    let defaultFaceDescription = "";
    let poseDescription = "";

    const dynamicPose = state.dynamicConfig?.presets?.poses?.find((p) => p.id === state.jewelryModelPose);
    const defaultPoseDesc = (PROMPT_FRAGMENTS.jewelry as any).poses[state.jewelryModelPose] || getCameraFramingAndAngle(state.jewelryModelPose, normalizedType, "jewelry");
    const activePoseDesc = dynamicPose?.promptDirective || defaultPoseDesc;

    if (state.jewelryPresentation === "body_part") {
      poseDescription = activePoseDesc;
      const bodyPartBase = "macro close-up shot focused on the jewelry item placed cleanly and naturally on a real human body part (such as neck, ear, wrist, finger, waist, nose, or ankle depending on item type) with smooth authentic skin texture and natural pores. This mode strictly uses NO face reference and does NOT generate any face identity, head, eyes, nose, or lips";
      presentationFrag = `${bodyPartBase}, ${poseDescription}`;
    } else if (state.jewelryPresentation === "no_face") {
      poseDescription = activePoseDesc;
      const noFaceBase = "worn on an authentic live human model skin backdrop, with primary macro camera focus and razor-sharp depth-of-field centered strictly on the jewelry item product details, metal luster, and gemstone brilliance, while the human face is strictly cropped out of frame, turned away, or headless (showing NO human eyes, nose, lips, or face)";
      const skinDescription = state.jewelryModelFacePrompt ? `human model skin tone and body features (${state.jewelryModelFacePrompt})` : "young female human model body with smooth skin tone";
      presentationFrag = `${noFaceBase}, ${skinDescription}, ${poseDescription}`;
    } else if (state.jewelryPresentation === "partial_face") {
      poseDescription = activePoseDesc;
      const partialFaceBase = "worn on authentic human skin with a human skin partial face macro close-up framing, showing clean skin texture, natural pores, and soft studio lighting while cropping full facial identity";
      const faceDescription = state.jewelryModelFacePrompt ? `human model with features (${state.jewelryModelFacePrompt})` : "young female human model with smooth flawless skin tone";
      presentationFrag = `${partialFaceBase}, ${faceDescription}, ${poseDescription}`;
    } else if (isHumanModel) {
      poseDescription = activePoseDesc;
      const rawDefault = PROMPT_FRAGMENTS.jewelry.presentations.model[state.jewelryModelGender as "female" | "male"] || "";
      if (state.photoStyle === "campaign") {
        defaultFaceDescription = rawDefault.replace("neutral high-fashion expression, never smiling", "warm, confident commercial expression");
      } else {
        defaultFaceDescription = rawDefault;
      }
      const faceDescription = state.jewelryModelFacePrompt || defaultFaceDescription;
      presentationFrag = `${faceDescription}, ${poseDescription}`;
    } else {
      const dynamicPres = state.dynamicConfig?.presets?.presentations?.find((p) => p.id === state.jewelryPresentation);
      presentationFrag = dynamicPres?.promptDirective || PROMPT_FRAGMENTS.jewelry.presentations.bust[state.jewelryBustRegion as keyof typeof PROMPT_FRAGMENTS.jewelry.presentations.bust] || state.jewelryBustRegion;
    }

    const effectiveJewelryBg = (isHumanModel && !["plain", "studio"].includes(state.jewelryBackground))
      ? "plain"
      : state.jewelryBackground;

    let bgFrag = "";
    const dynamicBg = state.dynamicConfig?.presets?.backgrounds?.find((b) => b.id === effectiveJewelryBg);
    if (effectiveJewelryBg === "plain") {
      bgFrag = PROMPT_FRAGMENTS.jewelry.backgrounds.plain(state.jewelryBgColor);
    } else {
      bgFrag = dynamicBg?.promptDirective || (PROMPT_FRAGMENTS.jewelry.backgrounds as any)[effectiveJewelryBg] || effectiveJewelryBg;
    }

    let placementDirective = "";
    const jCategory = getJewelryCategoryLabel(normalizedType);
    if (isHumanModel) {
      if (jCategory === "Hip & Waist Jewellery" || rawType === "waistband" || rawType === "hip_chain" || rawType === "kamarbandh") {
        placementDirective = `The waist ornament (kamarbandh / hip chain / waistband) is wrapped gracefully around the model's waist or hips over ethnic apparel, displaying elaborate Kundan craftsmanship, gold link draping, and sparkling gemstone drops in a flattering midsection pose in the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded waist ornament and strictly NO other jewelry or accessories on their body, neck, ears, wrists, fingers, nose, or head.`;
      } else if (jCategory === "Nose Jewellery (Nath)" || normalizedType === "nose_ring" || rawType === "nose_pin" || rawType === "nath" || rawType === "noise" || rawType === "nose") {
        placementDirective = `The traditional nose pin or nose ring (nath) is delicately positioned on the side of the nose or nostril of the model, perfectly aligned with the facial profile and skin texture, casting a soft realistic contact shadow and gleaming softly under studio portrait lighting in the ${effectiveJewelryBg} environment. The model wears ONLY this uploaded nose ornament and strictly NO other jewelry or accessories on their body, neck, ears, wrists, fingers, or head.`;
      } else if (jCategory === "Leg Jewellery (Anklets & Toe Rings)" && (normalizedType === "toe" || rawType === "toe_ring")) {
        placementDirective = `The toe ring (bichhiya / toe ornament) is fitted gracefully on the second toe or foot of the model, displaying intricate silver or gold filigree, tiny gemstone facets, and delicate metal bands draped against smooth foot skin in an intimate toe and foot close-up beauty pose inside the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded toe ornament and strictly NO other anklets, rings, or body accessories.`;
      } else if ((jCategory === "Leg Jewellery (Anklets & Toe Rings)" || jCategory === "Anklets (Payal)") && (normalizedType === "anklet" || rawType === "payal")) {
        placementDirective = `The anklet (payal) is wrapped gracefully around the model's ankle, displaying delicate silver or gold links, tiny ghungroo bells, and pearl drops draped against smooth skin in an intimate lower-leg close-up beauty pose inside the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded anklet and strictly NO other toe rings, jewelry, or accessories.`;
      } else if (jCategory === "Finger Rings" || normalizedType === "ring" || rawType === "finger_ring" || rawType === "thumb_ring" || rawType === "solitaire") {
        placementDirective = `The finger ring fits snugly on the finger of the model's hand, displaying exquisite metal band craft, prong-set gemstone facets, and brilliant light reflections in an intimate close-up hand gesture within the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded ring and strictly NO other rings, bangles, necklaces, earrings, or accessories.`;
      } else if (jCategory === "Neckwear") {
        placementDirective = `The neckwear rests elegantly around the base of the neck or collarbone. It drapes symmetrically over the chest or skin with natural gravitational hang, reflecting light beautifully on the metal links and gemstones on the model's collarbone in the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded neckwear and strictly NO other jewelry, earrings, nose rings, bangles, or headpieces.`;
      } else if (jCategory === "Earwear") {
        placementDirective = `The earwear hangs or sits snugly on the earlobes. It is framed cleanly by the face or jawline, dangling or resting with natural weight, alignment, and three-dimensional depth relative to the ears of the model in the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded earwear and strictly NO other necklaces, nose rings, bangles, or head ornaments.`;
      } else if (jCategory === "Wristwear & Bangles") {
        placementDirective = `The wristwear or bangles fit snugly around the wrist or forearm. It is positioned organically on the hand, wrist, or arm, showcasing pristine metal surfaces and gemstone brilliance with realistic anatomical scaling and lighting in the ${effectiveJewelryBg} environment. The model wears ONLY this uploaded wristwear and strictly NO other rings, necklaces, earrings, or body jewelry.`;
      } else if (jCategory === "Forehead & Head Jewellery" || rawType === "maang_tikka" || rawType === "matha_patti" || rawType === "borla" || rawType === "passa" || rawType === "headband") {
        placementDirective = `The forehead headpiece (maang tikka / matha patti / borla / passa / headband) rests gracefully along the model's hairline or forehead center, draped symmetrically with intricate gold filigree, pearls, and gemstone drops, framed beautifully with hair styling in the ${effectiveJewelryBg} scene. The model wears ONLY this uploaded head ornament and strictly NO other necklaces, earrings, or nose rings.`;
      } else {
        placementDirective = `The accessory is positioned precisely on its designated body region (e.g., forehead, nose, ankle, or clothing lapel), aligning seamlessly with the natural curves and scale of the model inside the ${effectiveJewelryBg} environment. The model wears ONLY this uploaded accessory and strictly NO other jewelry or ornaments.`;
      }
    } else {
      if (state.jewelryBustRegion === "naturally") {
        placementDirective = `The ${state.jewelryType} is placed naturally, organically, and flat directly within the ${state.jewelryBackground} environment, resting seamlessly on the natural surface and adjacent background elements (such as marble, sand, silk drapes, wood, or granite) without any artificial display stands or mounts. The product MUST seamlessly integrate with ambient background lighting, casting physical soft contact shadows, producing natural metallic and gemstone surface reflections from surrounding props, matching the scene's color temperature, and fitting naturally into the background composition. The image MUST feature ONLY this single uploaded product and strictly NO other unrequested jewelry pieces.`;
      } else if (jCategory === "Hip & Waist Jewellery" || rawType === "waistband" || rawType === "hip_chain" || rawType === "kamarbandh") {
        placementDirective = `The waist ornament (kamarbandh / hip chain / waistband) is displayed gracefully on a waist display stand or laid in elegant fluid curves flat on the ${state.jewelryBackground} background surface without any human present. Features ONLY this single uploaded item and NO other jewelry.`;
      } else if (jCategory === "Nose Jewellery (Nath)" || normalizedType === "nose_ring" || rawType === "nose_pin" || rawType === "nath" || rawType === "noise" || rawType === "nose") {
        placementDirective = `The nose pin or nose ring (nath) is presented on a specialized jewelry holder or resting flat and naturally on the ${state.jewelryBackground} surface without any live human face present, showcasing fine gold wirework, dangling pearl drop accents, and brilliant craftsmanship. Features ONLY this single uploaded item and NO other jewelry.`;
      } else if (jCategory === "Leg Jewellery (Anklets & Toe Rings)" && (normalizedType === "toe" || rawType === "toe_ring")) {
        placementDirective = `The toe ring (bichhiya / toe ornament) is displayed gracefully on a foot display cushion or laid flat naturally on the ${state.jewelryBackground} surface with pristine contact shadows and metal filigree details. Features ONLY this single uploaded toe ring and NO other jewelry.`;
      } else if ((jCategory === "Leg Jewellery (Anklets & Toe Rings)" || jCategory === "Anklets (Payal)") && (normalizedType === "anklet" || rawType === "payal")) {
        placementDirective = `The anklet (payal) is displayed gracefully on an ankle display mount or laid naturally in soft fluid curves directly on the ${state.jewelryBackground} background surface, highlighting every pearl, ghungroo bell, and metallic link cleanly without any human model. Features ONLY this single uploaded item and NO other jewelry.`;
      } else if (jCategory === "Finger Rings" || normalizedType === "ring" || rawType === "finger_ring" || rawType === "thumb_ring" || rawType === "solitaire") {
        if (state.jewelryBustRegion === "hand") {
          placementDirective = `The uploaded finger ring is worn and perfectly fitted directly onto the finger of the elegant female porcelain or mannequin hand display sculpture, displaying exquisite metal band craft, prong-set gemstone facets, and brilliant light reflections on the hand display stand inside the ${state.jewelryBackground} scene. Features ONLY this single uploaded item and NO other jewelry.`;
        } else if (state.jewelryBustRegion === "finger") {
          placementDirective = `The finger ring is mounted snugly and perfectly fitted onto a luxury ring cone holder or finger display stand with pristine contact shadows and gemstone brilliance in the ${state.jewelryBackground} scene. Features ONLY this single uploaded item and NO other jewelry.`;
        } else {
          placementDirective = `The finger ring is mounted on a luxury ring cone display stand or laid flat naturally on the ${state.jewelryBackground} surface with pristine contact shadows and gemstone brilliance. Features ONLY this single uploaded item and NO other jewelry.`;
        }
      } else if (jCategory === "Neckwear") {
        placementDirective = `The neckwear rests elegantly around the display bust mount. It drapes symmetrically over the smooth display stand surface without any human present, reflecting light beautifully on the metal links and gemstones on the display bust in the ${state.jewelryBackground} scene. Features ONLY this single uploaded neckwear and NO other jewelry.`;
      } else if (jCategory === "Earwear") {
        placementDirective = `The earwear hangs or sits snugly on the ear profile or display stand mount. It is framed cleanly on the non-human display stand without any live human face, dangling or resting with natural weight and three-dimensional depth on the display stand in the ${state.jewelryBackground} scene. Features ONLY this single uploaded earwear and NO other jewelry.`;
      } else if (jCategory === "Wristwear & Bangles") {
        placementDirective = `The wristwear or bangles fit snugly on the display stand, watch cushion, ring cone holder, or hand display sculpture. It is positioned elegantly on the display mount without any live human present, showcasing pristine metal surfaces and gemstone brilliance in the ${state.jewelryBackground} environment. Features ONLY this single uploaded wristwear and NO other jewelry.`;
      } else if (jCategory === "Forehead & Head Jewellery" || rawType === "maang_tikka" || rawType === "matha_patti" || rawType === "borla" || rawType === "passa" || rawType === "headband") {
        placementDirective = `The forehead headpiece (maang tikka / matha patti / borla / passa / headband) is displayed gracefully on a velvet or ceramic mannequin head mount or laid in fluid curves flat on the ${state.jewelryBackground} background surface without any live human present, showcasing intricate gold pearls and gemstone drops. Features ONLY this single uploaded headpiece and NO other jewelry.`;
      } else {
        placementDirective = `The accessory is positioned precisely on its designated display mount (e.g., display stand, tray, or holder), aligning seamlessly with the structure of the display mount inside the ${state.jewelryBackground} environment without any human model or person. Features ONLY this single uploaded accessory and NO other jewelry.`;
      }
    }

    const faceVisibilityInfo = getPoseFaceVisibilityRule(state.jewelryModelPose, "jewelry");

    const jsonPrompt = {
      category: "jewelry",
      export_specifications: exportSpecs,
      product_info: {
        item_type: jCategory,
        type: state.jewelryType,
        detailed_jewelry_description: jewelryFrag,
        item_placement_and_fit: placementDirective
      },
      presentation_setup: {
        mode: state.jewelryPresentation,
        visual_presentation_style: presentationFrag,
        ...(isHumanModel ? {
          model_details: {
            gender: state.jewelryModelGender,
            pose_type: state.jewelryModelPose,
            pose_details: poseDescription,
            camera_framing_and_angle: getCameraFramingAndAngle(state.jewelryModelPose, state.jewelryType, "jewelry"),
            face_visibility_directive: faceVisibilityInfo.description,
            face_description: state.jewelryModelFacePrompt || null,
            default_gender_look: defaultFaceDescription,
            face_reference_purpose_note: "Reference image of human model is for face reference purpose only. Same face identity preserved, but head rotation, body pose, camera angle, and expression are altered according to item type and selected Model Pose / Camera Angle. The model face can be fully shown or partially shown (e.g. cropped at lower face/chin, side profile, or lower body focus) according to the chosen Model Pose / Camera Angle."
          }
        } : {
          bust_details: {
            display_mount_region: state.jewelryBustRegion,
            ...(state.jewelryBustRegion === "naturally" && {
              natural_environmental_fit: "The jewelry item is placed naturally inside the background scene. It rests directly on background elements, absorbs natural ambient light, casts realistic contact shadows, and reflects surrounding environmental colors, surfaces, and textures."
            })
          },
          human_presence: "STRICTLY NONE - NON-HUMAN PRODUCT DISPLAY MODE",
          no_human_directive: "DO NOT GENERATE ANY HUMAN MODEL, PERSON, FACE, BODY PARTS, OR SKIN. Output ONLY the jewelry placed on its background surface or display mount."
        })
      },
      scene_environment: {
        background_style: effectiveJewelryBg,
        background_description: bgFrag,
        background_color_hex: effectiveJewelryBg === "plain" ? getColorHexByName(state.jewelryBgColor) : null,
        background_color_name: effectiveJewelryBg === "plain" ? state.jewelryBgColor : null,
        lighting: state.jewelryBustRegion === "naturally"
          ? "natural ambient environmental lighting harmonized with the scene, soft directional contact shadows on the background surface, physical color bounce, realistic metallic luster matching background highlights"
          : "crisp professional macro jewelry studio lighting, high contrast reflections, flawless metallic sparkle, luxury dark marble highlights"
      },
      artistic_style: {
        theme: state.photoStyle === "editorial" ? "Editorial macro jewelry photography" : "Commercial campaign and advertising jewelry photography",
        photography_style: state.photoStyle,
        style_attributes: isHumanModel
          ? (state.photoStyle === "editorial" 
            ? "Creative storytelling layout, artistic high-fashion model/bust interactions, dramatic close-up focal plays, luxurious vogue editorial framing"
            : "Clean high-contrast promotional campaign lighting, commercial catalog focus, bold showcase of metal luster and gem brilliance, pristine studio look")
          : "Creative storytelling product layout, high-end display stand presentation, dramatic close-up focal plays, luxurious vogue editorial framing",
        quality_level: isHumanModel
          ? "authentic high-jewelry studio photography, intricate sparkling reflections, razor-sharp focus on gemstones, flawless polished metal texture, shot on Hasselblad H6D-100c medium format camera, high-end macro lens, razor-sharp depth of field, natural metal and gemstone lustre, authentic fine details, high-end editorial spread, crisp color-accurate, no artificial CGI glow, no plastic texture, international modeling agency comp card quality, shot on professional full-frame camera, 85mm f/1.4 lens, tack-sharp focus, crisp micro-detail on skin and fabric texture, color-accurate, magazine cover quality, no motion blur, no noise, no artifacts"
          : "authentic high-jewelry studio product photography, intricate sparkling reflections, razor-sharp focus on gemstones, flawless polished metal texture, shot on Hasselblad H6D-100c medium format camera, high-end macro lens, razor-sharp depth of field, natural metal and gemstone lustre, authentic fine details, high-end product editorial spread, crisp color-accurate, no artificial CGI glow, no plastic texture, shot on professional full-frame camera, 85mm f/1.4 lens, tack-sharp focus, crisp micro-detail on jewelry craftsmanship, color-accurate, magazine cover quality, no human model, no skin, no motion blur, no noise, no artifacts"
      },
      fidelity_directives: {
        highest_priority_rule: "EXACT REPLICATION OF INPUT PRODUCT DESIGN, MATERIAL, PATTERNS, LENGTH, AND SIZE REQUIRED",
        auto_detect_material_and_metal_properties: "AUTOMATIC MATERIAL & METAL DETECTION: Automatically analyze and detect the material, metal type, surface finish, and gemstone properties of the uploaded product reference image (such as 22K/18K yellow gold, rose gold, antique matte gold, oxidized silver, sterling silver, platinum, rhodium, Kundan, Meenakari enamel, diamonds, pearls, rubies, emeralds, or glass beads), including its metallic luster, surface texture, opacity, and gemstone brilliance, and apply the exact same material properties to the generated output product.",
        single_item_isolation_rule: "STRICTLY NO OTHER JEWELRY ITEMS GENERATED EXCEPT UPLOADED INPUT ITEM",
        jewelry_open_closed_loop_rule: "Observe the jewelry first and determine whether it is closed or intentionally open. Keep the original design: do not close an open jewelry loop or open a closed one",
        single_item_instruction: `CRITICAL SINGLE ITEM DIRECTIVE: The final generated image MUST ONLY feature the exact uploaded input jewelry item (${jCategory} / ${state.jewelryType}). DO NOT generate, add, or synthesize ANY other jewelry items, ornaments, or accessories that were NOT present in the input reference image. For example, if the user uploaded a necklace, DO NOT add unrequested earrings, nose rings, bangles, rings, or maang tikka to the model or display; if the user uploaded earrings, DO NOT add an unrequested necklace or head ornaments; if the user uploaded a ring, DO NOT add unrequested bracelets or necklaces. The model's skin, ears, neck, wrists, fingers, nose, forehead, hair, and clothing must remain COMPLETELY BARE and devoid of any secondary or unuploaded jewelry.`,
        core_instruction: "The final AI-generated image must EXACTLY REPLICATE and reproduce the input product (jewelry) shown in the reference image. Automatically detect and analyze the item's exact material, metal composition, polish, and gemstone properties, applying the same material characteristics to the generated output. The design, gemstone settings, intricate patterns, chain length, piece dimensions, physical size, and craftsmanship features must be 100% faithful and identical to the uploaded item. Do not generate a creative, inspired, redesigned, modified, or re-proportioned version of the product.",
        input_image_guideline: "The input image is the authentic reference of the jewelry product. Automatically detect and replicate its exact material/metal properties, design, pattern details, chain/necklace length, gemstone sizes, and overall dimensions precisely.",
        mandatory_replications: dynamicMandatory || [
          "Automatic detection and 1:1 application of the uploaded product's exact material/metal/gemstone properties (metal type, polish, surface texture, finish, metallic luster, gemstone brilliance, and transparency)",
          "Observe the jewelry first and determine whether it is closed or intentionally open. Keep the original design: do not close an open jewelry loop or open a closed one",
          "Strict 1:1 single-item focus: generate ONLY the uploaded input jewelry item (or exact pair if uploaded as a pair of earrings/bangles). Absolutely NO additional or unrequested jewelry items (no extra necklaces, earrings, rings, nose pins, waist chains, or headpieces) on the model or display stand",
          "Exact product design, motif work, filigree, engraving, and intricate metal/stone patterns replicated 1:1",
          "Exact length, drop length, thickness, and dimensions of the jewelry piece (e.g., choker vs long haram necklace, drop earring length)",
          "Exact gemstone, diamond, and pearl size, count, cut, arrangement, color, and setting style",
          "Exact metal type, color, finish (matte, high-polish, antique gold, rhodium, platinum) and reflective shine",
          "Exact chain link pattern, clasp, hooks, hanging pearls, beads, or charm drops",
          "Exact scale, proportions, thickness, and physical size relative to the body or display bust",
          "Facets, light reflection, luster, and authentic raw material craftsmanship details"
        ]
      },
      exclusion_directives: {
        highest_priority_exclusion_rule: "STRICTLY NO PRICE TAGS, HANGTAGS, BRAND TAGS, COMPANY LOGOS, OR TEXT OVERLAYS",
        strict_no_extra_jewelry_rule: "STRICTLY PROHIBIT GENERATING UNREQUESTED SECONDARY JEWELRY",
        strict_no_extra_jewelry_instruction: "DO NOT add any extra jewelry pieces, accessories, or complementary ornaments. Only render the single uploaded product (or pair). The model's skin, ears, neck, wrists, fingers, nose, forehead, hair, and clothing must remain completely bare and free of any other unrequested jewelry or accessories.",
        instruction: "The output image must be a clean, pristine studio jewelry photograph completely FREE of price tags, store price stickers, barcode tags, paper hangtags, security tags, brand labels, company logos, store tags, watermarks, text labels, sale badges, or graphic overlays anywhere on the jewelry, display mount, or background. If the input reference image has any visible price tag, hanging paper tag, barcode sticker, or brand label attached to the product, digitally remove and omit it entirely, rendering the item clean and pristine.",
        ...(dynamicProhibitions && dynamicProhibitions.length > 0 ? { system_negative_exclusions: dynamicProhibitions } : {}),
        ...(state.jewelryPresentation === "no_face" && {
          strict_no_face_rule: "STRICTLY NO HUMAN FACE FEATURES AND PRIMARY FOCUS ON JEWELRY ITEM",
          strict_no_face_instruction: "CRITICAL: This is a Human Model (No Face) presentation mode. The camera MUST BE TIGHTLY FOCUSED ON THE JEWELRY ITEM ITSELF as the primary hero subject, with razor-sharp macro detail on the product. The human model body/skin serves only as a natural background canvas. The human face MUST BE STRICTLY CROPPED OUT of the frame, turned completely away, or headless. DO NOT generate human eyes, nose, lips, or full facial features."
        }),
        ...(state.jewelryPresentation === "body_part" && {
          strict_no_face_rule: "BODY PART CLOSE-UP MODE - NO HUMAN FACE OR FACE REFERENCE",
          strict_no_face_instruction: "CRITICAL: This is a Body Part Close-Up presentation mode. Focus the image strictly as a close-up shot of the jewelry item placed on the human body part (e.g. neck, earlobe, wrist, finger, waist, nose, or ankle according to selected pose). DO NOT generate any human face, facial features, head, or face reference. The body part skin serves purely as an organic natural backdrop for the jewelry item."
        }),
        ...(!isHumanModel && {
          strict_no_human_rule: "STRICTLY NO LIVE HUMAN MODEL, NO PERSON, NO HUMAN FACE, NO LIVE SKIN",
          strict_no_human_instruction: `CRITICAL: This is a NON-HUMAN product display presentation mode (${state.jewelryPresentation} / ${state.jewelryBustRegion}). There must be STRICTLY NO LIVE HUMAN BEING, NO LIVE MODEL, NO PERSON, NO HUMAN FACE, NO HEAD, NO EYES, NO EAR, NO NECK, NO LIVE HANDS, NO LEGS, NO LIVE SKIN anywhere in the final output image. Render ONLY the jewelry item placed naturally or mounted on its display stand / surface / mannequin holder (such as a porcelain or velvet mannequin hand, neck bust, or stand). The background and scene must be 100% live-human-free.`
        })
      },
      ...(isHumanModel && {
        model_expression_directive: state.photoStyle === "campaign" ? {
          highest_priority_expression_rule: "COMMERCIAL CAMPAIGN CONFIDENT EXPRESSION",
          instruction: "The model must have a warm, confident, approachable commercial expression suitable for advertising campaigns — a soft smile or gentle closed-mouth smile, poised and polished, like an international modeling agency campaign face. Avoid overly serious, cold, or moody editorial expressions."
        } : {
          highest_priority_expression_rule: "HIGH-FASHION EDITORIAL NEUTRAL EXPRESSION",
          instruction: "The model must have a neutral, serious, high-fashion editorial expression. Never smiling. Calm, poised, intense gaze, like international runway/editorial models."
        }
      }),
      ...(isHumanModel && state.hasFaceRef && {
        face_matching_directive: {
          highest_priority_rule: dynamicFidelitySettings?.highest_priority_face_rule || "100% IDENTICAL FACE IDENTITY REPLICATION MANDATE - ZERO DRIFT, EXACT SAME PERSON",
          instruction: dynamicFaceRules?.face_fidelity_instruction || "CRITICAL 100% FACE IDENTITY PRESERVATION: The reference image of the human model (second uploaded image) is for the authoritative human model exact face identity reference. You MUST replicate 100% of this specific person's facial features with complete photographic fidelity. Maintain identical facial bone structure, jawline, eye contours, iris color, eyelid shape, eyebrow arches, nose bridge and tip proportions, philtrum, lip shape and volume, skin undertone, natural melanin, and facial landmarks without beautification or alteration. Strictly ZERO facial morphing, ZERO generic face substitution, and ZERO face blending. While the head orientation, gaze direction, body posture, and lighting naturally adjust to match the chosen pose and jewelry presentation, the identity MUST remain 100% recognizably and unmistakably the EXACT same person as in the reference photo.",
          face_visibility_mode: state.jewelryPresentation === "partial_face" ? "PARTIAL_FACE_MACRO_CLOSEUP" : "FULL_FACE_PORTRAIT",
          fidelity_directive: "100% IDENTICAL BONE STRUCTURE, EYES, NOSE, LIPS, AND COMPLEXION",
          ...(dynamicFaceMandatory ? { mandatory_face_replications: dynamicFaceMandatory } : {})
        }
      })
    };

    return JSON.stringify(jsonPrompt, null, 2);
  }
}

export const IMAGE_MODELS = [
  { 
    id: "gpt_image_2_5_sunburst", 
    provider: "openai", 
    name: "OpenAI GPT-Image-2.5 Sunburst (gpt-image-2.5-sunburst)", 
    price: 0.08, 
    unit: "image", 
    desc: "OpenAI flagship high-fidelity studio image synthesis & editing model with exceptional photorealism, texture preservation & precise composition control" 
  }
];

export const IMAGE_RESOLUTIONS = [
  { id: "1k", name: "1024 x 1024 px (Standard HD)", multiplier: 1.0, labelEn: "1024 x 1024 px (Standard HD)", labelTe: "1024 x 1024 పిక్సెల్స్ (స్టాండర్డ్ HD)" },
  { id: "2k", name: "2048 x 2048 px (Ultra HD / 2K)", multiplier: 1.6, labelEn: "2048 x 2048 px (Ultra HD / 2K)", labelTe: "2048 x 2048 పిక్సెల్స్ (అల్ట్రా HD / 2K)" },
  { id: "4k", name: "4096 x 4096 px (Super Resolution / 4K)", multiplier: 2.6, labelEn: "4096 x 4096 px (Super Resolution / 4K)", labelTe: "4096 x 4096 పిక్సెల్స్ (సూపర్ రెజల్యూషన్ / 4K)" },
];

export const GPT_IMAGE_2_5_SUNBURST_RESOLUTIONS = [
  { id: "1024x1024", name: "1024 x 1024 px (1K Square)", multiplier: 1.0, labelEn: "1024 x 1024 px (1K Square)", labelTe: "1024 x 1024 పిక్సెల్స్ (1K స్క్వేర్)" },
  { id: "1536x1024", name: "1536 x 1024 px (1K Landscape)", multiplier: 1.0, labelEn: "1536 x 1024 px (1K Landscape)", labelTe: "1536 x 1024 పిక్సెల్స్ (1K ల్యాండ్‌స్కేప్)" },
  { id: "1024x1536", name: "1024 x 1536 px (1K Portrait)", multiplier: 1.0, labelEn: "1024 x 1536 px (1K Portrait)", labelTe: "1024 x 1536 పిక్సెల్స్ (1K పోర్ట్రెయిట్)" },
  { id: "2048x2048", name: "2048 x 2048 px (2K Square)", multiplier: 1.5, labelEn: "2048 x 2048 px (2K Square)", labelTe: "2048 x 2048 పిక్సెల్స్ (2K స్క్వేర్)" },
  { id: "2048x1152", name: "2048 x 1152 px (2K Landscape)", multiplier: 1.5, labelEn: "2048 x 1152 px (2K Landscape)", labelTe: "2048 x 1152 పిక్సెల్స్ (2K ల్యాండ్‌స్కేప్)" },
  { id: "1152x2048", name: "1152 x 2048 px (2K Portrait)", multiplier: 1.5, labelEn: "1152 x 2048 px (2K Portrait)", labelTe: "1152 x 2048 పిక్సెల్స్ (2K పోర్ట్రెయిట్)" },
  { id: "3840x2160", name: "3840 x 2160 px (4K Landscape)", multiplier: 2.0, labelEn: "3840 x 2160 px (4K Landscape)", labelTe: "3840 x 2160 పిక్సెల్స్ (4K ల్యాండ్‌స్కేప్)" },
  { id: "2160x3840", name: "2160 x 3840 px (4K Portrait)", multiplier: 2.0, labelEn: "2160 x 3840 px (4K Portrait)", labelTe: "2160 x 3840 పిక్సెల్స్ (4K పోర్ట్రెయిట్)" },
  { id: "3840x3840", name: "3840 x 3840 px (4K Square)", multiplier: 2.0, labelEn: "3840 x 3840 px (4K Square)", labelTe: "3840 x 3840 పిక్సెల్స్ (4K స్క్వేర్)" },
];

export const GPTIMAGE2_RESOLUTIONS = GPT_IMAGE_2_5_SUNBURST_RESOLUTIONS;

export const GPT_IMAGE_2_5_SUNBURST_PRICING_MATRIX = {
  low: {
    "1024x1024": 0.006,
    "1024x1536": 0.005,
    "1536x1024": 0.005,
  },
  medium: {
    "1024x1024": 0.053,
    "1024x1536": 0.041,
    "1536x1024": 0.041,
  },
  high: {
    "1024x1024": 0.211,
    "1024x1536": 0.165,
    "1536x1024": 0.165,
  }
};

export const GPTIMAGE2_PRICING_MATRIX = GPT_IMAGE_2_5_SUNBURST_PRICING_MATRIX;

export const getGptImageSizeString = (resolutionId: string, aspectRatio: string = "1:1"): string => {
  if (
    resolutionId === "1024x1024" || resolutionId === "1536x1024" || resolutionId === "1024x1536" ||
    resolutionId === "2048x2048" || resolutionId === "2048x1152" || resolutionId === "1152x2048" ||
    resolutionId === "3840x2160" || resolutionId === "2160x3840" || resolutionId === "3840x3840"
  ) {
    return resolutionId;
  }

  const isPortrait = aspectRatio === "3:4" || aspectRatio === "9:16" || aspectRatio === "2:3";
  const isLandscape = aspectRatio === "4:3" || aspectRatio === "16:9" || aspectRatio === "3:2";

  if (resolutionId === "2k") {
    if (isPortrait) return "1152x2048";
    if (isLandscape) return "2048x1152";
    return "2048x2048";
  }
  if (resolutionId === "4k") {
    if (isPortrait) return "2160x3840";
    if (isLandscape) return "3840x2160";
    return "3840x3840";
  }
  // Default 1k
  if (isPortrait) return "1024x1536";
  if (isLandscape) return "1536x1024";
  return "1024x1024";
};

export const getGptImage2SizeString = getGptImageSizeString;

export const getImagePrice = (
  modelId: string, 
  resolutionId: string, 
  quality: string = "low",
  aspectRatio: string = "1:1"
): number => {
  // Disable 4K export resolution for 1:1 image orientation across all models
  if (aspectRatio === "1:1" && (resolutionId === "4k" || resolutionId === "3840x3840" || resolutionId === "4096px")) {
    return 0;
  }

  if (modelId === "gpt_image_2_5_sunburst" || modelId === "gptimage_2" || modelId === "gpt-image-2.5-sunburst") {
    let multiplier = 1;

    if (resolutionId === "2k" || resolutionId === "2048x2048" || resolutionId === "2048x1152" || resolutionId === "1152x2048") {
      multiplier = 1.5;
    } else if (resolutionId === "4k" || resolutionId === "3840x2160" || resolutionId === "2160x3840" || resolutionId === "3840x3840") {
      multiplier = 2;
    }

    let dimKey: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024";

    if (resolutionId === "1024x1536" || resolutionId === "1152x2048" || resolutionId === "2160x3840") {
      dimKey = "1024x1536";
    } else if (resolutionId === "1536x1024" || resolutionId === "2048x1152" || resolutionId === "3840x2160") {
      dimKey = "1536x1024";
    } else if (resolutionId === "1024x1024" || resolutionId === "2048x2048" || resolutionId === "3840x3840") {
      dimKey = "1024x1024";
    } else {
      if (aspectRatio === "3:4" || aspectRatio === "9:16" || aspectRatio === "2:3") dimKey = "1024x1536";
      else if (aspectRatio === "4:3" || aspectRatio === "16:9" || aspectRatio === "3:2") dimKey = "1536x1024";
      else dimKey = "1024x1024";
    }

    const q = (quality === "medium" || quality === "high") ? quality : "low";
    const base1kPrice = GPT_IMAGE_2_5_SUNBURST_PRICING_MATRIX[q][dimKey];
    return base1kPrice * multiplier;
  }

  // Fallback to base model price * resolution multiplier
  const modelObj = IMAGE_MODELS.find(m => m.id === modelId) || IMAGE_MODELS[0];
  const resObj = IMAGE_RESOLUTIONS.find(r => r.id === resolutionId) || IMAGE_RESOLUTIONS[1];
  return modelObj.price * resObj.multiplier;
};

export function formatPrice(
  amountInUSD: number,
  currency: string = "USD",
  usdToInrRate: number = 83.5,
  decimals?: number
): string {
  if (amountInUSD === 0 || isNaN(amountInUSD)) return "N/A";
  if (currency === "INR") {
    const inrValue = amountInUSD * usdToInrRate;
    let dec = decimals;
    if (dec === undefined) {
      dec = inrValue < 1 ? 2 : inrValue < 100 ? 2 : 2;
    }
    return `₹${inrValue.toFixed(dec)}`;
  } else {
    let dec = decimals;
    if (dec === undefined) {
      dec = amountInUSD < 0.01 ? 4 : amountInUSD < 0.1 ? 3 : 2;
    }
    return `$${amountInUSD.toFixed(dec)}`;
  }
}
