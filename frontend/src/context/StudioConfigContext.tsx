import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchStudioConfigApi,
  StudioConfigResponse,
  BusinessCategoryRecord,
  CatalogItemRecord,
  StudioPresetRecord,
  SystemLookupRecord,
  GroupedLookups,
  GenderRecord,
  WorkspaceRecord,
  WearTypeRecord,
} from "../utils/api";

export const FALLBACK_GENDERS: GenderRecord[] = [
  { id: "female", code: "female", nameEn: "Female", nameTe: "మహిళ", description: "Targeting women's apparel and accessories", icon: "lucide:sparkles", displayOrder: 1, isActive: true },
  { id: "male", code: "male", nameEn: "Male", nameTe: "పురుషుడు", description: "Targeting men's apparel and accessories", icon: "lucide:shirt", displayOrder: 2, isActive: true },
  { id: "unisex", code: "unisex", nameEn: "Unisex", nameTe: "యూనిసెక్స్", description: "Suitable for both male and female collections", icon: "lucide:users", displayOrder: 3, isActive: true },
  { id: "all", code: "all", nameEn: "All Genders", nameTe: "అన్ని వర్గాలు", description: "Universal settings and demographic-independent options", icon: "lucide:globe", displayOrder: 4, isActive: true },
];

export const FALLBACK_WORKSPACES: WorkspaceRecord[] = [
  { id: "garment", code: "garment", nameEn: "Garment Studio", nameTe: "దుస్తుల స్టూడియో", description: "Apparel, sarees, and clothing studio", icon: "lucide:shirt", displayOrder: 1, isActive: true },
  { id: "jewelry", code: "jewelry", nameEn: "Jewelry Studio", nameTe: "నగల స్టూడియో", description: "Precious jewelry and watches studio", icon: "lucide:gem", displayOrder: 2, isActive: true },
  { id: "general", code: "general", nameEn: "General Studio", nameTe: "సాధారణ స్టూడియో", description: "General multipurpose studio", icon: "lucide:sparkles", displayOrder: 3, isActive: true },
  { id: "all", code: "all", nameEn: "All Workspaces", nameTe: "అన్ని స్టూడియోలు", description: "Universal presets", icon: "lucide:globe", displayOrder: 4, isActive: true },
  { id: "face", code: "face", nameEn: "Face & Model Studio", nameTe: "మోడల్ ఫేస్ స్టూడియో", description: "Model face generator", icon: "lucide:scan-face", displayOrder: 5, isActive: true },
];

