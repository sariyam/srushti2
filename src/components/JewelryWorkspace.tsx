import React from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { HexColorPicker } from "react-colorful";
import { PRESET_COLORS, IMAGE_MODELS, IMAGE_RESOLUTIONS, getImagePrice, formatPrice } from "../data";
import { GENDER_JEWELRY_MAPPING, JEWELRY_BUST_MAPPING, JEWELRY_CATEGORY_MAPPING, getJewelryPoses } from "../utils/optionMapping";
import { FaceGenerator, ModelFace } from "./FaceGenerator";
import { PresentationSlider } from "./PresentationSlider";
import { HorizontalSliderTrack } from "./HorizontalSliderTrack";

const Gem = (props: any) => <Icon icon="lucide:gem" {...props} />;
const User = (props: any) => <Icon icon="lucide:user" {...props} />;
const Palette = (props: any) => <Icon icon="lucide:palette" {...props} />;
const Crown = (props: any) => <Icon icon="lucide:crown" {...props} />;
const UserRound = (props: any) => <Icon icon="lucide:user-round" {...props} />;
const Watch = (props: any) => <Icon icon="lucide:watch" {...props} />;
const Circle = (props: any) => <Icon icon="lucide:circle" {...props} />;
const Camera = (props: any) => <Icon icon="lucide:camera" {...props} />;
const Flame = (props: any) => <Icon icon="lucide:flame" {...props} />;
const Flower = (props: any) => <Icon icon="lucide:flower" {...props} />;
const Layers = (props: any) => <Icon icon="lucide:layers" {...props} />;
const LuAccessibilityIcon = (props: any) => <Icon icon="lucide:accessibility" {...props} />;
const LuSmileIcon = (props: any) => <Icon icon="lucide:smile" {...props} />;
const LuRefreshCcwIcon = (props: any) => <Icon icon="lucide:refresh-ccw" {...props} />;
const LuSparklesIcon = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const LuArmchairIcon = (props: any) => <Icon icon="lucide:armchair" {...props} />;
const LuCoffeeIcon = (props: any) => <Icon icon="lucide:coffee" {...props} />;
const LuFootprintsIcon = (props: any) => <Icon icon="lucide:footprints" {...props} />;
const LuCoinsIcon = (props: any) => <Icon icon="lucide:coins" {...props} />;
const LuChevronDownIcon = (props: any) => <Icon icon="lucide:chevron-down" {...props} />;
const Link = (props: any) => <Icon icon="lucide:link" {...props} />;
const Heart = (props: any) => <Icon icon="lucide:heart" {...props} />;
const Leaf = (props: any) => <Icon icon="lucide:leaf" {...props} />;
const Waves = (props: any) => <Icon icon="lucide:waves" {...props} />;
const Sun = (props: any) => <Icon icon="lucide:sun" {...props} />;
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

