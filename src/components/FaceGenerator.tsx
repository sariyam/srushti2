import React, { useRef } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";


const Smile = (props: any) => <Icon icon="lucide:smile" {...props} />;
const Check = (props: any) => <Icon icon="lucide:check" {...props} />;
const Plus = (props: any) => <Icon icon="lucide:plus" {...props} />;
const UserIcon = (props: any) => <Icon icon="lucide:user" {...props} />;
const ChevronLeft = (props: any) => <Icon icon="lucide:chevron-left" {...props} />;
const ChevronRight = (props: any) => <Icon icon="lucide:chevron-right" {...props} />;

export interface ModelFace {
  id: string;
  nameEn: string;
  nameTe: string;
  gender: "female" | "male";
  prompt: string;
  url: string;
  fallbackUrl?: string;
  category: "indian" | "african" | "asian" | "western" | "mideast" | "latina" | "custom";
  isCustom?: boolean;
}

export const DEFAULT_AVATAR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e11d48' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

export const FALLBACK_UNSPLASH_MAP: Record<string, string> = {
  indian_f: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80",
  indian_f2: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  editorial_f: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
  indian_f4: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
  indian_f5: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=300&q=80",
  indian_f6: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",

  indian_m: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  indian_m2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  editorial_m: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
  indian_m4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  indian_m5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  indian_m6: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80",

  african_f: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
  african_f2: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=300&q=80",
  african_f3: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&w=300&q=80",
  african_f4: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  african_f5: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
  african_f6: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",

  african_m: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  african_m2: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=300&q=80",
  african_m3: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=300&q=80",
  african_m4: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  african_m5: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
  african_m6: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",

  korean_f: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  asian_f2: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  asian_f3: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  asian_f4: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  asian_f5: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  asian_f6: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",

  korean_m: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  asian_m2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  asian_m3: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
  asian_m4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  asian_m5: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  asian_m6: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80",

  usa_f: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  nordic_f: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  western_f3: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  western_f4: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  western_f5: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  western_f6: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",

  usa_m: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  nordic_m: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  western_m3: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
  western_m4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  western_m5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  western_m6: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80",

  mideast_f: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  mideast_f2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  mideast_f3: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
  mideast_f4: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=300&q=80",
  mideast_f5: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  mideast_f6: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",

  mideast_m: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  mideast_m2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  mideast_m3: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
  mideast_m4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  mideast_m5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  mideast_m6: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80",

  latina_f: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  latina_f2: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  latina_f3: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  latina_f4: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  latina_f5: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
  latina_f6: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",

  latino_m: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  latina_m2: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  latina_m3: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
  latina_m4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  latina_m5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  latina_m6: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80"
};