export const FALLBACK_WEAR_TYPES: WearTypeRecord[] = [
  // Garment wear types
  { id: "gar_top_wear", workspace: "garment", code: "top_wear", nameEn: "Top Wear", nameTe: "టాప్ వేర్", description: "Shirts, T-shirts, Kurtis, Blouses, Tops", icon: "lucide:shirt", displayOrder: 1, isActive: true },
  { id: "gar_bottom_wear", workspace: "garment", code: "bottom_wear", nameEn: "Bottom Wear", nameTe: "బాటమ్ వేర్", description: "Jeans, Trousers, Skirts, Pants", icon: "lucide:scissors", displayOrder: 2, isActive: true },
  { id: "gar_full_wear", workspace: "garment", code: "full_wear", nameEn: "Full Wear", nameTe: "ఫుల్ వేర్", description: "Dresses, Sarees, Suits, Jumpsuits, Gowns", icon: "lucide:sparkles", displayOrder: 3, isActive: true },
  // Jewelry wear types
  { id: "jwl_neck_wear", workspace: "jewelry", code: "neck_wear", nameEn: "Neck Wear", nameTe: "నెక్ వేర్", description: "Necklaces, Chokers, Chains, Pendants, Mangalsutras", icon: "lucide:gem", displayOrder: 1, isActive: true },
  { id: "jwl_ear_wear", workspace: "jewelry", code: "ear_wear", nameEn: "Ear Wear", nameTe: "ఇయర్ వేర్", description: "Earrings, Jhumkas, Studs, Drops, Hoops", icon: "lucide:sparkle", displayOrder: 2, isActive: true },
  { id: "jwl_wrist_wear", workspace: "jewelry", code: "wrist_wear", nameEn: "Wrist Wear", nameTe: "రిస్ట్ వేర్", description: "Bangles, Bracelets, Kadas, Watches", icon: "lucide:watch", displayOrder: 3, isActive: true },
  { id: "jwl_hip_wear", workspace: "jewelry", code: "hip_wear", nameEn: "Hip Wear", nameTe: "హిప్ వేర్", description: "Vaddanams, Waistbands, Kamarbands", icon: "lucide:shield", displayOrder: 4, isActive: true },
  { id: "jwl_nose_wear", workspace: "jewelry", code: "nose_wear", nameEn: "Nose Wear", nameTe: "ముక్కుపుడక", description: "Nose pins, Naths", icon: "lucide:circle-dot", displayOrder: 5, isActive: true },
  { id: "jwl_leg_wear", workspace: "jewelry", code: "leg_wear", nameEn: "Leg Wear", nameTe: "లెగ్ వేర్", description: "Anklets, Payals, Toe rings", icon: "lucide:footprints", displayOrder: 6, isActive: true },
  { id: "jwl_forehead_wear", workspace: "jewelry", code: "forehead_wear", nameEn: "Forehead Wear", nameTe: "నుదురు ఆభరణాలు", description: "Maang tikkas, Mathapattis", icon: "lucide:crown", displayOrder: 7, isActive: true },
  { id: "jwl_other_wear", workspace: "jewelry", code: "other_wear", nameEn: "Other Wear", nameTe: "ఇతర ఆభరణాలు", description: "Brooches, armlets, miscellaneous jewelry", icon: "lucide:gem", displayOrder: 8, isActive: true },
];