interface JewelryWorkspaceProps {
  jewelryTab: "setup" | "studio" | "background";
  setJewelryTab: (tab: "setup" | "studio" | "background") => void;
  jewelryType: "earrings" | "necklace" | "chain" | "ring" | "finger" | "bracelet" | "watch" | "anklet" | "nose_ring" | "nose" | "noise" | "bangles" | "choker" | "cufflinks" | "pendant" | "kada" | "maang_tikka" | "matha_patti" | "borla" | "passa" | "headband";
  setJewelryType: (type: any) => void;
  jewelryPresentation: "model" | "bust";
  setJewelryPresentation: (mode: "model" | "bust") => void;
  jewelryModelGender: "female" | "male";
  setJewelryModelGender: (gender: "female" | "male") => void;
  jewelryModelPose: "neck_collarbone" | "side_ear_profile" | "hand_face_gesture" | "three_quarter_gaze" | "wrist_hand_display" | "front_direct_portrait";
  setJewelryModelPose: (pose: any) => void;
  jewelryBustRegion: "head" | "neck" | "wrist" | "ankle" | "finger" | "hand" | "naturally" | "ear";
  setJewelryBustRegion: (region: any) => void;
  jewelryBackground: "plain" | "studio" | "luxury" | "festival" | "traditional" | "wood" | "beach" | "velvet" | "silk" | "granite" | "mirror";
  setJewelryBackground: (bg: any) => void;
  jewelryBgColor: string;
  setJewelryBgColor: (color: string) => void;
  lang: "en" | "te";
  t: any;
  selectedFaceId: string;
  setSelectedFaceId: (id: string) => void;
  selectedFacePrompt: string;
  setSelectedFacePrompt: (prompt: string) => void;
  customFaces: ModelFace[];
  setCustomFaces: React.Dispatch<React.SetStateAction<ModelFace[]>>;
  apiKey: string;
  jewelryOrientation: "square" | "portrait" | "landscape";
  setJewelryOrientation: (val: "square" | "portrait" | "landscape") => void;
  jewelryResolution: "512k" | "1k" | "2k" | "4k";
  setJewelryResolution: (val: "512k" | "1k" | "2k" | "4k") => void;
  jewelryAspectRatio: "1:1" | "4:3" | "16:9" | "3:4" | "9:16";
  setJewelryAspectRatio: (val: "1:1" | "4:3" | "16:9" | "3:4" | "9:16") => void;
  selectedImageModel: string;
  setSelectedImageModel: (val: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  jewelryPhotoStyle: "editorial" | "campaign";
  setJewelryPhotoStyle: (val: "editorial" | "campaign") => void;
  gptImageQuality?: "low" | "medium" | "high";
  setGptImageQuality?: (val: "low" | "medium" | "high") => void;
  currency?: "USD" | "INR";
  usdToInrRate?: number;
}

export const JewelryWorkspace: React.FC<JewelryWorkspaceProps> = ({
  jewelryTab,
  setJewelryTab,
  jewelryType,
  setJewelryType,
  jewelryPresentation,
  setJewelryPresentation,
  jewelryModelGender,
  setJewelryModelGender,
  jewelryModelPose,
  setJewelryModelPose,
  jewelryBustRegion,
  setJewelryBustRegion,
  jewelryBackground,
  setJewelryBackground,
  jewelryBgColor,
  setJewelryBgColor,
  lang,
  t,
  selectedFaceId,
  setSelectedFaceId,
  selectedFacePrompt,
  setSelectedFacePrompt,
  customFaces,
  setCustomFaces,
  apiKey,
  jewelryOrientation,
  setJewelryOrientation,
  jewelryResolution,
  setJewelryResolution,
  jewelryAspectRatio,
  setJewelryAspectRatio,
  selectedImageModel,
  setSelectedImageModel,
  onGenerate,
  isGenerating,
  jewelryPhotoStyle,
  setJewelryPhotoStyle,
  gptImageQuality = "medium",
  setGptImageQuality,
  currency = "USD",
  usdToInrRate = 83.5,
}) => {
  const [bgCategory, setBgCategory] = React.useState<"indoor" | "outdoor">(() => {
    return (["beach"].includes(jewelryBackground)) ? "outdoor" : "indoor";
  });
  const [jewelryCategoryFilter, setJewelryCategoryFilter] = React.useState<"neck_ear" | "ear_wear" | "wrist_ring" | "hip" | "nose" | "finger" | "leg" | "forehead" | "accessories">("neck_ear");
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep model pose valid when jewelryType changes
  React.useEffect(() => {
    const allowed = getJewelryPoses(jewelryType);
    if (!allowed.includes(jewelryModelPose)) {
      setJewelryModelPose(allowed[0]);
    }
  }, [jewelryType]);

  // Define background compatibility per jewelry presentation mode
  const JEWELRY_BG_COMPATIBILITY: Record<string, { indoor: string[]; outdoor: string[] }> = {
    model: {
      indoor: ["plain", "studio"],
      outdoor: []
    },
    bust: {
      indoor: ["plain", "studio", "luxury", "traditional", "wood", "velvet", "silk", "granite", "mirror"],
      outdoor: ["beach"]
    }
  };

  const comp = JEWELRY_BG_COMPATIBILITY[jewelryPresentation] || JEWELRY_BG_COMPATIBILITY.model;
  const hasIndoor = comp.indoor.length > 0;
  const hasOutdoor = comp.outdoor.length > 0;

  // Automatically align selected background when presentation mode changes
  React.useEffect(() => {
    const currentComp = JEWELRY_BG_COMPATIBILITY[jewelryPresentation] || JEWELRY_BG_COMPATIBILITY.model;
    const allAllowed = [...currentComp.indoor, ...currentComp.outdoor];
    if (!allAllowed.includes(jewelryBackground)) {
      const fallbackBg = currentComp.indoor[0] || currentComp.outdoor[0] || "plain";
      setJewelryBackground(fallbackBg);
      setBgCategory(currentComp.indoor.includes(fallbackBg) ? "indoor" : "outdoor");
    } else {
      if (currentComp.indoor.includes(jewelryBackground)) {
        setBgCategory("indoor");
      } else if (currentComp.outdoor.includes(jewelryBackground)) {
        setBgCategory("outdoor");
      }
    }
  }, [jewelryPresentation]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "earrings": return <Gem className="w-5 h-5 text-accent" />;
      case "necklace": return <Crown className="w-5 h-5 text-accent" />;
      case "chain": return <Link className="w-5 h-5 text-accent" />;
      case "ring": return <Circle className="w-5 h-5 text-accent" />;
      case "bracelet": return <Heart className="w-5 h-5 text-accent" />;
      case "watch": return <Watch className="w-5 h-5 text-accent" />;
      default: return <Gem className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section className="space-y-3 flex-1 min-h-0 flex flex-col">


      {/* Jewelry Sub-Tabs strip */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl nm-inset-sm shrink-0">
        <button
          id="tab-jewelry-setup"
          onClick={() => setJewelryTab("setup")}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-wrap items-center justify-center gap-1 text-center leading-tight transition-all cursor-pointer ${
            jewelryTab === "setup" ? "nm-outset-sm text-accent font-extrabold scale-[1.02]" : "text-[var(--text-muted)] opacity-70 hover:opacity-100"
          }`}
        >
          <LuSettingsIcon className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
          <span className="break-words">{lang === "en" ? "Setup" : "సెటప్"}</span>
        </button>
        <button
          id="tab-jewelry-studio"
          onClick={() => setJewelryTab("studio")}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-wrap items-center justify-center gap-1 text-center leading-tight transition-all cursor-pointer ${
            jewelryTab === "studio" ? "nm-outset-sm text-accent font-extrabold scale-[1.02]" : "text-[var(--text-muted)] opacity-70 hover:opacity-100"
          }`}
        >
          <User className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{lang === "en" ? "Studio" : "స్టూడియో"}</span>
        </button>
        <button
          id="tab-jewelry-background"
          onClick={() => setJewelryTab("background")}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-wrap items-center justify-center gap-1 text-center leading-tight transition-all cursor-pointer ${
            jewelryTab === "background" ? "nm-outset-sm text-accent font-extrabold scale-[1.02]" : "text-[var(--text-muted)] opacity-70 hover:opacity-100"
          }`}
        >
          <Palette className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{lang === "en" ? "Bg" : "బ్యాక్‌గ్రౌండ్"}</span>
        </button>
      </div>

      {/* Tab 1 Content: Merged Setup (Style + Export + Resolution) */}
      {jewelryTab === "setup" && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="nm-outset rounded-3xl p-3 sm:p-4 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
        >
          {/* User Selection Breadcrumb + Reselect Business Edit Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5 px-1">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              {lang === "en" ? "Select Business" : "బిజినెస్ ఎంచుకోండి"}
            </label>
            <div className="flex items-center justify-between p-2.5 px-3 rounded-2xl nm-inset-sm border border-black/5 dark:border-white/5 bg-[var(--bg-secondary)]/40 gap-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-emphasis)] flex-wrap">
                <span className="capitalize">{lang === "en" ? "jewelry" : "నగలు"}</span>
                <ChevronRight className="w-3.5 h-3.5 text-accent opacity-80 shrink-0" />
                <span>
                  {jewelryModelGender === "female" 
                    ? (lang === "en" ? "female" : "స్త్రీల") 
                    : (lang === "en" ? "male" : "పురుషుల")}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-accent opacity-80 shrink-0" />
                <span className="text-accent font-black uppercase">
                  {t[jewelryType] || jewelryType}
                </span>
              </div>
              <button
                id="btn-reselect-business-jewelry"
                type="button"
                onClick={() => {
                  document.getElementById("btn-trigger-business-modal")?.click();
                }}
                className="p-1.5 px-2 rounded-xl nm-outset-sm text-accent hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-accent/20 flex items-center gap-1 text-[11px] font-extrabold"
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
              <Camera className="w-3.5 h-3.5 text-accent" />
              {lang === "en" ? "Photography Style" : "ఫోటోగ్రఫీ శైలి"}
            </label>
            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <button
                id="btn-photo-style-editorial"
                type="button"
                onClick={() => setJewelryPhotoStyle("editorial")}
                className={`p-2.5 rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all w-full cursor-pointer ${
                  jewelryPhotoStyle === "editorial" ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm hover:scale-[1.01]"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {lang === "en" ? "Editorial" : "ఎడిటోరియల్"}
                </span>
                <span className="text-[9px] opacity-70 font-normal normal-case text-center">
                  {lang === "en" ? "Creative stories & mood" : "సృజనాత్మక కథనాలు & మూడ్"}
                </span>
              </button>
              <button
                id="btn-photo-style-campaign"
                type="button"
                onClick={() => setJewelryPhotoStyle("campaign")}
                className={`p-2.5 rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all w-full cursor-pointer ${
                  jewelryPhotoStyle === "campaign" ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm hover:scale-[1.01]"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {lang === "en" ? "Campaign" : "క్యాంపెయిన్"}
                </span>
                <span className="text-[9px] opacity-70 font-normal normal-case text-center">
                  {lang === "en" ? "Commercial promotional shine" : "వాణిజ్య ప్రచార ప్రకాశం"}
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
                  id={`btn-jewelry-orient-${orient}`}
                  onClick={() => {
                    setJewelryOrientation(orient);
                    if (orient === "square") setJewelryAspectRatio("1:1");
                    else if (orient === "portrait") setJewelryAspectRatio("3:4");
                    else if (orient === "landscape") setJewelryAspectRatio("4:3");
                  }}
                  className={`py-2 px-2.5 rounded-2xl text-[10.5px] font-extrabold flex flex-row items-center justify-center gap-1.5 transition-all w-full cursor-pointer ${
                    jewelryOrientation === orient ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm hover:scale-[1.01]"
                  }`}
                >
                  <span className="flex items-center justify-center shrink-0">
                    {orient === "square" && <LuMaximizeIcon className="w-3.5 h-3.5 text-accent" />}
                    {orient === "portrait" && <LuSmartphoneIcon className="w-3.5 h-3.5 text-accent" />}
                    {orient === "landscape" && <LuMonitorIcon className="w-3.5 h-3.5 text-accent" />}
                  </span>
                  <span className="truncate">{t[orient]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Render Quality Selector (if gptimage_2) */}
          {selectedImageModel === "gptimage_2" && (
            <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5">
                  <LuSparklesIcon className="w-3.5 h-3.5 text-accent animate-pulse shrink-0" />
                  {lang === "en" ? "Render Quality" : "ఫోటో క్వాలిటీ"}
                </label>
                <span className="text-[9px] font-extrabold text-accent px-1.5 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                  {lang === "en" ? "Quality Level" : "క్వాలిటీ స్థాయి"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full pt-1">
                {(["low", "medium", "high"] as const).map((qual) => {
                  const isSelected = gptImageQuality === qual;
                  const price = getImagePrice("gptimage_2", jewelryResolution, qual, jewelryAspectRatio);
                  return (
                    <button
                      key={qual}
                      type="button"
                      id={`btn-jewelry-quality-${qual}`}
                      onClick={() => setGptImageQuality?.(qual)}
                      className={`py-2 px-2 rounded-xl flex flex-col items-center justify-center text-center transition-all w-full cursor-pointer ${
                        isSelected
                          ? "nm-inset-sm text-accent scale-[0.98] border-2 border-accent/30 font-black"
                          : "nm-outset-sm opacity-80 hover:opacity-100"
                      }`}
                    >
                      <span className="text-[11px] capitalize font-black">{qual}</span>
                      <span className="text-[9.5px] font-mono text-accent font-extrabold mt-0.5">{formatPrice(price, currency, usdToInrRate)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resolution Selection */}
          <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5">
                <LuSparklesIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                {t.resolutionLabel}
              </label>
              <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                {currency === "INR" ? `₹ INR (@ ₹${usdToInrRate.toFixed(2)}/USD)` : "$ USD"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1">
              {(["512k", "1k", "2k", "4k"] as const).map((res) => {
                const finalPrice = getImagePrice(selectedImageModel, res, gptImageQuality, jewelryAspectRatio);
                const isSelected = jewelryResolution === res;
                const isDisabled = finalPrice === 0;
                return (
                  <button
                    key={res}
                    type="button"
                    id={`btn-jewelry-res-${res}`}
                    onClick={() => !isDisabled && setJewelryResolution(res)}
                    disabled={isDisabled}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 w-full cursor-pointer ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed nm-inset-sm bg-black/5 dark:bg-white/5"
                        : isSelected 
                          ? "nm-inset-sm text-accent scale-[0.98] border-2 border-accent/20" 
                          : "nm-outset-sm hover:scale-[1.01]"
                    }`}
                  >
                    <div className="space-y-0.5 my-auto">
                      <div className="text-xs font-black tracking-wide uppercase">
                        {res}
                      </div>
                      <div className="font-mono text-[9px] opacity-75 text-center leading-none break-words">
                        {res === "512k" && "512px"}
                        {res === "1k" && (
                          selectedImageModel === "gptimage_2" ? (
                            jewelryAspectRatio === "1:1" ? "1024×1024" :
                            (jewelryAspectRatio === "3:4" || jewelryAspectRatio === "9:16" || jewelryAspectRatio === "2:3") ? "1024×1536" : "1536×1024"
                          ) : "1024px"
                        )}
                        {res === "2k" && (
                          selectedImageModel === "gptimage_2" ? (
                            jewelryAspectRatio === "1:1" ? "2048×2048" :
                            (jewelryAspectRatio === "3:4" || jewelryAspectRatio === "9:16" || jewelryAspectRatio === "2:3") ? "1152×2048" : "2048×1152"
                          ) : "2048px"
                        )}
                        {res === "4k" && (
                          selectedImageModel === "gptimage_2" ? (
                            jewelryAspectRatio === "1:1" ? "3840×3840" :
                            (jewelryAspectRatio === "3:4" || jewelryAspectRatio === "9:16" || jewelryAspectRatio === "2:3") ? "2160×3840" : "3840×2160"
                          ) : "4096px"
                        )}
                      </div>
                    </div>
                    <div className="w-full mt-1">
                      <span className={`block text-[9px] font-black px-1 py-0.5 rounded-md text-center break-words leading-tight ${
                        isDisabled
                          ? "bg-black/10 dark:bg-white/10 text-gray-500 font-mono"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono"
                      }`}>
                        {isDisabled ? "N/A" : formatPrice(finalPrice, currency, usdToInrRate)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2 Content: Studio / Face or Bust display selection */}
      {jewelryTab === "studio" && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="nm-outset rounded-3xl p-3 sm:p-4 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
        >
          {/* Presentation Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center gap-1.5">
              <UserRound className="w-3.5 h-3.5 text-accent shrink-0" />
              {t.presentationMode}
            </label>
            <PresentationSlider
              items={[
                {
                  id: "model" as const,
                  label: t.model,
                  icon: <User className="w-4 h-4 text-accent" />,
                },
                {
                  id: "bust" as const,
                  label: t.bust,
                  icon: <UserRound className="w-4 h-4 text-accent" />,
                },
              ]}
              selectedId={jewelryPresentation}
              onSelect={(mode) => setJewelryPresentation(mode)}
            />
          </div>

          {/* 1. If Human Model Mode */}
          {jewelryPresentation === "model" ? (
            <FaceGenerator
              gender={jewelryModelGender}
              selectedFaceId={selectedFaceId}
              setSelectedFaceId={setSelectedFaceId}
              selectedFacePrompt={selectedFacePrompt}
              setSelectedFacePrompt={setSelectedFacePrompt}
              customFaces={customFaces}
              setCustomFaces={setCustomFaces}
              apiKey={apiKey}
              lang={lang}
            />
          ) : (
            // 2. If Mount Bust display mode
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-emphasis)]">{t.bustDisplay}</label>
              <div className="grid gap-1.5 grid-cols-2 sm:grid-cols-4">
                {(JEWELRY_BUST_MAPPING[jewelryType] || ["head", "neck", "wrist", "ankle", "finger", "hand", "naturally", "ear"]).map((region) => (
                  <button
                    key={region}
                    onClick={() => setJewelryBustRegion(region)}
                    className={`py-1.5 px-2 rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
                      jewelryBustRegion === region ? "nm-inset-sm text-accent scale-[0.98]" : "nm-outset-sm"
                    }`}
                  >
                    <span className="flex items-center justify-center h-4">
                      {region === "head" && <Icon icon="lucide:smile" className="w-3.5 h-3.5 text-accent" />}
                      {region === "neck" && <Icon icon="lucide:crown" className="w-3.5 h-3.5 text-accent" />}
                      {region === "wrist" && <Icon icon="lucide:circle-dashed" className="w-3.5 h-3.5 text-accent" />}
                      {region === "ankle" && <LuFootprintsIcon className="w-3.5 h-3.5 text-accent" />}
                      {region === "finger" && <Icon icon="lucide:circle-dot" className="w-3.5 h-3.5 text-accent" />}
                      {region === "hand" && <Icon icon="lucide:hand" className="w-3.5 h-3.5 text-accent" />}
                      {region === "naturally" && <LuSparklesIcon className="w-3.5 h-3.5 text-accent" />}
                      {region === "ear" && <Icon icon="lucide:disc" className="w-3.5 h-3.5 text-accent" />}
                    </span>
                    {(t as any)[`region_${region}`] || (t as any)[region] || region}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 3 Content: Background selections */}
      {jewelryTab === "background" && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="nm-outset rounded-3xl p-4 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
        >
          {/* Background Selection */}
          <div className="space-y-2">
            <div className="flex flex-row items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-1.5">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[var(--text-emphasis)]">{t.backgroundStyle}</label>
                <span className="text-[9px] text-accent font-extrabold tracking-wide opacity-90">
                  {lang === "en" 
                    ? `Matched with ${t[jewelryPresentation] || jewelryPresentation}` 
                    : `${t[jewelryPresentation] || jewelryPresentation} శైలికి సరిపోలినవి`}
                </span>
              </div>
              
              {/* Indoor / Outdoor Segmented Filter */}
              {hasIndoor && hasOutdoor && (
                <div className="flex p-0.5 rounded-xl nm-inset-sm gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBgCategory("indoor");
                      if (comp.outdoor.includes(jewelryBackground)) {
                        setJewelryBackground(comp.indoor[0] || "luxury");
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 border ${
                      bgCategory === "indoor" 
                        ? "border-accent text-accent scale-[1.02]" 
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
                      if (comp.indoor.includes(jewelryBackground)) {
                        setJewelryBackground(comp.outdoor[0] || "beach");
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 border ${
                      bgCategory === "outdoor" 
                        ? "border-accent text-accent scale-[1.02]" 
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
                    {bg === "plain" && <Icon icon="lucide:square" className="w-3.5 h-3.5 text-accent" />}
                    {bg === "studio" && <Camera className="w-3.5 h-3.5 text-accent" />}
                    {bg === "luxury" && <Gem className="w-3.5 h-3.5 text-accent" />}
                    {bg === "festival" && <Flame className="w-3.5 h-3.5 text-accent" />}
                    {bg === "traditional" && <Flower className="w-3.5 h-3.5 text-accent" />}
                    {bg === "wood" && <Icon icon="lucide:tree-pine" className="w-3.5 h-3.5 text-accent" />}
                    {bg === "beach" && <Sun className="w-3.5 h-3.5 text-accent" />}
                    {bg === "velvet" && <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5 text-accent" />}
                    {bg === "silk" && <Icon icon="ph:waves-bold" className="w-3.5 h-3.5 text-accent" />}
                    {bg === "granite" && <Icon icon="lucide:box" className="w-3.5 h-3.5 text-accent" />}
                    {bg === "mirror" && <LuSparklesIcon className="w-3.5 h-3.5 text-accent" />}
                  </>
                ),
              }))}
              selectedId={jewelryBackground}
              onSelect={(bg) => setJewelryBackground(bg as any)}
            />
          </div>

          {jewelryBackground === "plain" && (
            <div className="space-y-1.5 border-t border-black/5 dark:border-white/5 pt-2">
              <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center justify-between">
                <span>{t.bgColorLabel}</span>
                {(!PRESET_COLORS.some(col => col.name.toLowerCase() === jewelryBgColor.toLowerCase() || col.hex.toLowerCase() === jewelryBgColor.toLowerCase()) && jewelryBgColor.startsWith("#")) && (
                  <span className="text-[10px] font-mono text-accent uppercase font-semibold">{jewelryBgColor}</span>
                )}
              </label>
              <div className="flex flex-wrap gap-1.5 justify-center items-center">
                {PRESET_COLORS.map((col) => {
                  const isSelected = jewelryBgColor.toLowerCase() === col.name.toLowerCase() || jewelryBgColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.hex}
                      onClick={() => {
                        setJewelryBgColor(col.name.toLowerCase());
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
                    (col) => col.name.toLowerCase() === jewelryBgColor.toLowerCase() || col.hex.toLowerCase() === jewelryBgColor.toLowerCase()
                  );
                  const isCustom = !isPreset;
                  // Default custom color: rgb(128,128,128) = #808080 for desktop; max hue, saturation, value (HSV 360°,100%,100%) = #ff0000 for mobile
                  const defaultCustomHex = isMobile ? "#ff0000" : "#808080";
                  const displayHex = isCustom && jewelryBgColor.startsWith("#") ? jewelryBgColor : defaultCustomHex;
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
                            setJewelryBgColor(defaultCustomHex);
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
                const displayHex = jewelryBgColor.startsWith("#") ? jewelryBgColor : defaultCustomHex;
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
                          onChange={(newColor) => setJewelryBgColor(newColor)}
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
                            setJewelryBgColor(val);
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
          {jewelryPresentation === "model" && (
            <div className="space-y-2 border-t border-black/5 dark:border-white/5 pt-2">
              <label className="text-xs font-bold text-[var(--text-emphasis)] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LuAccessibilityIcon className="w-3.5 h-3.5 text-accent" />
                  {t.poseLabel}
                </span>
                <span className="text-[10px] text-accent/80 font-normal">({getJewelryPoses(jewelryType).length} Options)</span>
              </label>
              <PresentationSlider
                items={getJewelryPoses(jewelryType).map((pose) => ({
                  id: pose,
                  label: t[pose] || pose,
                  icon: pose.includes("neck") || pose.includes("chest") || pose.includes("collarbone") ? <Gem className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("ear") || pose.includes("profile") || pose.includes("tilt") ? <LuRefreshCcwIcon className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("hand") || pose.includes("gesture") || pose.includes("finger") || pose.includes("chin") ? <LuSmileIcon className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("wrist") || pose.includes("arm") || pose.includes("cross") ? <Watch className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("hip") || pose.includes("waist") ? <UserRound className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("nose") || pose.includes("veil") || pose.includes("nostril") ? <LuSparklesIcon className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("anklet") || pose.includes("ankle") || pose.includes("foot") || pose.includes("toe") ? <LuFootprintsIcon className="w-3.5 h-3.5 text-accent" /> :
                        pose.includes("forehead") || pose.includes("tikka") || pose.includes("passa") || pose.includes("borla") || pose.includes("matha") ? <Crown className="w-3.5 h-3.5 text-accent" /> :
                        <User className="w-3.5 h-3.5 text-accent" />
                }))}
                selectedId={jewelryModelPose}
                onSelect={(pose) => setJewelryModelPose(pose as any)}
              />
            </div>
          )}

          {/* Generate Button in Bg Tab */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
            <button
              id="btn-generate-ai-bg-tab"
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl font-extrabold text-xs nm-outset flex items-center justify-center gap-1.5 text-[var(--text-emphasis)] bg-accent/10 hover:bg-accent/15 border border-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <LuSparklesIcon className="w-4 h-4 text-accent animate-bounce" />
              <span>{t.generateBtn}</span>
            </button>
          </div>
        </motion.div>
      )}


    </section>
  );
};