// Highly curated studio human model closeup headshots loaded directly from embedded Base64 strings or high quality studio photos
const RAW_PRESET_FACES: Omit<ModelFace, "url">[] = [
  // --- INDIAN FEMALE (6 Faces) ---
  {
    id: "indian_f",
    nameEn: "Ananya",
    nameTe: "అనన్య",
    gender: "female",
    category: "indian",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a beautiful Indian female model with a soft, warm commercial smile, bright expressive dark eyes, glowing smooth skin, looking directly at the camera, solid neutral light studio background, face fully visible with no hair or accessories covering facial features"
  },
  {
    id: "indian_f2",
    nameEn: "Priya",
    nameTe: "ప్రియా",
    gender: "female",
    category: "indian",
    prompt: "a professional, ultra-high-resolution studio portrait headshot of an elegant South Indian female model with regal features, soft natural expression, radiant complexion, looking directly at camera with clear eye contact, neutral clean background, face unobscured"
  },
  {
    id: "editorial_f",
    nameEn: "Meera",
    nameTe: "మీరా",
    gender: "female",
    category: "indian",
    prompt: "an ultra-high-resolution close-up high-fashion editorial studio portrait of a striking Indian female model with intense gaze, razor-sharp jawline, glowing flawless skin, elegant facial symmetry, soft studio rim light, minimalist grey backdrop"
  },
  {
    id: "indian_f4",
    nameEn: "Kavya",
    nameTe: "కావ్య",
    gender: "female",
    category: "indian",
    prompt: "a professional ultra-high-resolution close-up studio headshot of a charming North Indian female model with gentle smile, expressive eyes, warm skin tone, clean studio backdrop"
  },
  {
    id: "indian_f5",
    nameEn: "Diya",
    nameTe: "దియా",
    gender: "female",
    category: "indian",
    prompt: "a studio portrait of a glamorous Indian female fashion model with radiant smile, glossy hair, flawless complexion, professional rim lighting, neutral studio background"
  },
  {
    id: "indian_f6",
    nameEn: "Pooja",
    nameTe: "పూజ",
    gender: "female",
    category: "indian",
    prompt: "a close-up headshot of a confident modern Indian female model, soft natural studio lighting, direct eye contact, clean solid backdrop"
  },

  // --- INDIAN MALE (6 Faces) ---
  {
    id: "indian_m",
    nameEn: "Rohan",
    nameTe: "రోహన్",
    gender: "male",
    category: "indian",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a handsome Indian male model, looking directly at the camera with a confident, friendly expression, neatly groomed stubble, sharp features, even studio lighting, solid neutral background"
  },
  {
    id: "indian_m2",
    nameEn: "Arjun",
    nameTe: "అర్జున్",
    gender: "male",
    category: "indian",
    prompt: "a professional, ultra-high-resolution studio headshot of a charming South Asian male model, clear eye contact, gentle confident expression, sharp jawline, clean professional lighting, solid grey studio background"
  },
  {
    id: "editorial_m",
    nameEn: "Vikram",
    nameTe: "విక్రమ్",
    gender: "male",
    category: "indian",
    prompt: "an ultra-high-resolution close-up studio headshot of a sharp male fashion model, sculpted jawline, intense focused gaze, subtle beard, crisp lighting contrast, high-end commercial model portfolio photo"
  },
  {
    id: "indian_m4",
    nameEn: "Aaditya",
    nameTe: "ఆదిత్య",
    gender: "male",
    category: "indian",
    prompt: "a studio headshot of a handsome young Indian male model with well-defined jawline, confident warm smile, studio softbox lighting, clean grey backdrop"
  },
  {
    id: "indian_m5",
    nameEn: "Kabir",
    nameTe: "కబీర్",
    gender: "male",
    category: "indian",
    prompt: "a close-up portrait of an attractive South Indian male model, groomed facial hair, warm expression, direct gaze, neutral studio setting"
  },
  {
    id: "indian_m6",
    nameEn: "Suresh",
    nameTe: "సురేష్",
    gender: "male",
    category: "indian",
    prompt: "a commercial portrait headshot of a South Indian male model with charismatic smile, sharp clear features, studio portrait illumination"
  },

  // --- AFRICAN FEMALE (6 Faces) ---
  {
    id: "african_f",
    nameEn: "Amara",
    nameTe: "అమరా",
    gender: "female",
    category: "african",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a stunning African female model with smooth clear dark skin, radiant warm smile, sharp high cheekbones, looking directly at camera, soft studio lighting, clean background, face unobscured"
  },
  {
    id: "african_f2",
    nameEn: "Zuri",
    nameTe: "జూరి",
    gender: "female",
    category: "african",
    prompt: "an editorial fashion studio portrait of a regal African female model with glowing melanin skin, intense expressive eyes, elegant posture, soft key lighting, minimal grey backdrop"
  },
  {
    id: "african_f3",
    nameEn: "Nia",
    nameTe: "నియా",
    gender: "female",
    category: "african",
    prompt: "a close-up studio portrait of a beautiful West African female model with natural smile, flawless dark skin tone, clear gaze, balanced key light"
  },
  {
    id: "african_f4",
    nameEn: "Aaliyah",
    nameTe: "ఆలియా",
    gender: "female",
    category: "african",
    prompt: "a high-resolution studio face portrait of a glamorous African female model, bright confident eyes, smooth skin tone, professional studio flash"
  },
  {
    id: "african_f5",
    nameEn: "Fatoumata",
    nameTe: "ఫాతుమాతా",
    gender: "female",
    category: "african",
    prompt: "a studio headshot of an African fashion model with vibrant smile, delicate features, clean neutral backdrop, soft studio fill"
  },
  {
    id: "african_f6",
    nameEn: "Binta",
    nameTe: "బింటా",
    gender: "female",
    category: "african",
    prompt: "a close-up commercial studio face shot of an East African female model with warm smile, radiant skin, looking straight into lens"
  },

  // --- AFRICAN MALE (6 Faces) ---
  {
    id: "african_m",
    nameEn: "Kwame",
    nameTe: "క్వామే",
    gender: "male",
    category: "african",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a handsome African male model, looking directly at camera with a warm confident expression, smooth dark skin, sharp features, even studio lighting, solid neutral background"
  },
  {
    id: "african_m2",
    nameEn: "Malik",
    nameTe: "మాలిక్",
    gender: "male",
    category: "african",
    prompt: "an editorial fashion studio headshot of a handsome African male model with sculpted jawline, intense eyes, subtle stubble, clean studio rim light"
  },
  {
    id: "african_m3",
    nameEn: "Zain",
    nameTe: "జైన్",
    gender: "male",
    category: "african",
    prompt: "a close-up portrait shot of an attractive Black male model with friendly smile, warm dark skin tone, direct gaze, solid grey studio setting"
  },
  {
    id: "african_m4",
    nameEn: "Tariq",
    nameTe: "తారిఖ్",
    gender: "male",
    category: "african",
    prompt: "a studio commercial headshot of a Black male model with confident expression, clean shave, sharp facial symmetry, professional key light"
  },
  {
    id: "african_m5",
    nameEn: "Kofi",
    nameTe: "కోఫీ",
    gender: "male",
    category: "african",
    prompt: "a close-up portrait of an African male fashion model, charming smile, sharp cheekbones, studio illumination, clean neutral background"
  },
  {
    id: "african_m6",
    nameEn: "Oumar",
    nameTe: "ఒమర్",
    gender: "male",
    category: "african",
    prompt: "a studio headshot of a strong Black male model with focused gaze, clean facial features, soft directional key lighting"
  },

  // --- EAST ASIAN FEMALE (6 Faces) ---
  {
    id: "korean_f",
    nameEn: "Soo-Jin",
    nameTe: "సూ-జిన్",
    gender: "female",
    category: "asian",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Korean female model with flawless glass skin, looking directly at camera with a polite soft smile, sharp clean features, even studio lighting, solid light neutral background"
  },
  {
    id: "asian_f2",
    nameEn: "Mei-Ling",
    nameTe: "మేయ్-లింగ్",
    gender: "female",
    category: "asian",
    prompt: "an editorial studio portrait of a Chinese female fashion model with razor-sharp cheekbones, intense gaze, flawless Porcelain complexion, minimal backdrop"
  },
  {
    id: "asian_f3",
    nameEn: "Yoko",
    nameTe: "యోకో",
    gender: "female",
    category: "asian",
    prompt: "a studio face portrait of a Japanese female model with gentle serene smile, smooth skin, clear dark eyes, soft studio illumination"
  },
  {
    id: "asian_f4",
    nameEn: "Linh",
    nameTe: "లిన్",
    gender: "female",
    category: "asian",
    prompt: "a close-up studio headshot of a Vietnamese female model with radiant complexion, confident open smile, softbox lighting, clean grey setting"
  },
  {
    id: "asian_f5",
    nameEn: "Ji-Eun",
    nameTe: "జి-ఇయున్",
    gender: "female",
    category: "asian",
    prompt: "a commercial face shot of a young East Asian female model with luminous skin, subtle makeup, direct camera contact, even studio light"
  },
  {
    id: "asian_f6",
    nameEn: "Chen",
    nameTe: "చెన్",
    gender: "female",
    category: "asian",
    prompt: "a high-fashion close-up headshot of an East Asian model with delicate features, elegant pose, clean studio key illumination"
  },

  // --- EAST ASIAN MALE (6 Faces) ---
  {
    id: "korean_m",
    nameEn: "Min-Ho",
    nameTe: "మిన్-హో",
    gender: "male",
    category: "asian",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a handsome Korean male model, looking directly at camera with a clean confident expression, sharp features, even studio lighting, solid neutral background"
  },
  {
    id: "asian_m2",
    nameEn: "Kenji",
    nameTe: "కెంజి",
    gender: "male",
    category: "asian",
    prompt: "an editorial fashion studio headshot of a Japanese male model with sharp jawline, stylish hairstyle, focused gaze, subtle rim lighting"
  },
  {
    id: "asian_m3",
    nameEn: "Wei",
    nameTe: "వేయ్",
    gender: "male",
    category: "asian",
    prompt: "a studio face portrait of a handsome East Asian male model with clear skin, polite confident smile, balanced key studio lighting"
  },
  {
    id: "asian_m4",
    nameEn: "Sang-Woo",
    nameTe: "సాంగ్-వూ",
    gender: "male",
    category: "asian",
    prompt: "a close-up portrait of a Korean male fashion model with sleek hairstyle, sharp eye contact, minimalist grey studio background"
  },
  {
    id: "asian_m5",
    nameEn: "Hiroshi",
    nameTe: "హిరోషి",
    gender: "male",
    category: "asian",
    prompt: "a commercial face headshot of an East Asian male model with warm expression, sharp jawline, professional flash illumination"
  },
  {
    id: "asian_m6",
    nameEn: "Bao",
    nameTe: "బావో",
    gender: "male",
    category: "asian",
    prompt: "a close-up studio face photo of a young East Asian male model with clean flawless features, looking directly into lens"
  },

  // --- WESTERN / EU FEMALE (6 Faces) ---
  {
    id: "usa_f",
    nameEn: "Sophia",
    nameTe: "సోఫియా",
    gender: "female",
    category: "western",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Caucasian female model with natural friendly expression, bright sharp eyes, soft even commercial lighting, solid light grey background, face fully visible with clear features"
  },
  {
    id: "nordic_f",
    nameEn: "Freja",
    nameTe: "ఫ్రెజా",
    gender: "female",
    category: "western",
    prompt: "a professional ultra-high-resolution close-up studio headshot of a fair European female model with serene expression, clear blue eyes, delicate features, clean balanced studio light, neutral backdrop"
  },
  {
    id: "western_f3",
    nameEn: "Emma",
    nameTe: "ఎమ్మా",
    gender: "female",
    category: "western",
    prompt: "a high-fashion editorial studio headshot of a European female model with radiant blonde hair, bright blue eyes, soft studio illumination"
  },
  {
    id: "western_f4",
    nameEn: "Charlotte",
    nameTe: "షార్లెట్",
    gender: "female",
    category: "western",
    prompt: "a studio commercial portrait of an attractive Western female model with warm smile, hazel eyes, smooth skin tone, clean backdrop"
  },
  {
    id: "western_f5",
    nameEn: "Chloe",
    nameTe: "క్లోయి",
    gender: "female",
    category: "western",
    prompt: "a close-up fashion portrait of a Caucasian female model with sculpted jawline, intense clear gaze, soft directional light"
  },
  {
    id: "western_f6",
    nameEn: "Hannah",
    nameTe: "హన్నా",
    gender: "female",
    category: "western",
    prompt: "a commercial face shot of a young Western female model with charismatic smile, bright eyes, professional studio flash"
  },

  // --- WESTERN / EU MALE (6 Faces) ---
  {
    id: "usa_m",
    nameEn: "Ethan",
    nameTe: "ఈథన్",
    gender: "male",
    category: "western",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Caucasian male model, looking directly at camera with a friendly approachable expression, sharp eyes, even professional lighting, solid neutral background"
  },
  {
    id: "nordic_m",
    nameEn: "Lucas",
    nameTe: "లూకాస్",
    gender: "male",
    category: "western",
    prompt: "a professional ultra-high-resolution close-up studio headshot of a fair European male model, direct gaze into camera, clean natural look, soft studio key light, neutral solid background"
  },
  {
    id: "western_m3",
    nameEn: "Alexander",
    nameTe: "అలెక్సాండర్",
    gender: "male",
    category: "western",
    prompt: "an editorial fashion studio headshot of a Caucasian male model with strong jawline, blue eyes, groomed hair, clean grey backdrop"
  },
  {
    id: "western_m4",
    nameEn: "Liam",
    nameTe: "లియామ్",
    gender: "male",
    category: "western",
    prompt: "a close-up portrait of an attractive Western male model with confident smile, sharp facial features, studio flash lighting"
  },
  {
    id: "western_m5",
    nameEn: "Oliver",
    nameTe: "ఓలివర్",
    gender: "male",
    category: "western",
    prompt: "a studio commercial headshot of a European male model with light stubble, focused direct gaze, soft key light"
  },
  {
    id: "western_m6",
    nameEn: "Daniel",
    nameTe: "డానియెల్",
    gender: "male",
    category: "western",
    prompt: "a close-up studio portrait of a young Caucasian male model with friendly approachable gaze, clear skin, neutral background"
  },

  // --- MIDDLE EAST FEMALE (6 Faces) ---
  {
    id: "mideast_f",
    nameEn: "Layla",
    nameTe: "లైలా",
    gender: "female",
    category: "mideast",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Middle Eastern female model with big dark expressive eyes, warm gentle expression, clear studio lighting, solid background, unobscured face"
  },
  {
    id: "mideast_f2",
    nameEn: "Noor",
    nameTe: "నూర్",
    gender: "female",
    category: "mideast",
    prompt: "an editorial studio portrait of a regal Middle Eastern female model with captivating dark eyes, olive complexion, elegant facial symmetry"
  },
  {
    id: "mideast_f3",
    nameEn: "Yasmin",
    nameTe: "యాస్మిన్",
    gender: "female",
    category: "mideast",
    prompt: "a studio face portrait of a beautiful Arab female model with soft warm smile, expressive dark eyes, flawless smooth skin, studio key light"
  },
  {
    id: "mideast_f4",
    nameEn: "Farah",
    nameTe: "ఫరా",
    gender: "female",
    category: "mideast",
    prompt: "a close-up studio headshot of a glamorous Middle Eastern female model with luminous complexion, soft rim light, clean grey setting"
  },
  {
    id: "mideast_f5",
    nameEn: "Mariam",
    nameTe: "మరియం",
    gender: "female",
    category: "mideast",
    prompt: "a commercial face shot of a young Middle Eastern female model with gentle smile, clear eye contact, studio flash illumination"
  },
  {
    id: "mideast_f6",
    nameEn: "Zeina",
    nameTe: "జైనా",
    gender: "female",
    category: "mideast",
    prompt: "a close-up portrait headshot of an Arab model with striking facial features, elegant posture, balanced studio flash"
  },

  // --- MIDDLE EAST MALE (6 Faces) ---
  {
    id: "mideast_m",
    nameEn: "Tariq",
    nameTe: "తారిఖ్",
    gender: "male",
    category: "mideast",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Middle Eastern male model, looking directly at camera with a confident expression, neat beard, sharp eyes, even lighting, solid background"
  },
  {
    id: "mideast_m2",
    nameEn: "Omar",
    nameTe: "ఒమర్",
    gender: "male",
    category: "mideast",
    prompt: "an editorial studio headshot of a handsome Middle Eastern male model with neatly groomed beard, intense gaze, sculpted jawline, grey backdrop"
  },
  {
    id: "mideast_m3",
    nameEn: "Zayd",
    nameTe: "జైద్",
    gender: "male",
    category: "mideast",
    prompt: "a close-up face portrait of an Arab male fashion model with polite smile, warm skin tone, sharp eye contact, studio setting"
  },
  {
    id: "mideast_m4",
    nameEn: "Amir",
    nameTe: "అమీర్",
    gender: "male",
    category: "mideast",
    prompt: "a commercial headshot of a Middle Eastern male model with confident pose, groomed facial hair, professional key illumination"
  },
  {
    id: "mideast_m5",
    nameEn: "Hassan",
    nameTe: "హసన్",
    gender: "male",
    category: "mideast",
    prompt: "a close-up studio headshot of an attractive Middle Eastern male model with charming smile, sharp jawline, directional softbox flash"
  },
  {
    id: "mideast_m6",
    nameEn: "Youssef",
    nameTe: "యూసఫ్",
    gender: "male",
    category: "mideast",
    prompt: "a studio portrait of a young Arab male model with clear skin, natural posture, looking directly into camera lens"
  },

  // --- LATINA FEMALE (6 Faces) ---
  {
    id: "latina_f",
    nameEn: "Isabella",
    nameTe: "ఇసబెల్లా",
    gender: "female",
    category: "latina",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Latina female model with warm golden skin tone, confident friendly expression, clear dark eyes, soft studio illumination, clean backdrop"
  },
  {
    id: "latina_f2",
    nameEn: "Camila",
    nameTe: "కామిలా",
    gender: "female",
    category: "latina",
    prompt: "an editorial fashion portrait of a stunning Latina female model with glowing bronzed skin, bright dark eyes, radiant smile, studio flash"
  },
  {
    id: "latina_f3",
    nameEn: "Sofia",
    nameTe: "సోఫియా",
    gender: "female",
    category: "latina",
    prompt: "a close-up studio headshot of a Hispanic female model with razor-sharp cheekbones, intense gaze, smooth complexion, minimal backdrop"
  },
  {
    id: "latina_f4",
    nameEn: "Valentina",
    nameTe: "వాలెంటినా",
    gender: "female",
    category: "latina",
    prompt: "a commercial face shot of a young Latina female model with charismatic smile, golden skin tone, professional softbox illumination"
  },
  {
    id: "latina_f5",
    nameEn: "Elena",
    nameTe: "ఎలెనా",
    gender: "female",
    category: "latina",
    prompt: "a studio portrait face photo of a Latin American female model with warm friendly expression, clear dark gaze, soft fill light"
  },
  {
    id: "latina_f6",
    nameEn: "Lucia",
    nameTe: "లూసియా",
    gender: "female",
    category: "latina",
    prompt: "a close-up headshot of a Latina fashion model with delicate facial features, elegant pose, clean studio key light"
  },

  // --- LATINO MALE (6 Faces) ---
  {
    id: "latino_m",
    nameEn: "Mateo",
    nameTe: "మాటియో",
    gender: "male",
    category: "latina",
    prompt: "a professional, ultra-high-resolution close-up studio headshot of a Latino male model with warm tan complexion, friendly open smile, sharp clear features, studio lighting, plain background"
  },
  {
    id: "latina_m2",
    nameEn: "Santiago",
    nameTe: "సాంటియాగో",
    gender: "male",
    category: "latina",
    prompt: "an editorial fashion studio headshot of a Latino male model with sculpted jawline, dark hair, confident direct gaze, grey setting"
  },
  {
    id: "latina_m3",
    nameEn: "Diego",
    nameTe: "డియాగో",
    gender: "male",
    category: "latina",
    prompt: "a close-up face portrait of an attractive Hispanic male model with warm open smile, tan skin tone, studio key illumination"
  },
  {
    id: "latina_m4",
    nameEn: "Carlos",
    nameTe: "కార్లోస్",
    gender: "male",
    category: "latina",
    prompt: "a studio commercial headshot of a Latino male model with light stubble, focused eyes, professional softbox flash"
  },
  {
    id: "latina_m5",
    nameEn: "Alejandro",
    nameTe: "అలెహాండ్రో",
    gender: "male",
    category: "latina",
    prompt: "a close-up studio portrait of a young Latino male model with well-defined jawline, charming smile, neutral grey backdrop"
  },
  {
    id: "latina_m6",
    nameEn: "Gabriel",
    nameTe: "గాబ్రియెల్",
    gender: "male",
    category: "latina",
    prompt: "a studio face shot of a Hispanic male model with natural gaze, smooth skin tone, clear directional studio flash"
  }
];