export const FALLBACK_LOOKUPS: GroupedLookups = {
  backgroundTypes: [
    { id: "bg_indoor", type: "background_type", code: "indoor", nameEn: "Indoor", nameTe: "ఇండోర్", description: "Studio & indoor lighting", icon: "lucide:home", displayOrder: 1, isActive: true },
    { id: "bg_outdoor", type: "background_type", code: "outdoor", nameEn: "Outdoor", nameTe: "అవుట్‌డోర్", description: "Natural ambient & outdoor settings", icon: "lucide:sun", displayOrder: 2, isActive: true },
  ],
  genders: [
    { id: "female", type: "gender", code: "female", nameEn: "Female", nameTe: "మహిళ", description: "Female model portfolio & poses", icon: "lucide:user", displayOrder: 1, isActive: true },
    { id: "male", type: "gender", code: "male", nameEn: "Male", nameTe: "పురుషుడు", description: "Male model portfolio & poses", icon: "lucide:user-check", displayOrder: 2, isActive: true },
    { id: "unisex", type: "gender", code: "unisex", nameEn: "Unisex", nameTe: "యూనిసెక్స్", description: "Unisex collections", icon: "lucide:users", displayOrder: 3, isActive: true },
    { id: "all", type: "gender", code: "all", nameEn: "All Genders", nameTe: "అన్ని వర్గాలు", description: "Universal options", icon: "lucide:globe", displayOrder: 4, isActive: true },
  ],
  garmentCategories: [
    { id: "gar_top_wear", type: "garment_category", code: "top_wear", nameEn: "Top Wear", nameTe: "టాప్ వేర్", description: "Shirts, T-shirts, Kurtis, Blouses, Tops", icon: "lucide:shirt", displayOrder: 1, isActive: true },
    { id: "gar_bottom_wear", type: "garment_category", code: "bottom_wear", nameEn: "Bottom Wear", nameTe: "బాటమ్ వేర్", description: "Jeans, Trousers, Skirts, Pants", icon: "lucide:scissors", displayOrder: 2, isActive: true },
    { id: "gar_full_wear", type: "garment_category", code: "full_wear", nameEn: "Full Wear", nameTe: "ఫుల్ వేర్", description: "Dresses, Sarees, Suits, Jumpsuits, Gowns", icon: "lucide:sparkles", displayOrder: 3, isActive: true },
  ],
  jewelryCategories: [
    { id: "jwl_neck_wear", type: "jewelry_category", code: "neck_wear", nameEn: "Neck Wear", nameTe: "నెక్ వేర్", description: "Necklaces, Chokers, Chains, Pendants, Mangalsutras", icon: "lucide:gem", displayOrder: 1, isActive: true },
    { id: "jwl_ear_wear", type: "jewelry_category", code: "ear_wear", nameEn: "Ear Wear", nameTe: "ఇయర్ వేర్", description: "Earrings, Jhumkas, Studs, Drops, Hoops", icon: "lucide:sparkle", displayOrder: 2, isActive: true },
    { id: "jwl_wrist_wear", type: "jewelry_category", code: "wrist_wear", nameEn: "Wrist Wear", nameTe: "రిస్ట్ వేర్", description: "Bangles, Bracelets, Kadas, Watches", icon: "lucide:watch", displayOrder: 3, isActive: true },
    { id: "jwl_hip_wear", type: "jewelry_category", code: "hip_wear", nameEn: "Hip Wear", nameTe: "హిప్ వేర్", description: "Vaddanams, Waistbands, Kamarbands", icon: "lucide:shield", displayOrder: 4, isActive: true },
    { id: "jwl_nose_wear", type: "jewelry_category", code: "nose_wear", nameEn: "Nose Wear", nameTe: "ముక్కుపుడక", description: "Nose pins, Naths", icon: "lucide:circle-dot", displayOrder: 5, isActive: true },
    { id: "jwl_leg_wear", type: "jewelry_category", code: "leg_wear", nameEn: "Leg Wear", nameTe: "లెగ్ వేర్", description: "Anklets, Payals, Toe rings", icon: "lucide:footprints", displayOrder: 6, isActive: true },
    { id: "jwl_forehead_wear", type: "jewelry_category", code: "forehead_wear", nameEn: "Forehead Wear", nameTe: "నుదురు ఆభరణాలు", description: "Maang tikkas, Mathapattis", icon: "lucide:crown", displayOrder: 7, isActive: true },
  ],
};
import {
  GENDER_GARMENT_MAPPING,
  GENDER_JEWELRY_MAPPING,
  GARMENT_CATEGORY_MAPPING,
  JEWELRY_CATEGORY_MAPPING,
  JEWELRY_BUST_MAPPING,
  GARMENT_POSES_BY_CATEGORY,
  JEWELRY_POSES_BY_CATEGORY,
} from "../utils/optionMapping";
import {
  PRESET_COLORS,
  GPT_IMAGE_2_5_SUNBURST_PRICING_MATRIX,
  IMAGE_MODELS,
  IMAGE_RESOLUTIONS,
} from "../data";
import { TRANSLATIONS } from "../types";

export interface HeroSlide {
  id: string;
  image: string;
  fallback?: string;
  titleEn: string;
  titleTe: string;
  tagEn: string;
  tagTe: string;
  highlightEn: string;
  highlightTe: string;
}

