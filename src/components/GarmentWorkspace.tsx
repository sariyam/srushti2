import React from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { HexColorPicker } from "react-colorful";
import { PRESET_COLORS } from "../data";
import { calculateRequiredCredits, formatCredits, getCreditSettings, CreditSettings } from "../utils/wallet";
import { getGarmentPoses } from "../utils/optionMapping";
import { FaceGenerator, ModelFace } from "./FaceGenerator";
import { PresentationSlider } from "./PresentationSlider";
import { HorizontalSliderTrack } from "./HorizontalSliderTrack";

const Shirt = (props: any) => <Icon icon="lucide:shirt" {...props} />;
const User = (props: any) => <Icon icon="lucide:user" {...props} />;
const Palette = (props: any) => <Icon icon="lucide:palette" {...props} />;
const LuLayersIcon = (props: any) => <Icon icon="lucide:layers" {...props} />;
const LuPocketIcon = (props: any) => <Icon icon="lucide:pocket" {...props} />;
const LuUserRoundIcon = (props: any) => <Icon icon="lucide:user-round" {...props} />;
const LuTagIcon = (props: any) => <Icon icon="lucide:tag" {...props} />;
const LuGhostIcon = (props: any) => <Icon icon="lucide:ghost" {...props} />;
const LuCircleIcon = (props: any) => <Icon icon="lucide:circle" {...props} />;
const LuCameraIcon = (props: any) => <Icon icon="lucide:camera" {...props} />;
const ScanFace = (props: any) => <Icon icon="lucide:scan-face" {...props} />;
const UserX = (props: any) => <Icon icon="lucide:user-x" {...props} />;
const LuFlowerIcon = (props: any) => <Icon icon="lucide:flower" {...props} />;
const LuFlameIcon = (props: any) => <Icon icon="lucide:flame" {...props} />;
const LuGemIcon = (props: any) => <Icon icon="lucide:gem" {...props} />;
const LuCrownIcon = (props: any) => <Icon icon="lucide:crown" {...props} />;
const LuLeafIcon = (props: any) => <Icon icon="lucide:leaf" {...props} />;
const LuAccessibilityIcon = (props: any) => <Icon icon="lucide:accessibility" {...props} />;
const LuSmileIcon = (props: any) => <Icon icon="lucide:smile" {...props} />;
const LuRefreshCcwIcon = (props: any) => <Icon icon="lucide:refresh-ccw" {...props} />;
const LuSparklesIcon = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const LuFootprintsIcon = (props: any) => <Icon icon="lucide:footprints" {...props} />;
const LuArmchairIcon = (props: any) => <Icon icon="lucide:armchair" {...props} />;
const LuCoffeeIcon = (props: any) => <Icon icon="lucide:coffee" {...props} />;
const LuCoinsIcon = (props: any) => <Icon icon="lucide:coins" {...props} />;
const LuChevronDownIcon = (props: any) => <Icon icon="lucide:chevron-down" {...props} />;
const LuHomeIcon = (props: any) => <Icon icon="lucide:home" {...props} />;
const LuTreesIcon = (props: any) => <Icon icon="lucide:trees" {...props} />;
const LuSmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const LuMonitorIcon = (props: any) => <Icon icon="lucide:monitor" {...props} />;
const LuMaximizeIcon = (props: any) => <Icon icon="lucide:maximize" {...props} />;
const LuSettingsIcon = (props: any) => <Icon icon="lucide:settings" {...props} />;
const Building2 = (props: any) => <Icon icon="lucide:building-2" {...props} />;
const ChevronRight = (props: any) => <Icon icon="lucide:chevron-right" {...props} />;
const Edit2 = (props: any) => <Icon icon="lucide:pencil" {...props} />;

function isDarkColor(hex: string): boolean {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
}