export const PRESET_FACES: ModelFace[] = RAW_PRESET_FACES.map(face => ({
  ...face,
  url: FALLBACK_UNSPLASH_MAP[face.id] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
}));

export type FaceSubtab = "indian" | "african" | "asian" | "western" | "mideast" | "latina" | "custom";

const SUBTABS: { id: FaceSubtab; en: string; te: string }[] = [
  { id: "indian", en: "Indian", te: "భారతీయ" },
  { id: "african", en: "African", te: "ఆఫ్రికన్" },
  { id: "asian", en: "East Asian", te: "ఈస్ట్ ఏషియన్" },
  { id: "western", en: "Western / EU", te: "పాశ్చాత్య" },
  { id: "mideast", en: "Middle East", te: "మిడిల్ ఈస్ట్" },
  { id: "latina", en: "Latina", te: "లాటినా" },
  { id: "custom", en: "Custom Faces", te: "కస్టమ్ ముఖాలు" }
];

const localT = {
  en: {
    sectionTitle: "Select Human Model Face",
    uploadBtn: "Upload Face",
    customFaceLabel: "Custom Face",
    noCustomFaces: "No custom faces uploaded yet.",
    uploadFirstCustom: "Click 'Upload Face' to add your own model face!"
  },
  te: {
    sectionTitle: "మానవ మోడల్ ముఖాన్ని ఎంచుకోండి",
    uploadBtn: "మీ ముఖం అప్‌లోడ్",
    customFaceLabel: "కస్టమ్ ముఖం",
    noCustomFaces: "ఇంకా ఎలాంటి కస్టమ్ ముఖాలు అప్‌లోడ్ చేయలేదు.",
    uploadFirstCustom: "'మీ ముఖం అప్‌లోడ్' బటన్ క్లిక్ చేసి మీ స్వంత ముఖాన్ని జోడించండి!"
  }
};