export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-dress",
    image: "/showcase/tryons/3.png",
    fallback: "/showcase/hero-dress-fallback.jpg",
    titleEn: "Designer Dress & Fashion Studio Shoot",
    titleTe: "డిజైనర్ డ్రెస్ & ఫ్యాషన్ స్టూడియో షూట్",
    tagEn: "Professional Fashion Lighting",
    tagTe: "ప్రొఫెషనల్ ఫ్యాషన్ లైటింగ్",
    highlightEn: "Authentic Indian Model • 100% Studio Clarity",
    highlightTe: "భారతీయ మోడల్ • పర్ఫెక్ట్ స్టూడియో క్వాలిటీ",
  },
  {
    id: "slide-watch",
    image: "/showcase/tryons/10.png",
    fallback: "/showcase/hero-watch-fallback.jpg",
    titleEn: "Luxury Watch & Premium Product Shoot",
    titleTe: "లగ్జరీ వాచ్ & ప్రీమియం ప్రొడక్ట్ షూట్",
    tagEn: "Luxury Product Lighting",
    tagTe: "లగ్జరీ ప్రొడక్ట్ లైటింగ్",
    highlightEn: "Premium Details • Instant Catalog Ready",
    highlightTe: "ప్రీమియం డిటైల్స్ • క్యాటలాగ్ రెడీ",
  },
  {
    id: "slide-saree",
    image: "/showcase/tryons/3.png",
    fallback: "/showcase/hero-saree-fallback.jpg",
    titleEn: "Royal Kanjeevaram Silk Saree Shoot",
    titleTe: "రాయల్ కాంచీపురం పట్టుచీరల స్టూడియో షూట్",
    tagEn: "Heritage Studio Lighting",
    tagTe: "హెరిటేజ్ స్టూడియో లైటింగ్",
    highlightEn: "Authentic Indian Model • 100% Studio Clarity",
    highlightTe: "భారతీయ మోడల్ • పర్ఫెక్ట్ స్టూడియో క్వాలిటీ",
  },
];

export type WorkspaceTab = "setup" | "studio" | "bg" | "background";

export interface StudioConfigContextType {
  config: StudioConfigResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // Dynamic accessors
  businesses: BusinessCategoryRecord[];
  catalogItems: CatalogItemRecord[];
  poses: StudioPresetRecord[];
  backgrounds: StudioPresetRecord[];
  presentationModes: StudioPresetRecord[];
  modelFaces: StudioPresetRecord[];

  // System Lookups
  lookups: GroupedLookups;
  backgroundTypes: SystemLookupRecord[];
  genders: SystemLookupRecord[];
  genderDemographics: GenderRecord[];
  workspacesList: WorkspaceRecord[];
  garmentCategories: SystemLookupRecord[];
  jewelryCategories: SystemLookupRecord[];
  wearTypes: WearTypeRecord[];
  getWearTypesByWorkspace: (workspace?: string) => WearTypeRecord[];

  // Dynamic system setting accessors
  heroSlides: HeroSlide[];
  presetColors: typeof PRESET_COLORS;
  pricingMatrix: any;
  imageModels: any[];
  imageResolutions: any;
  translations: typeof TRANSLATIONS;
  optionMappings: any;

  // Filtering helpers
  getGarmentItems: (gender: "female" | "male", categoryFilter?: string) => CatalogItemRecord[];
  getJewelryItems: (gender: "female" | "male", categoryFilter?: string) => CatalogItemRecord[];
  getModelFacesByGender: (gender: "female" | "male") => StudioPresetRecord[];
  getModelFaces: (gender: "female" | "male", category?: string) => StudioPresetRecord[];

  // Option relationships & bust mappings
  getJewelryBustMapping: (jewelryType: string) => readonly string[];
  getJewelryBgCompatibility: (presentation: string, environment: "indoor" | "outdoor") => readonly string[];
  getGarmentBgCompatibility: (presentation: string, environment: "indoor" | "outdoor") => readonly string[];
  getGarmentPosesByCategory: (category: string) => readonly string[];
  getJewelryPosesByCategory: (category: string) => readonly string[];

  // Prompt directive resolvers
  getItemPromptDirective: (itemId: string, fallback?: string) => string;
  getPosePromptDirective: (poseId: string, fallback?: string) => string;
  getBackgroundPromptDirective: (bgId: string, fallback?: string) => string;
  getPresentationDirective: (presentationId: string, fallback?: string) => string;
}

const StudioConfigContext = createContext<StudioConfigContextType | null>(null);