interface GarmentWorkspaceProps {
  garmentTab: "setup" | "studio" | "background";
  setGarmentTab: (tab: "setup" | "studio" | "background") => void;
  garmentType: "saree" | "tshirt" | "jeans" | "shirt" | "western_wear" | "kurta" | "suit" | "salwar" | "lehenga" | "gown" | "skirt" | "crop_top" | "blouse" | "sherwani" | "dhoti" | "blazer" | "tracksuit" | "hoodie";
  setGarmentType: (type: any) => void;
  garmentPresentation: "model" | "partial_face" | "no_face" | "mannequin" | "hanger" | "ghost" | "flat_lay" | "folded" | "shelf" | "shopwindow";
  setGarmentPresentation: (mode: any) => void;
  garmentModelGender: "female" | "male";
  setGarmentModelGender: (gender: "female" | "male") => void;
  garmentModelPose: string;
  setGarmentModelPose: (pose: any) => void;
  garmentBackground: "plain" | "studio" | "traditional" | "festival" | "luxury" | "royal" | "urban" | "vintage" | "modern_office";
  setGarmentBackground: (bg: any) => void;
  garmentBgColor: string;
  setGarmentBgColor: (color: string) => void;
  lang: "en" | "te";
  t: any;
  selectedFaceId: string;
  setSelectedFaceId: (id: string) => void;
  selectedFacePrompt: string;
  setSelectedFacePrompt: (prompt: string) => void;
  customFaces: ModelFace[];
  setCustomFaces: React.Dispatch<React.SetStateAction<ModelFace[]>>;
  apiKey: string;
  garmentOrientation: "square" | "portrait" | "landscape";
  setGarmentOrientation: (val: "square" | "portrait" | "landscape") => void;
  garmentResolution: "1k" | "2k" | "4k";
  setGarmentResolution: (val: "1k" | "2k" | "4k") => void;
  garmentAspectRatio: "1:1" | "4:3" | "16:9" | "3:4" | "9:16";
  setGarmentAspectRatio: (val: "1:1" | "4:3" | "16:9" | "3:4" | "9:16") => void;
  selectedImageModel: string;
  setSelectedImageModel: (val: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  garmentPhotoStyle: "editorial" | "campaign";
  setGarmentPhotoStyle: (val: "editorial" | "campaign") => void;
  gptImageQuality?: "low" | "medium" | "high";
  setGptImageQuality?: (val: "low" | "medium" | "high") => void;
  currency?: "USD" | "INR";
  usdToInrRate?: number;
}

export const GarmentWorkspace: React.FC<GarmentWorkspaceProps> = ({
  garmentTab,
  setGarmentTab,
  garmentType,
  setGarmentType,
  garmentPresentation,
  setGarmentPresentation,
  garmentModelGender,
  setGarmentModelGender,
  garmentModelPose,
  setGarmentModelPose,
  garmentBackground,
  setGarmentBackground,
  garmentBgColor,
  setGarmentBgColor,
  lang,
  t,
  selectedFaceId,
  setSelectedFaceId,
  selectedFacePrompt,
  setSelectedFacePrompt,
  customFaces,
  setCustomFaces,
  apiKey,
  garmentOrientation,
  setGarmentOrientation,
  garmentResolution,
  setGarmentResolution,
  garmentAspectRatio,
  setGarmentAspectRatio,
  selectedImageModel,
  setSelectedImageModel,
  onGenerate,
  isGenerating,
  garmentPhotoStyle,
  setGarmentPhotoStyle,
  gptImageQuality = "medium",
  setGptImageQuality,
  currency = "USD",
  usdToInrRate = 83.5,
}) => {
  const [bgCategory, setBgCategory] = React.useState<"indoor" | "outdoor">(() => {
    return (garmentBackground === "traditional" || garmentBackground === "royal") ? "outdoor" : "indoor";
  });
  const [garmentCategoryFilter, setGarmentCategoryFilter] = React.useState<"full_wear" | "top_wear" | "bottom_wear">("full_wear");
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });

  const [creditSettings, setCreditSettings] = React.useState<CreditSettings>(() => getCreditSettings());

  React.useEffect(() => {
    const handleCreditSettingsChange = (e: any) => {
      if (e?.detail) setCreditSettings(e.detail);
      else setCreditSettings(getCreditSettings());
    };
    window.addEventListener("srushti:credit-settings-updated", handleCreditSettingsChange);
    return () => window.removeEventListener("srushti:credit-settings-updated", handleCreditSettingsChange);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep model pose valid when garmentType or garmentPresentation changes
  React.useEffect(() => {
    const allowed = getGarmentPoses(garmentType, garmentPresentation);
    if (!allowed.includes(garmentModelPose)) {
      setGarmentModelPose(allowed[0]);
    }
  }, [garmentType, garmentPresentation]);

  // Define background compatibility per presentation mode
  const GARMENT_BG_COMPATIBILITY: Record<string, { indoor: string[]; outdoor: string[] }> = {
    model: {
      indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
      outdoor: ["traditional", "royal", "urban"]
    },
    partial_face: {
      indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
      outdoor: ["traditional", "royal", "urban"]
    },
    no_face: {
      indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
      outdoor: ["traditional", "royal", "urban"]
    },
    mannequin: {
      indoor: ["plain", "studio", "festival", "luxury", "vintage", "modern_office"],
      outdoor: ["traditional"]
    },
    hanger: {
      indoor: ["plain", "studio", "luxury", "vintage"],
      outdoor: []
    },
    ghost: {
      indoor: ["plain", "studio", "luxury"],
      outdoor: []
    },
    flat_lay: {
      indoor: ["plain", "studio", "luxury", "vintage"],
      outdoor: []
    },
    folded: {
      indoor: ["plain", "studio", "luxury", "vintage"],
      outdoor: []
    },
    shelf: {
      indoor: ["plain", "studio", "luxury", "vintage", "modern_office"],
      outdoor: []
    },
    shopwindow: {
      indoor: ["plain", "studio", "luxury", "vintage", "modern_office", "festival"],
      outdoor: ["urban"]
    }
  };

  const comp = GARMENT_BG_COMPATIBILITY[garmentPresentation] || GARMENT_BG_COMPATIBILITY.model;
  const hasIndoor = comp.indoor.length > 0;
  const hasOutdoor = comp.outdoor.length > 0;

  // Automatically align selected background when presentation mode changes
  React.useEffect(() => {
    const currentComp = GARMENT_BG_COMPATIBILITY[garmentPresentation] || GARMENT_BG_COMPATIBILITY.model;
    const allAllowed = [...currentComp.indoor, ...currentComp.outdoor];
    if (!allAllowed.includes(garmentBackground)) {
      const fallbackBg = currentComp.indoor[0] || currentComp.outdoor[0] || "plain";
      setGarmentBackground(fallbackBg);
      setBgCategory(currentComp.indoor.includes(fallbackBg) ? "indoor" : "outdoor");
    } else {
      if (currentComp.indoor.includes(garmentBackground)) {
        setBgCategory("indoor");
      } else if (currentComp.outdoor.includes(garmentBackground)) {
        setBgCategory("outdoor");
      }
    }
  }, [garmentPresentation]);

  return (
    <section className="space-y-3 flex-1 min-h-0 flex flex-col">


      {/* Garment Sub-Tabs strip */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl nm-inset-sm shrink-0">
        <button
          id="tab-garment-setup"
          onClick={() => setGarmentTab("setup")}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-wrap items-center justify-center gap-1 text-center leading-tight transition-all cursor-pointer ${
            garmentTab === "setup" ? "nm-outset-sm text-accent font-extrabold scale-[1.02]" : "text-[var(--text-primary)] hover:text-accent"
          }`}
        >
          <LuSettingsIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{lang === "en" ? "Setup" : "సెటప్"}</span>
        </button>
        <button
          id="tab-garment-studio"
          onClick={() => setGarmentTab("studio")}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-wrap items-center justify-center gap-1 text-center leading-tight transition-all cursor-pointer ${
            garmentTab === "studio" ? "nm-outset-sm text-accent font-extrabold scale-[1.02]" : "text-[var(--text-primary)] hover:text-accent"
          }`}
        >
          <User className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{lang === "en" ? "Studio" : "స్టూడియో"}</span>
        </button>
        <button
          id="tab-garment-background"
          onClick={() => setGarmentTab("background")}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-wrap items-center justify-center gap-1 text-center leading-tight transition-all cursor-pointer ${
            garmentTab === "background" ? "nm-outset-sm text-accent font-extrabold scale-[1.02]" : "text-[var(--text-primary)] hover:text-accent"
          }`}
        >
          <Palette className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{lang === "en" ? "Bg" : "బ్యాక్‌గ్రౌండ్"}</span>
        </button>
      </div>

      {/* Tab 1 Content: Merged Setup (Style + Export + Resolution) */}
      {garmentTab === "setup" && (
        <div 
          className="nm-outset nm-panel rounded-3xl p-3 sm:p-4 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
        >
          {/* User Selection Breadcrumb + Reselect Business Edit Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5 px-1">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              {lang === "en" ? "Select Business" : "బిజినెస్ ఎంచుకోండి"}
            </label>
            <div className="flex items-center justify-between p-2.5 px-3 rounded-2xl nm-inset-sm border border-black/5 dark:border-white/5 bg-[var(--bg-secondary)]/40 gap-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-emphasis)] flex-wrap">
                <span className="capitalize">{lang === "en" ? "garment" : "బట్టలు"}</span>
                <ChevronRight className="w-3.5 h-3.5 text-accent opacity-80 shrink-0" />
                <span>
                  {garmentModelGender === "female" 
                    ? (lang === "en" ? "female" : "స్త్రీల") 
                    : (lang === "en" ? "male" : "పురుషుల")}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-accent opacity-80 shrink-0" />
                <span className="text-accent font-black uppercase">
                  {t[garmentType] || garmentType.replace("_", " ")}
                </span>
              </div>
              <button
                id="btn-reselect-business-garment"
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("srushti:open-business-modal"));
                }}
                className="p-1.5 px-2 rounded-xl nm-outset-sm text-accent hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1 text-[11px] font-extrabold"
                title={lang === "en" ? "Select Business" : "బిజినెస్ మార్చండి"}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">{lang === "en" ? "Edit" : "మార్చండి"}</span>
              </button>
            </div>
          </div>

          {/* Photography Style */}
          <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
            <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5 px-1">
              <LuCameraIcon className="w-3.5 h-3.5 text-accent" />
              {lang === "en" ? "Photography Style" : "ఫోటోగ్రఫీ శైలి"}
            </label>
            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <button
                id="btn-photo-style-editorial"
                type="button"
                onClick={() => setGarmentPhotoStyle("editorial")}
                className={`p-2.5 rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all w-full cursor-pointer ${
                  garmentPhotoStyle === "editorial" ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm hover:scale-[1.01]"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {lang === "en" ? "Editorial" : "ఎడిటోరియల్"}
                </span>
                <span className="text-[9px] opacity-70 font-normal normal-case text-center">
                  {lang === "en" ? "High-fashion vogue story" : "హై-ఫ్యాషన్ వోగ్ కథనం"}
                </span>
              </button>
              <button
                id="btn-photo-style-campaign"
                type="button"
                onClick={() => setGarmentPhotoStyle("campaign")}
                className={`p-2.5 rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all w-full cursor-pointer ${
                  garmentPhotoStyle === "campaign" ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm hover:scale-[1.01]"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {lang === "en" ? "Campaign" : "క్యాంపెయిన్"}
                </span>
                <span className="text-[9px] opacity-70 font-normal normal-case text-center">
                  {lang === "en" ? "Commercial ad billboard" : "కమర్షియల్ ప్రకటన బిల్బోర్డ్"}
                </span>
              </button>
            </div>
          </div>

          {/* Orientation selection */}
          <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
            <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5 px-1">
              <LuMonitorIcon className="w-3.5 h-3.5 text-accent shrink-0" />
              {t.orientationLabel}
            </label>
            <div className="grid grid-cols-3 gap-2 w-full pt-1">
              {(["square", "portrait", "landscape"] as const).map((orient) => (
                <button
                  key={orient}
                  type="button"
                  id={`btn-garment-orient-${orient}`}
                  onClick={() => {
                    setGarmentOrientation(orient);
                    if (orient === "square") setGarmentAspectRatio("1:1");
                    else if (orient === "portrait") setGarmentAspectRatio("3:4");
                    else if (orient === "landscape") setGarmentAspectRatio("4:3");
                  }}
                  className={`py-2.5 px-2 rounded-2xl text-[10.5px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all w-full cursor-pointer ${
                    garmentOrientation === orient ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm text-[var(--text-primary)] hover:scale-[1.01]"
                  }`}
                >
                  <span className="flex items-center justify-center shrink-0">
                    {orient === "square" && <LuMaximizeIcon className="w-3.5 h-3.5" />}
                    {orient === "portrait" && <LuSmartphoneIcon className="w-3.5 h-3.5" />}
                    {orient === "landscape" && <LuMonitorIcon className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-[8.5px] sm:text-[10.5px] font-extrabold leading-tight break-words text-center whitespace-normal">{t[orient]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selection */}
          <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5">
                <LuSparklesIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                {t.resolutionLabel}
              </label>
              <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                {lang === "en" ? "Export Resolution" : "ఎక్స్‌పోర్ట్ రిజల్యూషన్"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full pt-1">
              {(["1k", "2k", "4k"] as const).map((res) => {
                const reqCredits = calculateRequiredCredits(selectedImageModel, res, gptImageQuality, garmentAspectRatio, creditSettings);
                const isSelected = garmentResolution === res;
                const isDisabled = reqCredits === 0;
                return (
                  <button
                    key={res}
                    type="button"
                    id={`btn-garment-res-${res}`}
                    onClick={() => !isDisabled && setGarmentResolution(res)}
                    disabled={isDisabled}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 w-full cursor-pointer ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed nm-inset-sm bg-black/5 dark:bg-white/5 text-[var(--text-primary)]"
                        : isSelected 
                          ? "nm-inset-sm text-accent scale-[0.98] font-black" 
                          : "nm-outset-sm text-[var(--text-primary)] hover:scale-[1.01]"
                    }`}
                  >
                    <div className="space-y-0.5 my-auto">
                      <div className="text-xs font-black tracking-wide uppercase">
                        {res}
                      </div>
                      <div className="font-mono text-[9px] opacity-75 text-center leading-none break-words">
                        {res === "1k" && (
                          (selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2") ? (
                            garmentAspectRatio === "1:1" ? "1024×1024" :
                            (garmentAspectRatio === "3:4" || garmentAspectRatio === "9:16") ? "1024×1536" : "1536×1024"
                          ) : "1024px"
                        )}
                        {res === "2k" && (
                          (selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2") ? (
                            garmentAspectRatio === "1:1" ? "2048×2048" :
                            (garmentAspectRatio === "3:4" || garmentAspectRatio === "9:16") ? "1152×2048" : "2048×1152"
                          ) : "2048px"
                        )}
                        {res === "4k" && (
                          (selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2") ? (
                            garmentAspectRatio === "1:1" ? "3840×3840" :
                            (garmentAspectRatio === "3:4" || garmentAspectRatio === "9:16") ? "2160×3840" : "3840×2160"
                          ) : "4096px"
                        )}
                      </div>
                    </div>
                    <div className="w-full mt-1">
                      <span className={`block text-[9px] font-black px-1 py-0.5 rounded-md text-center break-words leading-tight ${
                        isDisabled
                          ? "bg-black/10 dark:bg-white/10 text-gray-500 font-mono"
                          : isSelected
                            ? "bg-accent/10 text-accent font-mono border border-accent/20"
                            : "bg-black/5 dark:bg-white/5 text-[var(--text-primary)] opacity-80 font-mono"
                      }`}>
                        {isDisabled ? "N/A" : formatCredits(reqCredits)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: Studio / Human Model Options */}
      {garmentTab === "studio" && (
        <div 
          className="nm-outset nm-panel rounded-3xl p-3 sm:p-4 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
        >
          {/* Presentation Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5">
              <LuUserRoundIcon className="w-3.5 h-3.5 text-accent shrink-0" />
              {t.presentationMode}
            </label>
            <PresentationSlider
              items={(["model", "partial_face", "no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow"] as const).map((mode) => ({
                id: mode,
                label: (t as any)[mode] || (mode === "partial_face" ? ((t as any).partialFace || "Human Model(Partial Face)") : mode === "no_face" ? ((t as any).noFace || "Human Model (No Face)") : mode),
                icon: (
                  <>
                    {mode === "model" && <User className="w-4 h-4" />}
                    {mode === "partial_face" && <ScanFace className="w-4 h-4" />}
                    {mode === "no_face" && <UserX className="w-4 h-4" />}
                    {mode === "mannequin" && <LuUserRoundIcon className="w-4 h-4" />}
                    {mode === "hanger" && <Icon icon="ph:coat-hanger-bold" className="w-4 h-4" />}
                    {mode === "ghost" && <LuGhostIcon className="w-4 h-4" />}
                    {mode === "flat_lay" && <Icon icon="ph:layout-bold" className="w-4 h-4" />}
                    {mode === "folded" && <Icon icon="ph:stack-bold" className="w-4 h-4" />}
                    {mode === "shelf" && <Icon icon="lucide:grid" className="w-4 h-4" />}
                    {mode === "shopwindow" && <Icon icon="ph:storefront-bold" className="w-4 h-4" />}
                  </>
                ),
              }))}
              selectedId={garmentPresentation}
              onSelect={(mode) => setGarmentPresentation(mode)}
            />
          </div>

          {(garmentPresentation === "model" || garmentPresentation === "partial_face" || garmentPresentation === "no_face") && (
            <FaceGenerator
              gender={garmentModelGender}
              selectedFaceId={selectedFaceId}
              setSelectedFaceId={setSelectedFaceId}
              selectedFacePrompt={selectedFacePrompt}
              setSelectedFacePrompt={setSelectedFacePrompt}
              customFaces={customFaces}
              setCustomFaces={setCustomFaces}
              apiKey={apiKey}
              lang={lang}
            />
          )}
        </div>
      )}

      {/* Tab 3 Content: Background Customization */}
      {garmentTab === "background" && (
        <div 
          className="nm-outset nm-panel rounded-3xl p-4 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
        >
          {/* Background Selection */}
          <div className="space-y-2">
            <div className="flex flex-row items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-1.5">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[var(--text-emphasis)]">{t.backgroundStyle}</label>
                <span className="text-[9px] text-accent font-extrabold tracking-wide opacity-90">
                  {lang === "en" 
                    ? `Matched with ${t[garmentPresentation] || garmentPresentation}` 
                    : `${t[garmentPresentation] || garmentPresentation} శైలికి సరిపోలినవి`}
                </span>
              </div>
              
              {/* Indoor / Outdoor Segmented Filter */}
              {hasIndoor && hasOutdoor && (
                <div className="flex p-0.5 rounded-xl nm-inset-sm gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBgCategory("indoor");
                      if (comp.outdoor.includes(garmentBackground)) {
                        setGarmentBackground(comp.indoor[0] || "studio");
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 ${
                      bgCategory === "indoor" 
                        ? "nm-inset-sm text-accent scale-[1.02]" 
                        : "border-transparent text-[var(--text-emphasis)] text-opacity-60 hover:text-opacity-90"
                    }`}
                  >
                    <LuHomeIcon className="w-3 h-3 text-inherit" />
                    {lang === "en" ? "Indoor" : "ఇంటి లోపల"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBgCategory("outdoor");
                      if (comp.indoor.includes(garmentBackground)) {
                        setGarmentBackground(comp.outdoor[0] || "traditional");
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 ${
                      bgCategory === "outdoor" 
                        ? "nm-inset-sm text-accent scale-[1.02]" 
                        : "border-transparent text-[var(--text-emphasis)] text-opacity-60 hover:text-opacity-90"
                    }`}
                  >
                    <LuTreesIcon className="w-3 h-3 text-inherit" />
                    {lang === "en" ? "Outdoor" : "బయట (ప్రకృతి)"}
                  </button>
                </div>
              )}
            </div>

            <PresentationSlider
              items={(hasIndoor && hasOutdoor
                ? (bgCategory === "indoor" ? comp.indoor : comp.outdoor)
                : [...comp.indoor, ...comp.outdoor]
              ).map((bg) => ({
                id: bg,
                label: t[`bg_${bg}`] || bg,
                icon: (
                  <>
                    {bg === "plain" && <Icon icon="lucide:square" className="w-3.5 h-3.5" />}
                    {bg === "studio" && <LuCameraIcon className="w-3.5 h-3.5" />}
                    {bg === "traditional" && <LuFlowerIcon className="w-3.5 h-3.5" />}
                    {bg === "festival" && <LuFlameIcon className="w-3.5 h-3.5" />}
                    {bg === "luxury" && <LuGemIcon className="w-3.5 h-3.5" />}
                    {bg === "royal" && <LuCrownIcon className="w-3.5 h-3.5" />}
                    {bg === "vintage" && <LuCoffeeIcon className="w-3.5 h-3.5" />}
                    {bg === "modern_office" && <Icon icon="lucide:building-2" className="w-3.5 h-3.5" />}
                    {bg === "urban" && <Icon icon="lucide:building" className="w-3.5 h-3.5" />}
                  </>
                ),
              }))}
              selectedId={garmentBackground}
              onSelect={(bg) => setGarmentBackground(bg as any)}
            />
          </div>

          {/* Color choices for plain background option */}
          {garmentBackground === "plain" && (
            <div className="space-y-1.5 border-t border-black/5 dark:border-white/5 pt-2">
              <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center justify-between">
                <span>{t.bgColorLabel}</span>
                {(!PRESET_COLORS.some(col => col.name.toLowerCase() === garmentBgColor.toLowerCase() || col.hex.toLowerCase() === garmentBgColor.toLowerCase()) && garmentBgColor.startsWith("#")) && (
                  <span className="text-[10px] font-mono text-accent uppercase font-semibold">{garmentBgColor}</span>
                )}
              </label>
              <div className="flex flex-wrap gap-1.5 justify-center items-center">
                {PRESET_COLORS.map((col) => {
                  const isSelected = garmentBgColor.toLowerCase() === col.name.toLowerCase() || garmentBgColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.hex}
                      onClick={() => {
                        setGarmentBgColor(col.name.toLowerCase());
                        setShowColorPicker(false);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        isSelected ? "border-accent scale-105 shadow-md" : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  );
                })}
                {/* Custom Color Picker Button with (+) Icon using react-colorful */}
                {(() => {
                  const isPreset = PRESET_COLORS.some(
                    (col) => col.name.toLowerCase() === garmentBgColor.toLowerCase() || col.hex.toLowerCase() === garmentBgColor.toLowerCase()
                  );
                  const isCustom = !isPreset;
                  // Default custom color: rgb(128,128,128) = #808080 for desktop; max hue, saturation, value (HSV 360°,100%,100%) = #ff0000 for mobile
                  const defaultCustomHex = isMobile ? "#ff0000" : "#808080";
                  const displayHex = isCustom && garmentBgColor.startsWith("#") ? garmentBgColor : defaultCustomHex;
                  const isDark = isCustom && isDarkColor(displayHex);
                  return (
                    <div className="relative">
                      <button
                        type="button"
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          isCustom
                            ? "border-accent scale-105 shadow-md ring-2 ring-accent/30"
                            : "border-dashed border-gray-400 dark:border-gray-500 hover:border-accent hover:scale-105 bg-black/5 dark:bg-white/5"
                        }`}
                        style={{ backgroundColor: isCustom ? displayHex : undefined }}
                        title={(t as any).customColor || "Custom Color (+)"}
                        onClick={() => {
                          if (!isCustom) {
                            setGarmentBgColor(defaultCustomHex);
                          }
                          setShowColorPicker((prev) => !prev);
                        }}
                      >
                        <Icon
                          icon="lucide:plus"
                          className={`w-4 h-4 pointer-events-none transition-transform ${
                            isCustom
                              ? isDark
                                ? "text-white drop-shadow-sm font-bold scale-110"
                                : "text-black drop-shadow-sm font-bold scale-110"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* react-colorful Picker Popup Overlay */}
              {showColorPicker && (() => {
                const defaultCustomHex = isMobile ? "#ff0000" : "#808080";
                const displayHex = garmentBgColor.startsWith("#") ? garmentBgColor : defaultCustomHex;
                return (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
                    {/* Backdrop click to close */}
                    <div className="absolute inset-0" onClick={() => setShowColorPicker(false)} />

                    <div className="relative z-10 w-full max-w-[270px] p-3.5 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 space-y-3 animate-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-1.5 border-b border-black/5 dark:border-white/5">
                        <span className="text-xs font-extrabold text-[var(--text-emphasis)] flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-accent" />
                          {(t as any).customColor || "Custom Color"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(false)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-center custom-color-picker-container py-1">
                        <HexColorPicker
                          color={displayHex}
                          onChange={(newColor) => setGarmentBgColor(newColor)}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1.5 border-t border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">HEX</span>
                        <input
                          type="text"
                          value={displayHex}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith("#") && val.length > 0) val = "#" + val;
                            setGarmentBgColor(val);
                          }}
                          className="flex-1 px-2.5 py-1 text-xs font-mono font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-accent text-[var(--text-emphasis)]"
                        />
                        <div
                          className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 shadow-inner flex-shrink-0"
                          style={{ backgroundColor: displayHex }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Model Pose / Angle (Moved to Bg tab) */}
          {(garmentPresentation === "model" || garmentPresentation === "partial_face" || garmentPresentation === "no_face") && (
            <div className="space-y-2 border-t border-black/5 dark:border-white/5 pt-2">
              <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LuAccessibilityIcon className="w-3.5 h-3.5 text-accent" />
                  {t.poseLabel}
                </span>
                <span className="text-[10px] text-accent/80 font-normal">({getGarmentPoses(garmentType, garmentPresentation).length} Options)</span>
              </label>
              <PresentationSlider
                items={getGarmentPoses(garmentType, garmentPresentation).map((pose) => ({
                  id: pose,
                  label: (t as any)[pose] || pose,
                  icon: pose.includes("front") || pose.includes("portrait") ? <LuSmileIcon className="w-3.5 h-3.5" /> :
                        pose.includes("side") || pose.includes("profile") ? <LuRefreshCcwIcon className="w-3.5 h-3.5" /> :
                        pose.includes("three_quarter") || pose.includes("3q") ? <LuSparklesIcon className="w-3.5 h-3.5" /> :
                        pose.includes("walk") || pose.includes("step") || pose.includes("stance") || pose.includes("stride") ? <LuFootprintsIcon className="w-3.5 h-3.5" /> :
                        pose.includes("chair") || pose.includes("seated") || pose.includes("lap") ? <LuArmchairIcon className="w-3.5 h-3.5" /> :
                        <LuCameraIcon className="w-3.5 h-3.5" />
                }))}
                selectedId={garmentModelPose}
                onSelect={(pose) => setGarmentModelPose(pose as any)}
              />
            </div>
          )}

          {/* Generate Button in Bg Tab */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
            {(() => {
              const reqCredits = calculateRequiredCredits(
                selectedImageModel,
                garmentResolution,
                gptImageQuality,
                garmentAspectRatio,
                creditSettings
              );
              return (
                <button
                  id="btn-generate-ai-bg-tab"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-xs nm-outset flex items-center justify-center gap-2 text-[var(--text-emphasis)] bg-accent/10 hover:bg-accent/15 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <LuSparklesIcon className="w-4 h-4 text-accent animate-bounce" />
                  <span>{t.generateBtn}</span>
                  <span className="ml-1 text-[11px] font-black font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                    {formatCredits(reqCredits)}
                  </span>
                </button>
              );
            })()}
          </div>
        </div>
      )}


    </section>
  );
};