interface FaceGeneratorProps {
  gender: "female" | "male";
  selectedFaceId: string;
  setSelectedFaceId: (id: string) => void;
  selectedFacePrompt: string;
  setSelectedFacePrompt: (prompt: string) => void;
  customFaces?: ModelFace[];
  setCustomFaces?: React.Dispatch<React.SetStateAction<ModelFace[]>>;
  apiKey?: string;
  lang: "en" | "te";
}

export const FaceGenerator: React.FC<FaceGeneratorProps> = ({
  gender,
  selectedFaceId,
  setSelectedFaceId,
  setSelectedFacePrompt,
  customFaces = [],
  setCustomFaces,
  lang,
}) => {
  const t = localT[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSubtab, setActiveSubtab] = React.useState<FaceSubtab>("indian");
  const [currentFaceIndex, setCurrentFaceIndex] = React.useState(0);
  const [subtabIndex, setSubtabIndex] = React.useState(0);

  // Combine custom faces with preset faces matching current gender
  const customFacesList = customFaces.filter(f => f.gender === gender).map(f => ({ ...f, category: "custom" as const, isCustom: true }));
  const presetFacesList = PRESET_FACES.filter(f => f.gender === gender);

  const allFaces = [
    ...customFacesList,
    ...presetFacesList
  ];

  const getSubtabCount = (subtabId: FaceSubtab) => {
    if (subtabId === "custom") return allFaces.filter(f => f.isCustom || f.category === "custom").length;
    return allFaces.filter(f => f.category === subtabId).length;
  };

  const availableSubtabs = SUBTABS.filter(tab => getSubtabCount(tab.id) > 0 || tab.id === "custom");
  const maxSubtabIndex = Math.max(0, availableSubtabs.length - 4);

  // Sync subtabIndex when activeSubtab changes (without overriding manual arrow navigation)
  React.useEffect(() => {
    const activeIndex = availableSubtabs.findIndex(t => t.id === activeSubtab);
    if (activeIndex !== -1) {
      setSubtabIndex(prev => {
        if (activeIndex < prev) {
          return activeIndex;
        } else if (activeIndex > prev + 3) {
          return Math.min(activeIndex, maxSubtabIndex);
        }
        return prev;
      });
    }
  }, [activeSubtab]);

  // Ensure subtabIndex is valid if availableSubtabs list shrinks
  React.useEffect(() => {
    if (subtabIndex > maxSubtabIndex) {
      setSubtabIndex(maxSubtabIndex);
    }
  }, [maxSubtabIndex, subtabIndex]);

  const filteredFaces = allFaces.filter(face => {
    if (activeSubtab === "custom") return face.isCustom || face.category === "custom";
    return face.category === activeSubtab;
  });

  const maxFaceIndex = Math.max(0, filteredFaces.length - 3);

  // Reset face index when category or gender changes
  React.useEffect(() => {
    setCurrentFaceIndex(0);
  }, [activeSubtab, gender]);

  // Ensure currentFaceIndex is valid if filter list shrinks
  React.useEffect(() => {
    if (currentFaceIndex > maxFaceIndex) {
      setCurrentFaceIndex(maxFaceIndex);
    }
  }, [filteredFaces.length, maxFaceIndex, currentFaceIndex]);

  const handleCustomFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const newCustomFace: ModelFace = {
        id: `custom_face_${Date.now()}`,
        nameEn: "Custom Face",
        nameTe: "కస్టమ్ ముఖం",
        gender: gender,
        category: "custom",
        prompt: `a professional, ultra-high-resolution studio headshot matching the exact facial features, skin tone, hair, and structure of the reference model face photo`,
        url: dataUrl,
        isCustom: true
      };

      if (setCustomFaces) {
        setCustomFaces(prev => [newCustomFace, ...prev]);
      }
      setSelectedFaceId(newCustomFace.id);
      setSelectedFacePrompt(newCustomFace.prompt);
      setActiveSubtab("custom");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2.5 border-t border-black/5 dark:border-white/5 pt-2 flex-1">
      {/* Title & Tabs Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-[var(--text-emphasis)] flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-accent" />
            {t.sectionTitle}
          </h4>

          {/* Upload Custom Face Trigger */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleCustomFaceUpload} 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-extrabold text-accent bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 px-2 py-0.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>{t.uploadBtn}</span>
          </button>
        </div>

        {/* Ethnicity / Custom Subtabs Row */}
        <div className="flex flex-wrap items-center gap-1.5 w-full py-1 sm:py-1.5">
          {availableSubtabs.map((tab) => {
            const count = getSubtabCount(tab.id);
            const isActive = activeSubtab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubtab(tab.id)}
                className={`px-2 py-1.5 rounded-xl text-[9.5px] sm:text-[10px] font-extrabold transition-all text-center leading-tight flex items-center justify-center gap-1 shrink-0 cursor-pointer ${
                  isActive
                    ? "nm-inset-sm text-accent scale-[0.98] border border-accent/20 bg-accent/10"
                    : "nm-outset-sm text-[var(--text-primary)] opacity-80 hover:opacity-100 hover:scale-[1.02]"
                }`}
              >
                <span>{lang === "en" ? tab.en : tab.te}</span>
                <span className={`px-1 py-0.2 rounded-full text-[8px] sm:text-[8.5px] shrink-0 font-extrabold ${
                  isActive 
                    ? "bg-accent/20 text-accent" 
                    : "bg-black/5 dark:bg-white/10 text-[var(--text-muted)] opacity-80"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Faces Display Grid - Directly visible */}
      {filteredFaces.length > 0 ? (
        <div className="space-y-1 flex-1 my-0.5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 w-full py-1 p-0.5">
            {filteredFaces.map((face) => {
              const isSelected = selectedFaceId === face.id;
              return (
                <button
                  key={face.id}
                  type="button"
                  id={`btn-model-face-${face.id}`}
                  onClick={() => {
                    setSelectedFaceId(face.id);
                    setSelectedFacePrompt(face.prompt);
                  }}
                  className={`relative p-1.5 sm:p-2 rounded-2xl flex flex-col items-center justify-between gap-1 transition-all cursor-pointer ${
                    isSelected ? "nm-inset-sm scale-95 border-accent text-accent font-black" : "nm-outset-sm hover:scale-[1.02]"
                  }`}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden nm-inset-xs bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                    <img 
                      src={face.url} 
                      alt={face.nameEn}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const stage = target.dataset.stage || "0";
                        if (stage === "0") {
                          target.dataset.stage = "1";
                          target.src = face.fallbackUrl || FALLBACK_UNSPLASH_MAP[face.id] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
                        } else if (stage === "1") {
                          target.dataset.stage = "2";
                          target.src = DEFAULT_AVATAR_SVG;
                        }
                      }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[var(--color-accent)]/15 flex items-center justify-center">
                        <span className="bg-[var(--color-accent)] text-black rounded-full p-0.5 text-[9px] shadow-sm font-bold">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    )}
                    {face.isCustom && (
                      <div className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5">
                        <UserIcon className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold break-words leading-tight w-full text-center opacity-95 truncate pt-0.5">
                    {(lang === "en" ? face.nameEn : face.nameTe).replace(/\s*\([^)]*\)/g, "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-2xl border-2 border-dashed border-accent/40 hover:border-accent bg-[var(--color-accent)]/5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 text-accent flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-emphasis)]">{t.noCustomFaces}</p>
            <p className="text-[10px] text-accent font-semibold">{t.uploadFirstCustom}</p>
          </div>
        </div>
      )}
    </div>
  );
};