export const StudioConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StudioConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = useCallback(async (forceFresh = false) => {
    setIsLoading(true);
    try {
      const data = await fetchStudioConfigApi(forceFresh);
      setConfig(data);
      setError(null);
    } catch (err: any) {
      console.warn("StudioConfigProvider: Failed to load remote config, using local fallback:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();

    // Refetch when window regains focus or when admin mutations occur
    const handleSync = () => loadConfig(true);
    window.addEventListener("focus", handleSync);
    window.addEventListener("srushti:studio-config-updated", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("srushti:studio-config-updated", handleSync);
    };
  }, [loadConfig]);

  // Derived collections
  const businesses = useMemo(() => config?.categories || config?.businesses || [], [config]);
  const catalogItems = useMemo(() => config?.catalogItems || [], [config]);
  const poses = useMemo(() => config?.presets?.poses || config?.poses || [], [config]);
  const backgrounds = useMemo(() => config?.presets?.backgrounds || config?.backgrounds || [], [config]);
  const presentationModes = useMemo(() => config?.presets?.presentations || config?.presentations || [], [config]);
  const modelFaces = useMemo(() => config?.presets?.faces || config?.faces || [], [config]);

  // Dynamic system lookups (background types, genders, garment categories, jewelry categories)
  const lookups = useMemo<GroupedLookups>(() => {
    return {
      backgroundTypes: config?.lookups?.backgroundTypes?.length ? config.lookups.backgroundTypes : FALLBACK_LOOKUPS.backgroundTypes,
      genders: config?.lookups?.genders?.length ? config.lookups.genders : FALLBACK_LOOKUPS.genders,
      garmentCategories: config?.lookups?.garmentCategories?.length ? config.lookups.garmentCategories : FALLBACK_LOOKUPS.garmentCategories,
      jewelryCategories: config?.lookups?.jewelryCategories?.length ? config.lookups.jewelryCategories : FALLBACK_LOOKUPS.jewelryCategories,
      all: config?.lookups?.all || FALLBACK_LOOKUPS.all,
    };
  }, [config]);

  const backgroundTypes = useMemo(() => lookups.backgroundTypes, [lookups]);
  const genders = useMemo(() => lookups.genders, [lookups]);
  const genderDemographics = useMemo<GenderRecord[]>(() => {
    if (config?.genders && config.genders.length > 0) {
      return config.genders;
    }
    return FALLBACK_GENDERS;
  }, [config]);
  const workspacesList = useMemo<WorkspaceRecord[]>(() => {
    if (config?.workspaces && config.workspaces.length > 0) {
      return config.workspaces;
    }
    return FALLBACK_WORKSPACES;
  }, [config]);
  const garmentCategories = useMemo(() => lookups.garmentCategories, [lookups]);
  const jewelryCategories = useMemo(() => lookups.jewelryCategories, [lookups]);

  // Dedicated Wear Types (Detached from system lookups)
  const wearTypes = useMemo<WearTypeRecord[]>(() => {
    if (config?.wearTypes && config.wearTypes.length > 0) {
      return config.wearTypes;
    }
    return FALLBACK_WEAR_TYPES;
  }, [config]);

  const getWearTypesByWorkspace = useCallback(
    (workspace?: string) => {
      if (!workspace || workspace === "all") return wearTypes;
      return wearTypes.filter((wt) => wt.workspace === workspace);
    },
    [wearTypes]
  );

  // Dynamic system settings with rock-solid fallbacks
  const heroSlides = useMemo(
    () => config?.heroSlides || config?.settings?.hero_slides || FALLBACK_HERO_SLIDES,
    [config]
  );

  const presetColors = useMemo(
    () => config?.presetColors || config?.settings?.preset_colors || PRESET_COLORS,
    [config]
  );

  const pricingMatrix = useMemo(
    () => config?.pricingMatrix || config?.settings?.pricing_matrix || { gptImagePricing: GPT_IMAGE_2_5_SUNBURST_PRICING_MATRIX },
    [config]
  );

  const imageModels = useMemo(
    () => config?.imageModels || config?.settings?.image_models || IMAGE_MODELS,
    [config]
  );

  const imageResolutions = useMemo(
    () => config?.imageResolutions || config?.settings?.image_resolutions || IMAGE_RESOLUTIONS,
    [config]
  );

  const translations = useMemo(() => {
    const en = config?.translations?.en || config?.settings?.ui_translations_en || TRANSLATIONS.en;
    const te = config?.translations?.te || config?.settings?.ui_translations_te || (TRANSLATIONS as any).te;
    return { en, te } as typeof TRANSLATIONS;
  }, [config]);

  const optionMappings = useMemo(() => {
    const remote = config?.optionMappings || config?.settings?.option_mappings;
    return {
      garmentCategoryMapping: remote?.garmentCategoryMapping || GARMENT_CATEGORY_MAPPING,
      jewelryCategoryMapping: remote?.jewelryCategoryMapping || JEWELRY_CATEGORY_MAPPING,
      genderGarmentMapping: remote?.genderGarmentMapping || GENDER_GARMENT_MAPPING,
      genderJewelryMapping: remote?.genderJewelryMapping || GENDER_JEWELRY_MAPPING,
      jewelryBustMapping: remote?.jewelryBustMapping || JEWELRY_BUST_MAPPING,
      garmentPosesByCategory: remote?.garmentPosesByCategory || GARMENT_POSES_BY_CATEGORY,
      jewelryPosesByCategory: remote?.jewelryPosesByCategory || JEWELRY_POSES_BY_CATEGORY,
      garmentBgCompatibility: remote?.garmentBgCompatibility || {
        model: {
          indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
          outdoor: ["traditional", "royal", "urban"],
        },
        partial_face: {
          indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
          outdoor: ["traditional", "royal", "urban"],
        },
        no_face: {
          indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
          outdoor: ["traditional", "royal", "urban"],
        },
        mannequin: {
          indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
          outdoor: ["traditional"],
        },
        hanger: {
          indoor: ["plain", "studio", "luxury", "vintage"],
          outdoor: [],
        },
        ghost: {
          indoor: ["plain", "studio", "luxury"],
          outdoor: [],
        },
        flat_lay: {
          indoor: ["plain", "studio", "luxury", "vintage"],
          outdoor: [],
        },
        folded: {
          indoor: ["plain", "studio", "luxury", "vintage"],
          outdoor: [],
        },
        shelf: {
          indoor: ["plain", "studio", "luxury", "vintage", "modern_office"],
          outdoor: [],
        },
        shopwindow: {
          indoor: ["plain", "studio", "luxury", "vintage", "modern_office", "festival"],
          outdoor: ["urban"],
        },
      },
      jewelryBgCompatibility: remote?.jewelryBgCompatibility || {
        model: { indoor: ["plain", "studio"], outdoor: [] },
        partial_face: { indoor: ["plain", "studio", "luxury", "silk", "mirror"], outdoor: [] },
        no_face: { indoor: ["plain", "studio", "luxury", "silk", "mirror"], outdoor: [] },
        bust: {
          indoor: ["plain", "studio", "luxury", "traditional", "wood", "velvet", "silk", "granite", "mirror"],
          outdoor: ["beach"],
        },
      },
    };
  }, [config]);

  // Dynamic bust mapping resolver
  const getJewelryBustMapping = useCallback(
    (jewelryType: string): readonly string[] => {
      const mapping = optionMappings.jewelryBustMapping;
      return mapping?.[jewelryType] || JEWELRY_BUST_MAPPING[jewelryType] || [
        "head",
        "neck",
        "wrist",
        "ankle",
        "finger",
        "hand",
        "naturally",
        "ear",
      ];
    },
    [optionMappings]
  );

  // Dynamic background compatibility resolvers
  const getJewelryBgCompatibility = useCallback(
    (presentation: string, environment: "indoor" | "outdoor"): readonly string[] => {
      const compat = optionMappings.jewelryBgCompatibility;
      const presCompat = compat?.[presentation];
      if (presCompat && Array.isArray(presCompat[environment])) {
        return presCompat[environment];
      }
      return ["plain", "studio"];
    },
    [optionMappings]
  );

  const getGarmentBgCompatibility = useCallback(
    (presentation: string, environment: "indoor" | "outdoor"): readonly string[] => {
      const compat = optionMappings.garmentBgCompatibility;
      const presCompat = compat?.[presentation];
      if (presCompat && Array.isArray(presCompat[environment])) {
        return presCompat[environment];
      }
      return environment === "indoor"
        ? ["plain", "studio", "festival", "luxury", "vintage", "modern_office"]
        : ["traditional", "royal", "urban"];
    },
    [optionMappings]
  );

  // Dynamic category pose resolvers
  const getGarmentPosesByCategory = useCallback(
    (category: string): readonly string[] => {
      const mapping = optionMappings.garmentPosesByCategory;
      return mapping?.[category] || (GARMENT_POSES_BY_CATEGORY as any)[category] || [];
    },
    [optionMappings]
  );

  const getJewelryPosesByCategory = useCallback(
    (category: string): readonly string[] => {
      const mapping = optionMappings.jewelryPosesByCategory;
      return mapping?.[category] || (JEWELRY_POSES_BY_CATEGORY as any)[category] || [];
    },
    [optionMappings]
  );

  // Filter garment items dynamically by collection and category
  const getGarmentItems = useCallback(
    (gender: "female" | "male", categoryFilter?: string): CatalogItemRecord[] => {
      if (catalogItems.length > 0) {
        return catalogItems.filter((item) => {
          if (item.workspace !== "garment" || !item.isActive) return false;
          const matchGender = item.genderTarget === gender || item.genderTarget === "unisex" || item.genderTarget === "all";
          if (!matchGender) return false;
          const itemWearType = item.wearType || item.wearTypeId;
          if (categoryFilter && itemWearType !== categoryFilter) {
            const allowedForCat = (optionMappings.garmentCategoryMapping as any)[categoryFilter];
            if (Array.isArray(allowedForCat) && !allowedForCat.includes(item.id)) {
              return false;
            }
          }
          return true;
        });
      }

      // Fallback if backend offline
      const staticIds = optionMappings.genderGarmentMapping[gender] || [];
      return staticIds.map((id: string) => ({
        id,
        workspace: "garment" as const,
        genderTarget: gender,
        wearType: "full_wear",
        wearTypeId: "full_wear",
        nameEn: id.replace(/_/g, " "),
        nameTe: id,
        promptDirective: id,
        displayOrder: 0,
        isActive: true,
      }));
    },
    [catalogItems, optionMappings]
  );

  // Filter jewelry items dynamically by collection and category
  const getJewelryItems = useCallback(
    (gender: "female" | "male", categoryFilter?: string): CatalogItemRecord[] => {
      if (catalogItems.length > 0) {
        return catalogItems.filter((item) => {
          if (item.workspace !== "jewelry" || !item.isActive) return false;
          const matchGender = item.genderTarget === gender || item.genderTarget === "unisex" || item.genderTarget === "all";
          if (!matchGender) return false;
          const itemWearType = item.wearType || item.wearTypeId;
          if (categoryFilter && itemWearType !== categoryFilter) {
            const allowedForCat = (optionMappings.jewelryCategoryMapping as any)[categoryFilter];
            if (Array.isArray(allowedForCat) && !allowedForCat.includes(item.id)) {
              return false;
            }
          }
          return true;
        });
      }

      // Fallback
      const staticIds = optionMappings.genderJewelryMapping[gender] || [];
      return staticIds.map((id: string) => ({
        id,
        workspace: "jewelry" as const,
        genderTarget: gender,
        wearType: "neck_wear",
        wearTypeId: "neck_wear",
        nameEn: id.replace(/_/g, " "),
        nameTe: id,
        promptDirective: id,
        displayOrder: 0,
        isActive: true,
      }));
    },
    [catalogItems, optionMappings]
  );

  // Filter faces by gender (supporting metadata.gender, genderTarget, subCategory)
  const getModelFacesByGender = useCallback(
    (gender: "female" | "male"): StudioPresetRecord[] => {
      if (modelFaces.length > 0) {
        return modelFaces.filter((face) => {
          const faceGender = (face.metadata as any)?.gender || face.genderTarget;
          return faceGender === gender || faceGender === "all" || faceGender === "unisex";
        });
      }
      return [];
    },
    [modelFaces]
  );

  // Filter faces by gender and optional ethnicity / subcategory
  const getModelFaces = useCallback(
    (gender: "female" | "male", category?: string): StudioPresetRecord[] => {
      const byGender = getModelFacesByGender(gender);
      if (!category || category === "all") return byGender;
      return byGender.filter((face) => {
        const cat = face.subCategory || (face.metadata as any)?.ethnicity || (face.metadata as any)?.category;
        return cat === category;
      });
    },
    [getModelFacesByGender]
  );

  // Dynamic Prompt Directive Resolvers
  const getItemPromptDirective = useCallback(
    (itemId: string, fallback = ""): string => {
      const found = catalogItems.find((i) => i.id === itemId);
      return found?.promptDirective || fallback || itemId;
    },
    [catalogItems]
  );

  const getPosePromptDirective = useCallback(
    (poseId: string, fallback = ""): string => {
      const found = poses.find((p) => p.id === poseId);
      return found?.promptDirective || fallback || poseId;
    },
    [poses]
  );

  const getBackgroundPromptDirective = useCallback(
    (bgId: string, fallback = ""): string => {
      const found = backgrounds.find((b) => b.id === bgId);
      return found?.promptDirective || fallback || bgId;
    },
    [backgrounds]
  );

  const getPresentationDirective = useCallback(
    (presentationId: string, fallback = ""): string => {
      const found = presentationModes.find((p) => p.id === presentationId);
      return found?.promptDirective || fallback || presentationId;
    },
    [presentationModes]
  );

  const value = useMemo(
    () => ({
      config,
      isLoading,
      error,
      refetch: loadConfig,
      businesses,
      catalogItems,
      poses,
      backgrounds,
      presentationModes,
      modelFaces,
      lookups,
      backgroundTypes,
      genders,
      genderDemographics,
      workspacesList,
      garmentCategories,
      jewelryCategories,
      wearTypes,
      getWearTypesByWorkspace,
      heroSlides,
      presetColors,
      pricingMatrix,
      imageModels,
      imageResolutions,
      translations,
      optionMappings,
      getGarmentItems,
      getJewelryItems,
      getModelFacesByGender,
      getModelFaces,
      getJewelryBustMapping,
      getJewelryBgCompatibility,
      getGarmentBgCompatibility,
      getGarmentPosesByCategory,
      getJewelryPosesByCategory,
      getItemPromptDirective,
      getPosePromptDirective,
      getBackgroundPromptDirective,
      getPresentationDirective,
    }),
    [
      config,
      isLoading,
      error,
      loadConfig,
      businesses,
      catalogItems,
      poses,
      backgrounds,
      presentationModes,
      modelFaces,
      lookups,
      backgroundTypes,
      genders,
      genderDemographics,
      workspacesList,
      garmentCategories,
      jewelryCategories,
      wearTypes,
      getWearTypesByWorkspace,
      heroSlides,
      presetColors,
      pricingMatrix,
      imageModels,
      imageResolutions,
      translations,
      optionMappings,
      getGarmentItems,
      getJewelryItems,
      getModelFacesByGender,
      getModelFaces,
      getJewelryBustMapping,
      getJewelryBgCompatibility,
      getGarmentBgCompatibility,
      getGarmentPosesByCategory,
      getJewelryPosesByCategory,
      getItemPromptDirective,
      getPosePromptDirective,
      getBackgroundPromptDirective,
      getPresentationDirective,
    ]
  );

  return <StudioConfigContext.Provider value={value}>{children}</StudioConfigContext.Provider>;
};

export function useStudioConfig(): StudioConfigContextType {
  const context = useContext(StudioConfigContext);
  if (!context) {
    throw new Error("useStudioConfig must be used within a StudioConfigProvider");
  }
  return context;
}
