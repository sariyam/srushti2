import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { TRANSLATIONS, Workspace, Language } from "./types";
import { compilePrompt, IMAGE_MODELS, IMAGE_RESOLUTIONS, getImagePrice, formatPrice, getGptImage2SizeString } from "./data";
import { OptionValidator } from "./utils/optionMapping";

// Reusable Utilities
import { 
  compressImage, 
  downloadImage, 
  shareImage
} from "./utils/imageUtils";

// Reusable Components
import { Header } from "./components/Header";
import { PreviewStage } from "./components/PreviewStage";
import { GarmentWorkspace } from "./components/GarmentWorkspace";
import { JewelryWorkspace } from "./components/JewelryWorkspace";
import { AdminWorkspace } from "./components/AdminWorkspace";
import { SettingsWorkspace } from "./components/SettingsWorkspace";
import { PRESET_FACES } from "./components/FaceGenerator";
import { SplashScreen } from "./components/SplashScreen";

const Shirt = (props: any) => <Icon icon="lucide:shirt" {...props} />;
const Gem = (props: any) => <Icon icon="lucide:gem" {...props} />;
const CreditCard = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const CheckCircle2 = (props: any) => <Icon icon="lucide:circle-check" {...props} />;
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const Download = (props: any) => <Icon icon="lucide:download" {...props} />;
const Share2 = (props: any) => <Icon icon="lucide:share-2" {...props} />;
const AlertTriangle = (props: any) => <Icon icon="lucide:triangle-alert" {...props} />;
const SettingsIcon = (props: any) => <Icon icon="lucide:settings" {...props} />;
const XIcon = (props: any) => <Icon icon="lucide:x" {...props} />;

export default function App() {
  // --- Persistent & Local States ---
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("srushti_lang");
    return (saved as Language) || "te"; // Default to Telugu
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("srushti_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const [workspace, setWorkspace] = useState<Workspace>("garment");
  
  // Tab states within Workspace panels
  const [garmentTab, setGarmentTab] = useState<"setup" | "studio" | "background">("setup");
  const [jewelryTab, setJewelryTab] = useState<"setup" | "studio" | "background">("setup");

  // Export Settings
  const [garmentOrientation, setGarmentOrientation] = useState<"square" | "portrait" | "landscape">("square");
  const [garmentResolution, setGarmentResolution] = useState<"512k" | "1k" | "2k" | "4k">("1k");
  const [garmentAspectRatio, setGarmentAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "3:4" | "9:16">("1:1");

  const [jewelryOrientation, setJewelryOrientation] = useState<"square" | "portrait" | "landscape">("square");
  const [jewelryResolution, setJewelryResolution] = useState<"512k" | "1k" | "2k" | "4k">("1k");
  const [jewelryAspectRatio, setJewelryAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "3:4" | "9:16">("1:1");

  // Currency & Exchange Rate State
  const [currency, setCurrency] = useState<"USD" | "INR">(() => {
    return (localStorage.getItem("srushti_currency") as "USD" | "INR") || "USD";
  });
  const [usdToInrRate, setUsdToInrRate] = useState<number>(() => {
    const saved = localStorage.getItem("srushti_usd_to_inr");
    return saved ? parseFloat(saved) : 83.5;
  });
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(false);
  const [rateFetchStatus, setRateFetchStatus] = useState<string | null>(null);

  const fetchLiveExchangeRate = async () => {
    setIsFetchingRate(true);
    setRateFetchStatus(null);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) throw new Error("HTTP error");
      const data = await res.json();
      if (data && data.rates && data.rates.INR) {
        const liveRate = parseFloat(Number(data.rates.INR).toFixed(2));
        setUsdToInrRate(liveRate);
        setRateFetchStatus(`Updated live: ₹${liveRate}/USD`);
      } else {
        throw new Error("INR rate missing");
      }
    } catch {
      try {
        const res2 = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data2 = await res2.json();
        if (data2 && data2.rates && data2.rates.INR) {
          const liveRate2 = parseFloat(Number(data2.rates.INR).toFixed(2));
          setUsdToInrRate(liveRate2);
          setRateFetchStatus(`Updated live: ₹${liveRate2}/USD`);
        } else {
          setRateFetchStatus("Using current rate");
        }
      } catch {
        setRateFetchStatus("Could not fetch live rate");
      }
    } finally {
      setIsFetchingRate(false);
    }
  };

  useEffect(() => {
    fetchLiveExchangeRate();
  }, []);

  useEffect(() => {
    localStorage.setItem("srushti_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("srushti_usd_to_inr", usdToInrRate.toString());
  }, [usdToInrRate]);

  // Selected AI Models (shared globally to calculate pricing on export tabs too)
  const [selectedImageModel, setSelectedImageModel] = useState<string>(() => {
    return localStorage.getItem("srushti_selected_image_model") || "gptimage_2";
  });
  const [selectedVideoModel, setSelectedVideoModel] = useState<string>(() => {
    return localStorage.getItem("srushti_selected_video_model") || "veo31_generate_preview";
  });
  const [gptImageQuality, setGptImageQuality] = useState<"low" | "medium" | "high">(
    () => (localStorage.getItem("srushti_gpt_image_quality") as "low" | "medium" | "high") || "medium"
  );

  // Persist selected models & quality
  useEffect(() => {
    localStorage.setItem("srushti_selected_image_model", selectedImageModel);
    if (selectedImageModel === "gemini31_flash_lite_image") {
      setGarmentResolution("1k");
      setJewelryResolution("1k");
    } else if (selectedImageModel === "gemini3_pro_image") {
      if (garmentResolution === "512k") setGarmentResolution("1k");
      if (jewelryResolution === "512k") setJewelryResolution("1k");
    } else if (selectedImageModel === "gemini25_flash_image") {
      if (garmentResolution === "2k" || garmentResolution === "4k") setGarmentResolution("1k");
      if (jewelryResolution === "2k" || jewelryResolution === "4k") setJewelryResolution("1k");
    } else if (selectedImageModel === "gptimage_2") {
      if (garmentResolution === "512k") setGarmentResolution("1k");
      if (jewelryResolution === "512k") setJewelryResolution("1k");
    }
  }, [selectedImageModel, garmentResolution, jewelryResolution]);

  // Enforce 1:1 aspect ratio resolution restriction (4K disabled for 1:1)
  useEffect(() => {
    if (garmentAspectRatio === "1:1" && garmentResolution === "4k") {
      setGarmentResolution("1k");
    }
  }, [garmentAspectRatio, garmentResolution]);

  useEffect(() => {
    if (jewelryAspectRatio === "1:1" && jewelryResolution === "4k") {
      setJewelryResolution("1k");
    }
  }, [jewelryAspectRatio, jewelryResolution]);

  useEffect(() => {
    localStorage.setItem("srushti_gpt_image_quality", gptImageQuality);
  }, [gptImageQuality]);

  useEffect(() => {
    localStorage.setItem("srushti_selected_video_model", selectedVideoModel);
  }, [selectedVideoModel]);

  // Provider Selection state
  const [selectedProvider, setSelectedProvider] = useState<"all" | "openai" | "google">(() => {
    return (localStorage.getItem("srushti_selected_provider") as any) || "openai";
  });

  // Gemini API Key state
  const [rawGeminiApiKey, setRawGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem("srushti_gemini_api_key") || localStorage.getItem("srushti_api_key") || "";
  });
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    const saved = localStorage.getItem("srushti_gemini_api_key") || localStorage.getItem("srushti_api_key") || "";
    if (saved) {
      return saved.length > 10 ? `${saved.substring(0, 6)}...${saved.substring(saved.length - 4)}` : "AIzaSy...xxxx";
    }
    return "";
  });
  const [geminiApiInput, setGeminiApiInput] = useState<string>(() => {
    return localStorage.getItem("srushti_gemini_api_key") || localStorage.getItem("srushti_api_key") || "";
  });

  // OpenAI API Key state
  const [rawOpenaiApiKey, setRawOpenaiApiKey] = useState<string>(() => {
    return localStorage.getItem("srushti_openai_api_key") || "";
  });
  const [openaiApiKey, setOpenaiApiKey] = useState<string>(() => {
    const saved = localStorage.getItem("srushti_openai_api_key") || "";
    if (saved) {
      return saved.length > 10 ? `${saved.substring(0, 6)}...${saved.substring(saved.length - 4)}` : "sk-proj...xxxx";
    }
    return "";
  });
  const [openaiApiInput, setOpenaiApiInput] = useState<string>(() => {
    return localStorage.getItem("srushti_openai_api_key") || "";
  });

  // Active Key resolver for legacy compatibility
  const isOpenAiSelected = selectedImageModel === "gptimage_2" || selectedVideoModel === "sora_2" || selectedVideoModel === "sora_2_pro" || selectedProvider === "openai";
  
  const rawApiKey = isOpenAiSelected ? (rawOpenaiApiKey || rawGeminiApiKey) : (rawGeminiApiKey || rawOpenaiApiKey);
  const apiKey = isOpenAiSelected ? (openaiApiKey || geminiApiKey) : (geminiApiKey || openaiApiKey);
  const apiInput = isOpenAiSelected ? openaiApiInput : geminiApiInput;

  const setApiInput = (val: string) => {
    if (isOpenAiSelected) {
      setOpenaiApiInput(val);
    } else {
      setGeminiApiInput(val);
    }
  };

  const [showKeySavedToast, setShowKeySavedToast] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [keyValidationError, setKeyValidationError] = useState<string | null>(null);

  // Core Photography Pipeline States
  const [originalImage, setOriginalImage] = useState<string | null>(null); // base64
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // base64/URL
  
  const [activePreviewTab, setActivePreviewTab] = useState<"original" | "generated">("original");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [debugPayload, setDebugPayload] = useState<any | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Garment Selections
  const [garmentType, setGarmentType] = useState<"saree" | "tshirt" | "jeans" | "shirt" | "western_wear" | "kurta" | "suit" | "salwar" | "lehenga" | "gown" | "skirt" | "crop_top" | "blouse" | "sherwani" | "dhoti" | "blazer" | "tracksuit" | "hoodie">("saree");
  const [garmentPresentation, setGarmentPresentation] = useState<"model" | "partial_face" | "no_face" | "mannequin" | "hanger" | "ghost" | "flat_lay" | "folded" | "shelf" | "shopwindow">("model");
  const [garmentModelGender, setGarmentModelGender] = useState<"female" | "male">("female");
  const [garmentModelPose, setGarmentModelPose] = useState<string>("standing_front");
  const [garmentBackground, setGarmentBackground] = useState<"plain" | "studio" | "traditional" | "festival" | "luxury" | "royal" | "urban" | "vintage" | "modern_office">("traditional");
  const [garmentBgColor, setGarmentBgColor] = useState("cream white");
  const [garmentPhotoStyle, setGarmentPhotoStyle] = useState<"editorial" | "campaign">("editorial");

  // Jewelry Selections
  const [jewelryType, setJewelryType] = useState<"earrings" | "necklace" | "chain" | "ring" | "bracelet" | "watch" | "anklet" | "payal" | "toe_ring" | "toe" | "nose_ring" | "nose_pin" | "nath" | "nose" | "noise" | "bangles" | "choker" | "cufflinks" | "pendant" | "kada" | "waistband" | "hip_chain" | "kamarbandh" | "finger_ring" | "thumb_ring" | "solitaire" | "maang_tikka" | "matha_patti" | "borla" | "passa" | "headband">("necklace");
  const [jewelryPresentation, setJewelryPresentation] = useState<"model" | "bust" | "partial_face" | "no_face">("model");
  const [jewelryModelGender, setJewelryModelGender] = useState<"female" | "male">("female");
  const [jewelryModelPose, setJewelryModelPose] = useState<"neck_collarbone" | "side_ear_profile" | "hand_face_gesture" | "three_quarter_gaze" | "wrist_hand_display" | "front_direct_portrait">("neck_collarbone");
  const [jewelryBustRegion, setJewelryBustRegion] = useState<"head" | "neck" | "wrist" | "ankle" | "finger" | "hand" | "naturally" | "ear">("neck");
  const [jewelryBackground, setJewelryBackground] = useState<"plain" | "studio" | "luxury" | "festival" | "traditional" | "wood" | "beach" | "velvet" | "silk" | "granite" | "mirror">("luxury");
  const [jewelryBgColor, setJewelryBgColor] = useState("cream white");
  const [jewelryPhotoStyle, setJewelryPhotoStyle] = useState<"editorial" | "campaign">("editorial");

  // Model Face custom states
  const [customFaces, setCustomFaces] = useState<any[]>(() => {
    const saved = localStorage.getItem("srushti_custom_faces");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGarmentFaceId, setSelectedGarmentFaceId] = useState<string>("indian_f");
  const [selectedGarmentFacePrompt, setSelectedGarmentFacePrompt] = useState<string>("");
  const [selectedJewelryFaceId, setSelectedJewelryFaceId] = useState<string>("indian_f");
  const [selectedJewelryFacePrompt, setSelectedJewelryFacePrompt] = useState<string>("");

  // Persist custom faces
  useEffect(() => {
    localStorage.setItem("srushti_custom_faces", JSON.stringify(customFaces));
  }, [customFaces]);

  // Auto-align face gender for Garments
  useEffect(() => {
    const currentFace = [...customFaces, ...PRESET_FACES].find(f => f.id === selectedGarmentFaceId);
    if (!currentFace || currentFace.gender !== garmentModelGender) {
      const firstMatched = [...customFaces, ...PRESET_FACES].find(f => f.gender === garmentModelGender);
      if (firstMatched) {
        setSelectedGarmentFaceId(firstMatched.id);
        setSelectedGarmentFacePrompt(firstMatched.prompt);
      }
    }
  }, [garmentModelGender, selectedGarmentFaceId, customFaces]);

  // Auto-align face gender for Jewelry
  useEffect(() => {
    const currentFace = [...customFaces, ...PRESET_FACES].find(f => f.id === selectedJewelryFaceId);
    if (!currentFace || currentFace.gender !== jewelryModelGender) {
      const firstMatched = [...customFaces, ...PRESET_FACES].find(f => f.gender === jewelryModelGender);
      if (firstMatched) {
        setSelectedJewelryFaceId(firstMatched.id);
        setSelectedJewelryFacePrompt(firstMatched.prompt);
      }
    }
  }, [jewelryModelGender, selectedJewelryFaceId, customFaces]);

  // Auto-align garment type based on gender selection
  useEffect(() => {
    const validGarment = OptionValidator.getValidGarmentType(garmentModelGender, garmentType);
    if (validGarment !== garmentType) {
      setGarmentType(validGarment as any);
    }
  }, [garmentModelGender, garmentType]);

  // Auto-align jewelry type based on gender selection
  useEffect(() => {
    const validJewelry = OptionValidator.getValidJewelryType(jewelryModelGender, jewelryType);
    if (validJewelry !== jewelryType) {
      setJewelryType(validJewelry as any);
    }
  }, [jewelryModelGender, jewelryType]);

  // Auto-correct jewelry bust region whenever jewelryType changes
  useEffect(() => {
    const validRegion = OptionValidator.getValidJewelryBustRegion(jewelryType, jewelryBustRegion);
    if (validRegion !== jewelryBustRegion) {
      setJewelryBustRegion(validRegion);
    }
  }, [jewelryType, jewelryBustRegion]);

  // Progress Loading cycle phrases
  const [loadingStep, setLoadingStep] = useState(0);

  const t = TRANSLATIONS[lang];

  // Apply Theme Toggle Class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("srushti_theme", theme);
  }, [theme]);

  // Persist Language Selection
  useEffect(() => {
    localStorage.setItem("srushti_lang", lang);
  }, [lang]);

  // Handle Photo Selection with compression
  const handlePhotoSelection = async (file: File) => {
    if (!file) return;
    try {
      setGeneratedImage(null);
      setGenerationError(null);
      
      const compressedBase64 = await compressImage(file, 900);

      setOriginalImage(compressedBase64);
      setActivePreviewTab("original");
    } catch (err) {
      console.log("Photo selection and compression info:", err);
    }
  };

  // Save key locally
  const handleSelectBusiness = (newWorkspace: "garment" | "jewelry", gender: "female" | "male") => {
    setWorkspace(newWorkspace);
    if (newWorkspace === "garment") {
      setGarmentModelGender(gender);
      setGarmentType(OptionValidator.getValidGarmentType(gender, garmentType) as any);
    } else if (newWorkspace === "jewelry") {
      setJewelryModelGender(gender);
      setJewelryType(OptionValidator.getValidJewelryType(gender, jewelryType) as any);
    }
  };

  // Save Gemini Key
  const handleSaveGeminiApiKey = async (inputVal?: string) => {
    const targetVal = inputVal !== undefined ? inputVal : geminiApiInput;
    let trimmed = targetVal.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      trimmed = trimmed.substring(1, trimmed.length - 1).trim();
    }
    setKeyValidationError(null);

    if (trimmed === "") {
      setRawGeminiApiKey("");
      setGeminiApiKey("");
      setGeminiApiInput("");
      localStorage.removeItem("srushti_gemini_api_key");
      localStorage.removeItem("srushti_api_key");
      setShowKeySavedToast(true);
      setTimeout(() => setShowKeySavedToast(false), 3000);
      return;
    }

    const isValidFormat = trimmed.startsWith("AIza") || trimmed.startsWith("AIzaSy") || trimmed.length >= 15;
    if (!isValidFormat) {
      setKeyValidationError(lang === "en" 
        ? "Invalid Gemini API Key structure. Standard Gemini keys start with 'AIza'."
        : "జెమిని API కీ నిర్మాణం సరికాదు. 'AIza' తో ప్రారంభమయ్యే కీని ఉపయోగించండి.");
      return;
    }

    setIsValidatingKey(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setRawGeminiApiKey(trimmed);
    localStorage.setItem("srushti_gemini_api_key", trimmed);
    localStorage.setItem("srushti_api_key", trimmed);

    const masked = trimmed.length > 10 
      ? `${trimmed.substring(0, 6)}...${trimmed.substring(trimmed.length - 4)}` 
      : "AIzaSy...xxxx";
    setGeminiApiKey(masked);
    setGeminiApiInput(trimmed);
    
    setIsValidatingKey(false);
    setShowKeySavedToast(true);
    setTimeout(() => setShowKeySavedToast(false), 3500);
  };

  // Save OpenAI Key
  const handleSaveOpenaiApiKey = async (inputVal?: string) => {
    const targetVal = inputVal !== undefined ? inputVal : openaiApiInput;
    let trimmed = targetVal.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      trimmed = trimmed.substring(1, trimmed.length - 1).trim();
    }
    setKeyValidationError(null);

    if (trimmed === "") {
      setRawOpenaiApiKey("");
      setOpenaiApiKey("");
      setOpenaiApiInput("");
      localStorage.removeItem("srushti_openai_api_key");
      setShowKeySavedToast(true);
      setTimeout(() => setShowKeySavedToast(false), 3000);
      return;
    }

    const isValidFormat = trimmed.startsWith("sk-") || trimmed.length >= 20;
    if (!isValidFormat) {
      setKeyValidationError(lang === "en" 
        ? "Invalid OpenAI API Key structure. Standard OpenAI keys start with 'sk-'."
        : "ఓపెన్ AI API కీ నిర్మాణం సరికాదు. 'sk-' తో ప్రారంభమయ్యే కీని ఉపయోగించండి.");
      return;
    }

    setIsValidatingKey(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setRawOpenaiApiKey(trimmed);
    localStorage.setItem("srushti_openai_api_key", trimmed);

    const masked = trimmed.length > 10 
      ? `${trimmed.substring(0, 6)}...${trimmed.substring(trimmed.length - 4)}` 
      : "sk-proj...xxxx";
    setOpenaiApiKey(masked);
    setOpenaiApiInput(trimmed);
    
    setIsValidatingKey(false);
    setShowKeySavedToast(true);
    setTimeout(() => setShowKeySavedToast(false), 3500);
  };

  // Unified save dispatcher
  const handleSaveApiKey = async (keyType?: "gemini" | "openai") => {
    if (keyType === "openai" || (keyType === undefined && isOpenAiSelected)) {
      await handleSaveOpenaiApiKey();
    } else {
      await handleSaveGeminiApiKey();
    }
  };

  // Cost calculation based on selected parameters
  const getEstimatedCost = () => {
    const modelObj = IMAGE_MODELS.find(m => m.id === selectedImageModel) || IMAGE_MODELS[0];
    const resId = workspace === "garment" ? garmentResolution : jewelryResolution;
    const activeAspectRatio = workspace === "garment" ? garmentAspectRatio : jewelryAspectRatio;
    const finalCost = getImagePrice(selectedImageModel, resId, gptImageQuality, activeAspectRatio);
    const formatted = formatPrice(finalCost, currency, usdToInrRate);
    if (selectedImageModel === "gptimage_2") {
      return `${formatted} (GPTImage-2 @ ${gptImageQuality.toUpperCase()} Quality)`;
    }
    return `${formatted} (${modelObj.name.split(" (")[0]} @ ${resId.toUpperCase()})`;
  };

  // Creative Photo Generation Trigger
  const handleGenerateClick = async () => {
    if (!originalImage) {
      setGenerationError(t.errUploadFirst);
      setDebugPayload(null);
      setDebugPrompt(null);
      return;
    }

    const isCurrentModelOpenAi = selectedImageModel === "gptimage_2";
    const activeRequiredKey = isCurrentModelOpenAi ? rawOpenaiApiKey : rawGeminiApiKey;

    if (!activeRequiredKey) {
      setGenerationError(lang === "en" 
        ? `Please enter and save your ${isCurrentModelOpenAi ? "OpenAI API Key (starting with sk-)" : "Google Gemini API Key (starting with AIza)"} in Application Settings or Admin Panel.` 
        : `దయచేసి సెట్టింగ్‌లలో మీ ${isCurrentModelOpenAi ? "ఓపెన్ AI" : "గూగుల్ జెమిని"} API కీని నమోదు చేయండి.`);
      setDebugPayload(null);
      setDebugPrompt(null);
      return;
    }

    setGenerationError(null);
    setDebugPayload(null);
    setDebugPrompt(null);
    setIsGenerating(true);
    setLoadingStep(0);

    let stepInterval: any = null;

    try {
      // Play visual loop of photographic stages for immersive layman loading feel
      stepInterval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 900);

      // Find the face reference image URL
      const activeFaceId = workspace === "garment" ? selectedGarmentFaceId : selectedJewelryFaceId;
      const activeFace = [...customFaces, ...PRESET_FACES].find(f => f.id === activeFaceId);
      const isModelPresentation = workspace === "garment" ? (garmentPresentation === "model" || garmentPresentation === "partial_face" || garmentPresentation === "no_face") : (jewelryPresentation === "model" || jewelryPresentation === "partial_face" || jewelryPresentation === "no_face");
      const activeFaceUrl = isModelPresentation && activeFace ? activeFace.url : null;

      const activePrompt = compilePrompt({
        workspace: workspace as "garment" | "jewelry",
        garmentType,
        garmentPresentation,
        garmentModelGender,
        garmentModelPose,
        garmentBackground,
        garmentBgColor,
        jewelryType,
        jewelryPresentation,
        jewelryModelGender,
        jewelryModelPose,
        jewelryBustRegion,
        jewelryBackground,
        jewelryBgColor,
        garmentModelFacePrompt: selectedGarmentFacePrompt,
        jewelryModelFacePrompt: selectedJewelryFacePrompt,
        hasFaceRef: !!activeFaceUrl,
        photoStyle: workspace === "garment" ? garmentPhotoStyle : jewelryPhotoStyle,
        aspectRatio: workspace === "garment" ? garmentAspectRatio : jewelryAspectRatio,
        resolution: workspace === "garment" ? garmentResolution : jewelryResolution
      });

      const promptWithFace = activePrompt;

      // Map user-selected model identifier to the actual Gemini/OpenAI Model name
      const modelMap: Record<string, string> = {
        "gptimage_2": "gptimage-2",
        "gemini31_flash_image": "gemini-2.5-flash",
        "gemini31_flash_lite_image": "gemini-2.5-flash",
        "gemini3_pro_image": "gemini-2.5-flash",
        "gemini25_flash_image": "gemini-2.5-flash"
      };
      const modelName = modelMap[selectedImageModel] || "gemini-2.5-flash";

      const parts: any[] = [];

      // If a transparent/masked product image is provided, pass it as reference
      if (originalImage) {
        const cleanBase64 = originalImage.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = originalImage.includes("image/png") ? "image/png" : "image/jpeg";
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType,
          },
        });
      }

      // If a face reference image is provided, convert it to base64
      let cleanFaceBase64 = "";
      let faceMime = "image/jpeg";

      if (activeFaceUrl) {
        try {
          if (activeFaceUrl.startsWith("data:")) {
            const match = activeFaceUrl.match(/^data:(image\/\w+);base64,(.+)$/);
            if (match) {
              faceMime = match[1];
              cleanFaceBase64 = match[2];
            }
          }

          if (!cleanFaceBase64) {
            console.log("Fetching face reference image on client:", activeFaceUrl);
            const faceRes = await fetch(activeFaceUrl);
            if (faceRes.ok) {
              const blob = await faceRes.blob();
              const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              cleanFaceBase64 = base64String.replace(/^data:image\/\w+;base64,/, "");
              faceMime = activeFaceUrl.includes(".png") ? "image/png" : "image/jpeg";
            }
          }

          if (cleanFaceBase64) {
            parts.push({
              inlineData: {
                data: cleanFaceBase64,
                mimeType: faceMime,
              },
            });
          }
        } catch (fetchErr) {
          console.log("Could not process face reference image:", fetchErr);
        }
      }

      // Compile the final textual prompt context
      let promptText = "";
      try {
        const parsedObj = JSON.parse(promptWithFace);
        promptText = `You are an expert commercial product photographer. Generate high-fidelity studio product photography containing the items shown. CRITICAL REQUIREMENT: You MUST EXACTLY REPLICATE and reproduce the input product's original design, artwork, patterns, exact length, physical size, proportions, and craftsmanship details from the input reference image into the output image. Do NOT alter, redesign, or re-imagine the product design, patterns, length, or size. Do NOT render any price tags, price stickers, brand tags, company logos, store tags, barcodes, watermarks, or text overlays in the output image:\n\n${JSON.stringify(parsedObj, null, 2)}`;
      } catch (e) {
        promptText = promptWithFace;
      }

      parts.push({
        text: promptText,
      });

      // Map resolution to imageSize if supported by the model
      const resolution = workspace === "garment" ? garmentResolution : jewelryResolution;
      let imageSize: string | undefined = undefined;
      if (resolution) {
        const sizeMap: Record<string, string> = {
          "512k": "512px",
          "1k": "1K",
          "2k": "2K",
          "4k": "4K"
        };
        imageSize = sizeMap[resolution];
      }

      const imageConfig: any = {
        aspectRatio: workspace === "garment" ? garmentAspectRatio : jewelryAspectRatio
      };
      if (imageSize) {
        imageConfig.imageSize = imageSize;
      }

      const restPayload = {
        contents: [
          {
            parts
          }
        ],
        generationConfig: {
          imageConfig
        }
      };

      // Effective keys for each provider
      const googleKeyToUse = rawGeminiApiKey || rawApiKey;
      const openAiKeyToUse = rawOpenaiApiKey || rawApiKey;

      // Construct a clean, safe representation of the payload to print in the UI debug block
      const debugPayloadObj = {
        provider: selectedImageModel === "gptimage_2" ? "OpenAI" : "Google Gemini",
        endpoint: selectedImageModel === "gptimage_2" 
          ? "https://api.openai.com/v1/images/generations" 
          : `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
        model: modelName,
        aspectRatio: workspace === "garment" ? garmentAspectRatio : jewelryAspectRatio,
        resolution: resolution,
        productBase64Preview: originalImage ? `${originalImage.substring(0, 60)}... (${Math.round(originalImage.length / 1024)} KB)` : null,
        faceBase64Preview: cleanFaceBase64 ? `data:${faceMime};base64,${cleanFaceBase64.substring(0, 50)}... (${Math.round(cleanFaceBase64.length / 1024)} KB)` : null,
        promptJSON: JSON.parse(promptWithFace),
        rawPayloadStructure: selectedImageModel === "gptimage_2" ? null : restPayload
      };

      setDebugPrompt(promptWithFace);
      setDebugPayload(debugPayloadObj);

      // --- OPENAI API IMAGE GENERATION BRANCH ---
      if (selectedImageModel === "gptimage_2") {
        const activeAspect = workspace === "garment" ? garmentAspectRatio : jewelryAspectRatio;
        const activeRes = workspace === "garment" ? garmentResolution : jewelryResolution;
        const sizeString = getGptImage2SizeString(activeRes, activeAspect);

        const openAiQuality = gptImageQuality === "low" || gptImageQuality === "medium" || gptImageQuality === "auto"
          ? gptImageQuality 
          : "high";
        const openAiEndpoint = "https://api.openai.com/v1/images/edits";

        const formData = new FormData();
        formData.append("model", "gpt-image-2");
        formData.append("prompt", promptWithFace);
        formData.append("size", sizeString);
        formData.append("quality", openAiQuality);
        formData.append("n", "1");

        // Helper to convert data URL or http URL to Blob
        const urlToBlob = async (url: string): Promise<Blob> => {
          if (url.startsWith("data:")) {
            const parts = url.split(",");
            const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
            const bstr = atob(parts[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
          }
          const fetchRes = await fetch(url);
          return await fetchRes.blob();
        };

        const imagePreviewsForDebug: string[] = [];

        if (originalImage) {
          try {
            const productBlob = await urlToBlob(originalImage);
            formData.append("image[]", productBlob, "product_image.png");
            imagePreviewsForDebug.push(`<product image bytes (~${Math.round(productBlob.size / 1024)} KB)>`);
          } catch (blobErr) {
            console.error("Error converting original product image to Blob:", blobErr);
          }
        }

        if (activeFaceUrl) {
          try {
            const faceBlob = await urlToBlob(activeFaceUrl);
            formData.append("image[]", faceBlob, "face_reference.png");
            imagePreviewsForDebug.push(`<face reference image bytes (~${Math.round(faceBlob.size / 1024)} KB)>`);
          } catch (blobErr) {
            console.error("Error converting face reference image to Blob:", blobErr);
          }
        }

        const openAiDebugObj = {
          ...debugPayloadObj,
          endpoint: openAiEndpoint,
          model: "gpt-image-2",
          contentType: "multipart/form-data",
          quality: openAiQuality,
          calculatedSize: sizeString,
          rawPayloadFields: {
            model: "gpt-image-2",
            "image[]": imagePreviewsForDebug,
            prompt: promptWithFace,
            size: sizeString,
            quality: openAiQuality,
            n: "1"
          }
        };

        setDebugPayload(openAiDebugObj);

        let res = await fetch(openAiEndpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openAiKeyToUse}`
          },
          body: formData
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const errMsg = errJson?.error?.message || `OpenAI API Error (${res.status}): ${res.statusText}`;
          throw new Error(errMsg);
        }

        const data = await res.json();
        let generatedImageUrl: string | null = null;
        if (data.data?.[0]?.b64_json) {
          generatedImageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
        } else if (data.data?.[0]?.url) {
          generatedImageUrl = data.data[0].url;
        }

        if (stepInterval) {
          clearInterval(stepInterval);
          stepInterval = null;
        }

        if (generatedImageUrl) {
          setGeneratedImage(generatedImageUrl);
          setActivePreviewTab("generated");
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 4000);
          try {
            downloadImage(generatedImageUrl, `srushti_${workspace}_photography.png`);
          } catch (downloadErr) {
            console.log("Auto download status info:", downloadErr);
          }
          return;
        } else {
          throw new Error(t.errGenFailed);
        }
      }

      // --- GOOGLE GEMINI API IMAGE GENERATION BRANCH ---
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${googleKeyToUse}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(restPayload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `Google API Error (${res.status}): ${res.statusText}`;
        throw new Error(errMsg);
      }

      const data = await res.json();

      let generatedImageUrl: string | null = null;
      let textResponse = "";

      // Check Gemini candidates format
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      } 
      // Check Imagen prediction format fallback
      else if (data.predictions?.[0]?.bytesBase64Encoded) {
        generatedImageUrl = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
      }

      if (stepInterval) {
        clearInterval(stepInterval);
        stepInterval = null;
      }

      if (generatedImageUrl) {
        setGeneratedImage(generatedImageUrl);
        setActivePreviewTab("generated");
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
        
        // Auto download the generated image
        try {
          downloadImage(generatedImageUrl, `srushti_${workspace}_photography.png`);
        } catch (downloadErr) {
          console.log("Auto download status info:", downloadErr);
        }
      } else {
        throw new Error(textResponse || t.errGenFailed);
      }
    } catch (err: any) {
      console.log("AI Photo Generation status info:", err?.message || err);
      setGenerationError(err.message || t.errGenFailed);
    } finally {
      if (stepInterval) {
        clearInterval(stepInterval);
      }
      setIsGenerating(false);
    }
  };

  // Download Output
  const handleDownloadOutput = () => {
    const activeSrc = generatedImage || originalImage;
    if (!activeSrc) return;
    downloadImage(activeSrc, `srushti_${workspace}_photography.png`);
  };

  // Share Output
  const handleShareOutput = () => {
    const activeSrc = generatedImage || originalImage;
    if (!activeSrc) return;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "en" ? "App link copied to clipboard!" : "యాప్ లింక్ కాపీ చేయబడింది!");
    };

    shareImage(
      activeSrc,
      "Srushti AI - Business to Brand",
      "Check out my beautiful shop product photo generated by Srushti AI!",
      copyToClipboard
    );
  };

  return (
    <div className="h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col overflow-hidden">
      
      {/* --- TOP BRAND HEADER BAR --- */}
      <Header 
        title={t.title}
        subtitle={t.subtitle}
        workspace={workspace}
        garmentModelGender={garmentModelGender}
        jewelryModelGender={jewelryModelGender}
        onSelectBusiness={handleSelectBusiness}
        lang={lang}
        apiKey={apiKey}
        apiInput={apiInput}
        setApiInput={setApiInput}
        onSaveApiKey={handleSaveApiKey}
        estimatedCost={getEstimatedCost()}
        selectedImageModel={selectedImageModel}
        setSelectedImageModel={setSelectedImageModel}
        gptImageQuality={gptImageQuality}
        setGptImageQuality={setGptImageQuality}
        selectedVideoModel={selectedVideoModel}
        setSelectedVideoModel={setSelectedVideoModel}
        currency={currency}
        setCurrency={setCurrency}
        usdToInrRate={usdToInrRate}
        setUsdToInrRate={setUsdToInrRate}
        onRefreshLiveRate={fetchLiveExchangeRate}
        isFetchingRate={isFetchingRate}
        rateFetchStatus={rateFetchStatus}
        t={t}
        theme={theme}
        setTheme={setTheme}
        setLang={setLang}
        garmentType={garmentType}
        setGarmentType={setGarmentType}
        jewelryType={jewelryType}
        setJewelryType={setJewelryType}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        geminiApiKey={geminiApiKey}
        geminiApiInput={geminiApiInput}
        setGeminiApiInput={setGeminiApiInput}
        onSaveGeminiApiKey={handleSaveGeminiApiKey}
        openaiApiKey={openaiApiKey}
        openaiApiInput={openaiApiInput}
        setOpenaiApiInput={setOpenaiApiInput}
        onSaveOpenaiApiKey={handleSaveOpenaiApiKey}
        isValidatingKey={isValidatingKey}
        keyValidationError={keyValidationError}
        setKeyValidationError={setKeyValidationError}
      />

      {/* --- MAIN PAGE CORE STAGE --- */}
      <main className="px-4 max-w-lg sm:max-w-xl md:max-w-3xl landscape:max-w-full lg:landscape:max-w-full xl:landscape:max-w-full 2xl:landscape:max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto flex-1 min-h-0 flex flex-col space-y-3 pb-3 lg:pb-6 lg:space-y-6 w-full lg:px-6">
        <div className="flex-1 min-h-0 flex flex-col gap-4 landscape:grid landscape:grid-cols-12 landscape:gap-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-stretch">
          
          {/* LEFT COLUMN: CANVAS & PREVIEW AREA */}
          <PreviewStage 
            originalImage={originalImage}
            generatedImage={generatedImage}
            activePreviewTab={activePreviewTab}
            setActivePreviewTab={setActivePreviewTab}
            isGenerating={isGenerating}
            loadingStep={loadingStep}
            lang={lang}
            t={t}
            onPhotoSelection={handlePhotoSelection}
            onClearCanvas={() => {
              setOriginalImage(null);
              setGeneratedImage(null);
            }}
            onGenerate={handleGenerateClick}
            onDownload={handleDownloadOutput}
            onShare={handleShareOutput}
            onUpdateOriginalImage={(croppedImg) => {
              setOriginalImage(croppedImg);
              setActivePreviewTab("original");
            }}
            generationError={generationError}
            aspectRatio={workspace === "garment" ? garmentAspectRatio : jewelryAspectRatio}
            debugPayload={debugPayload}
          />

          {/* RIGHT COLUMN: WORKSPACE DETAILS */}
          <div className="h-1/2 min-h-0 flex flex-col space-y-2 lg:space-y-4 w-full landscape:h-full landscape:min-h-0 landscape:col-span-7 lg:h-full lg:min-h-0 lg:col-span-7 xl:col-span-7">
            
            {/* WORKSPACE PANELS */}
            {workspace === "garment" && (
              <GarmentWorkspace 
                garmentTab={garmentTab}
                setGarmentTab={setGarmentTab}
                garmentType={garmentType}
                setGarmentType={setGarmentType}
                garmentPresentation={garmentPresentation}
                setGarmentPresentation={setGarmentPresentation}
                garmentModelGender={garmentModelGender}
                setGarmentModelGender={setGarmentModelGender}
                garmentModelPose={garmentModelPose}
                setGarmentModelPose={setGarmentModelPose}
                garmentBackground={garmentBackground}
                setGarmentBackground={setGarmentBackground}
                garmentBgColor={garmentBgColor}
                setGarmentBgColor={setGarmentBgColor}
                lang={lang}
                t={t}
                selectedFaceId={selectedGarmentFaceId}
                setSelectedFaceId={setSelectedGarmentFaceId}
                selectedFacePrompt={selectedGarmentFacePrompt}
                setSelectedFacePrompt={setSelectedGarmentFacePrompt}
                customFaces={customFaces}
                setCustomFaces={setCustomFaces}
                apiKey={apiKey}
                garmentOrientation={garmentOrientation}
                setGarmentOrientation={setGarmentOrientation}
                garmentResolution={garmentResolution}
                setGarmentResolution={setGarmentResolution}
                garmentAspectRatio={garmentAspectRatio}
                setGarmentAspectRatio={setGarmentAspectRatio}
                selectedImageModel={selectedImageModel}
                setSelectedImageModel={setSelectedImageModel}
                onGenerate={handleGenerateClick}
                isGenerating={isGenerating}
                garmentPhotoStyle={garmentPhotoStyle}
                setGarmentPhotoStyle={setGarmentPhotoStyle}
                gptImageQuality={gptImageQuality}
                setGptImageQuality={setGptImageQuality}
                currency={currency}
                usdToInrRate={usdToInrRate}
              />
            )}

            {workspace === "jewelry" && (
              <JewelryWorkspace 
                jewelryTab={jewelryTab}
                setJewelryTab={setJewelryTab}
                jewelryType={jewelryType}
                setJewelryType={setJewelryType}
                jewelryPresentation={jewelryPresentation}
                setJewelryPresentation={setJewelryPresentation}
                jewelryModelGender={jewelryModelGender}
                setJewelryModelGender={setJewelryModelGender}
                jewelryModelPose={jewelryModelPose}
                setJewelryModelPose={setJewelryModelPose}
                jewelryBustRegion={jewelryBustRegion}
                setJewelryBustRegion={setJewelryBustRegion}
                jewelryBackground={jewelryBackground}
                setJewelryBackground={setJewelryBackground}
                jewelryBgColor={jewelryBgColor}
                setJewelryBgColor={setJewelryBgColor}
                lang={lang}
                t={t}
                selectedFaceId={selectedJewelryFaceId}
                setSelectedFaceId={setSelectedJewelryFaceId}
                selectedFacePrompt={selectedJewelryFacePrompt}
                setSelectedFacePrompt={setSelectedJewelryFacePrompt}
                customFaces={customFaces}
                setCustomFaces={setCustomFaces}
                apiKey={apiKey}
                jewelryOrientation={jewelryOrientation}
                setJewelryOrientation={setJewelryOrientation}
                jewelryResolution={jewelryResolution}
                setJewelryResolution={setJewelryResolution}
                jewelryAspectRatio={jewelryAspectRatio}
                setJewelryAspectRatio={setJewelryAspectRatio}
                selectedImageModel={selectedImageModel}
                setSelectedImageModel={setSelectedImageModel}
                onGenerate={handleGenerateClick}
                isGenerating={isGenerating}
                jewelryPhotoStyle={jewelryPhotoStyle}
                setJewelryPhotoStyle={setJewelryPhotoStyle}
                gptImageQuality={gptImageQuality}
                setGptImageQuality={setGptImageQuality}
                currency={currency}
                usdToInrRate={usdToInrRate}
              />
            )}



            {/* MOBILE ONLY ERROR ALERT REMOVED TO USE THE DIALOG MODAL */}

          </div>
        </div>
      </main>

      {/* --- ERROR DIALOG POPUP --- */}
      <AnimatePresence>
        {generationError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Overlay with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGenerationError(null)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className="relative bg-[var(--bg-primary)] rounded-[2rem] p-6 max-w-xl w-full space-y-4 border border-red-200 dark:border-red-900/30 text-[var(--text-primary)] z-10 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              {/* Decorative top red accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />

              <div className="flex flex-col landscape:flex-row items-center landscape:items-start text-center landscape:text-left gap-4 space-y-3 landscape:space-y-0 pt-2">
                {/* Close Button on top-right */}
                <button
                  onClick={() => setGenerationError(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center nm-outset-sm hover:scale-105 active:scale-95 text-red-500 hover:text-red-600 cursor-pointer shrink-0"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>

                {/* Error Icon */}
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-500 animate-pulse shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  {/* Title */}
                  <h3 className="text-base font-extrabold text-[var(--text-emphasis)] tracking-tight">
                    {lang === "en" ? "Generation Error" : "ఏఐ జనరేషన్ లోపం"}
                  </h3>

                  {/* Error Message */}
                  <p className="text-xs opacity-80 leading-relaxed text-[var(--text-primary)] max-w-md break-words">
                    {generationError}
                  </p>
                </div>
              </div>

              {/* Developer Debug Section: Payload and Prompt */}
              {(debugPayload || debugPrompt) && (
                <div className="space-y-4 pt-3 border-t border-black/5 dark:border-white/5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-wider uppercase opacity-60">
                      {lang === "en" ? "Developer Debug Logs" : "డెవలపర్ డీబగ్ సమాచారం"}
                    </span>
                    <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">
                      {lang === "en" ? "AI Submission Logs" : "ఏపిఐ లాగ్స్"}
                    </span>
                  </div>

                  {/* Submission Payload JSON Code Block */}
                  {debugPayload && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold opacity-75">JSON API Payload:</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(debugPayload, null, 2));
                          }}
                          className="text-[9px] text-accent hover:underline font-bold transition-all"
                        >
                          {lang === "en" ? "Copy Payload" : "పేలోడ్ కాపీ చేయి"}
                        </button>
                      </div>
                      <div className="nm-inset rounded-xl p-3 bg-black/40 dark:bg-black/25 overflow-x-auto">
                        <pre className="font-mono text-[9px] text-emerald-400 dark:text-emerald-300 leading-normal max-w-full whitespace-pre-wrap break-all">
                          {JSON.stringify(debugPayload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Prompt Text Block */}
                  {debugPrompt && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold opacity-75">Final Compiled Prompt:</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(debugPrompt);
                          }}
                          className="text-[9px] text-accent hover:underline font-bold transition-all"
                        >
                          {lang === "en" ? "Copy Prompt" : "ప్రాంప్ట్ కాపీ చేయి"}
                        </button>
                      </div>
                      <div className="nm-inset rounded-xl p-3 bg-black/40 dark:bg-black/25 max-h-[140px] overflow-y-auto">
                        <p className="font-mono text-[9px] text-amber-500 dark:text-amber-400 leading-normal whitespace-pre-wrap break-words">
                          {debugPrompt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Close / Action Buttons */}
              <div className="pt-2">
                <button
                  id="btn-close-error-dialog"
                  onClick={() => setGenerationError(null)}
                  className="w-full py-3 rounded-2xl text-xs font-black tracking-wide nm-outset flex items-center justify-center gap-2 text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {lang === "en" ? "Dismiss" : "సరే"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATIONS --- */}
      <AnimatePresence>
        {showKeySavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100] max-w-sm mx-auto"
          >
            <div className="nm-outset rounded-2xl p-4 bg-emerald-500 text-white flex items-center gap-3 shadow-2xl">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold">{t.keySaved}</p>
            </div>
          </motion.div>
        )}

        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100] max-w-sm mx-auto"
          >
            <div className="nm-outset rounded-2xl p-4 bg-accent text-white flex items-center gap-3 shadow-2xl">
              <Sparkles className="w-5 h-5 shrink-0 animate-bounce" />
              <div>
                <p className="text-xs font-extrabold">సృష్టి ఏఐ ఫోటో సిద్ధంగా ఉంది!</p>
                <p className="text-[10px] opacity-90 mt-0.5">Your beautiful shop photo is ready!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ANIMATED STARTUP SPLASH SCREEN --- */}
      {showSplash && (
        <SplashScreen 
          onComplete={() => setShowSplash(false)} 
          theme={theme} 
        />
      )}

    </div>
  );
}
