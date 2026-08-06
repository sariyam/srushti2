import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";

import { 
  IMAGE_MODELS, 
  VIDEO_MODELS, 
  IMAGE_RESOLUTIONS, 
  GPTIMAGE2_RESOLUTIONS,
  VIDEO_RESOLUTIONS,
  getImagePrice,
  formatPrice
} from "../data";

const CreditCard = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const Key = (props: any) => <Icon icon="lucide:key" {...props} />;
const CheckCircle2 = (props: any) => <Icon icon="lucide:circle-check" {...props} />;
const Info = (props: any) => <Icon icon="lucide:info" {...props} />;
const Coins = (props: any) => <Icon icon="lucide:coins" {...props} />;
const LuImageIcon = (props: any) => <Icon icon="lucide:image" {...props} />;
const LuVideoIcon = (props: any) => <Icon icon="lucide:video" {...props} />;
const LuSparklesIcon = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const LuCalculatorIcon = (props: any) => <Icon icon="lucide:calculator" {...props} />;
const LuTrendingUpIcon = (props: any) => <Icon icon="lucide:trending-up" {...props} />;
const LuChevronDownIcon = (props: any) => <Icon icon="lucide:chevron-down" {...props} />;
const TableIcon = (props: any) => <Icon icon="lucide:table" {...props} />;
const LuRefreshCcwIcon = (props: any) => <Icon icon="lucide:refresh-ccw" {...props} />;

interface AdminWorkspaceProps {
  apiKey: string;
  apiInput: string;
  setApiInput: (val: string) => void;
  onSaveApiKey: () => void;
  estimatedCost: string;
  lang: "en" | "te";
  t: any;
  selectedImageModel: string;
  setSelectedImageModel: (val: string) => void;
  gptImageQuality?: "low" | "medium" | "high";
  setGptImageQuality?: (val: "low" | "medium" | "high") => void;
  selectedVideoModel: string;
  setSelectedVideoModel: (val: string) => void;
  selectedProvider?: "all" | "openai" | "google";
  setSelectedProvider?: (val: "all" | "openai" | "google") => void;
  currency?: "USD" | "INR";
  setCurrency?: (val: "USD" | "INR") => void;
  usdToInrRate?: number;
  setUsdToInrRate?: (val: number) => void;
  onRefreshLiveRate?: () => void;
  isFetchingRate?: boolean;
  rateFetchStatus?: string | null;
  hideTitle?: boolean;
}

const localT = {
  en: {
    tabImage: "Image Models",
    tabVideo: "Video Models",
    selectModel: "Select AI Model",
    calcTitle: "Usage Cost Calculator",
    calcSubtitle: "Calculate real-time API pricing based on your production volume",
    quantityLabel: "Number of Images",
    durationLabel: "Duration per Video",
    videoCountLabel: "Number of Videos",
    secUnit: "seconds",
    estimateResult: "Estimated Monthly Cost",
    costPerGen: "per image",
    costPerSec: "per second",
    costBreakdown: "Calculated Formula Breakdown",
    customUse: "Simulate Your Production Volume:",
    rateUnit: "rate",
    imgUnit: "images",
    videoUnit: "videos",
    modelDesc: "Model Capability Focus",
    totalEst: "Estimated Cost"
  },
  te: {
    tabImage: "చిత్రాల మోడల్స్",
    tabVideo: "వీడియో మోడల్స్",
    selectModel: "ఏఐ మోడల్‌ను ఎంచుకోండి",
    calcTitle: "లైవ్ వాడుక ధరల క్యాలిక్యులేటర్",
    calcSubtitle: "మీ ఫోటోల తయారీ వాల్యూమ్ ఆధారంగా నిజ-సమయ ఖర్చును లెక్కించండి",
    quantityLabel: "చిత్రాల సంఖ్య",
    durationLabel: "ప్రతి వీడియో నిడివి",
    videoCountLabel: "వీడియోల సంఖ్య",
    secUnit: "సెకన్లు",
    estimateResult: "అంచనా వేసిన మొత్తం ఖరీదు",
    costPerGen: "ప్రతి చిత్రానికి",
    costPerSec: "ప్రతి సెకనుకు",
    costBreakdown: "ధరల గణన వివరణ",
    customUse: "మీ ఉత్పత్తి వాల్యూమ్‌ను ఎంచుకోండి:",
    rateUnit: "రేటు",
    imgUnit: "చిత్రాలు",
    videoUnit: "వీడియోలు",
    modelDesc: "మోడల్ ప్రత్యేకత",
    totalEst: "అంచనా వ్యయం"
  }
};

export const VIDEO_MODEL_PRICING: Record<string, Record<string, number | null>> = {
  sora_2: {
    "720p": 0.10,
    "1024p": null,
    "1080p": null,
    "4K": null,
  },
  sora_2_pro: {
    "720p": 0.30,
    "1024p": 0.50,
    "1080p": 0.70,
    "4K": null,
  },
  veo31_generate_preview: {
    "720p": 0.40,
    "1024p": null,
    "1080p": 0.40,
    "4K": 0.60,
  },
  veo31_fast_generate_preview: {
    "720p": 0.10,
    "1024p": null,
    "1080p": 0.12,
    "4K": 0.30,
  },
  veo31_lite_generate_preview: {
    "720p": 0.05,
    "1024p": null,
    "1080p": 0.08,
    "4K": null, // Not supported
  }
};

export const getVideoPrice = (modelId: string, resolutionId: string): number => {
  const config = VIDEO_MODEL_PRICING[modelId];
  if (!config) return 0.25;
  const price = config[resolutionId];
  if (price === null || price === undefined) return 0;
  return price;
};

export type BillingWorkspaceProps = AdminWorkspaceProps;

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  apiKey,
  apiInput,
  setApiInput,
  onSaveApiKey,
  estimatedCost,
  lang,
  t,
  selectedImageModel,
  setSelectedImageModel,
  gptImageQuality = "medium",
  setGptImageQuality,
  selectedVideoModel,
  setSelectedVideoModel,
  selectedProvider,
  setSelectedProvider,
  currency = "USD",
  setCurrency,
  usdToInrRate = 83.5,
  setUsdToInrRate,
  onRefreshLiveRate,
  isFetchingRate = false,
  rateFetchStatus,
  hideTitle = false,
}) => {
  // Provider state
  const [internalProvider, setInternalProvider] = useState<"all" | "openai" | "google">(() => {
    return ((localStorage.getItem("srushti_selected_provider") as any) || "openai");
  });
  const activeProvider = selectedProvider || internalProvider;

  const handleSetProvider = (prov: "all" | "openai" | "google") => {
    if (setSelectedProvider) {
      setSelectedProvider(prov);
    }
    setInternalProvider(prov);
    localStorage.setItem("srushti_selected_provider", prov);
  };

  // Filter models by provider
  const filteredImageModels = IMAGE_MODELS.filter(
    (m) => activeProvider === "all" || (m as any).provider === activeProvider
  );
  const filteredVideoModels = VIDEO_MODELS.filter(
    (m) => activeProvider === "all" || (m as any).provider === activeProvider
  );

  // Auto switch selected model if filtered out
  useEffect(() => {
    if (activeProvider !== "all") {
      const isImgValid = filteredImageModels.some((m) => m.id === selectedImageModel);
      if (!isImgValid && filteredImageModels.length > 0) {
        setSelectedImageModel(filteredImageModels[0].id);
      }
      const isVidValid = filteredVideoModels.some((m) => m.id === selectedVideoModel);
      if (!isVidValid && filteredVideoModels.length > 0) {
        setSelectedVideoModel(filteredVideoModels[0].id);
      }
    }
  }, [activeProvider, selectedImageModel, selectedVideoModel, filteredImageModels, filteredVideoModels, setSelectedImageModel, setSelectedVideoModel]);

  // Toggle states
  const [modelCategory, setModelCategory] = useState<"image" | "video">("image");
  
  // Resolution dropdown states
  const [selectedImageRes, setSelectedImageRes] = useState("1k");
  const [selectedVideoRes, setSelectedVideoRes] = useState("1080p");

  // Enforce resolution limits
  useEffect(() => {
    if (selectedImageModel === "gemini31_flash_lite_image") {
      setSelectedImageRes("1k");
    } else if (selectedImageModel === "gemini25_flash_image") {
      if (selectedImageRes === "2k" || selectedImageRes === "4k") {
        setSelectedImageRes("1k");
      }
    } else if (selectedImageModel === "gptimage_2") {
      if (selectedImageRes !== "1024x1024" && selectedImageRes !== "1024x1536" && selectedImageRes !== "1536x1024") {
        setSelectedImageRes("1024x1024");
      }
    } else {
      if (selectedImageRes === "1024x1024" || selectedImageRes === "1024x1536" || selectedImageRes === "1536x1024") {
        setSelectedImageRes("1k");
      }
    }
  }, [selectedImageModel, selectedImageRes]);

  // Usage volume states
  const [imageCount, setImageCount] = useState(50);
  const [videoCount, setVideoCount] = useState(10);
  const [videoDuration, setVideoDuration] = useState(5);

  const curT = localT[lang] || localT["en"];

  // Fetch current selected model data
  const currentImageModel = IMAGE_MODELS.find(m => m.id === selectedImageModel) || IMAGE_MODELS[0];
  const currentVideoModel = VIDEO_MODELS.find(m => m.id === selectedVideoModel) || VIDEO_MODELS[0];

  // Fetch resolution settings
  const currentImageResObj = selectedImageModel === "gptimage_2"
    ? (GPTIMAGE2_RESOLUTIONS.find(r => r.id === selectedImageRes) || GPTIMAGE2_RESOLUTIONS[0])
    : (IMAGE_RESOLUTIONS.find(r => r.id === selectedImageRes) || IMAGE_RESOLUTIONS[1]);
  const currentVideoResObj = VIDEO_RESOLUTIONS.find(r => r.id === selectedVideoRes) || VIDEO_RESOLUTIONS[2];

  const currentImagePrice = getImagePrice(selectedImageModel, selectedImageRes, gptImageQuality);
  const currentVideoPrice = getVideoPrice(selectedVideoModel, selectedVideoRes);

  // Dynamic calculations
  const calculateTotalCost = () => {
    if (modelCategory === "image") {
      return imageCount * currentImagePrice;
    } else {
      return videoCount * videoDuration * currentVideoPrice;
    }
  };

  const totalCost = calculateTotalCost();

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-5 flex flex-col w-full max-w-4xl mx-auto"
    >
      {/* Title */}
      {!hideTitle && (
        <div className="flex items-center justify-between px-1 pb-1">
          <div>
            <h2 className="text-base font-extrabold text-[var(--text-emphasis)]">{t.billingTitle}</h2>
            <p className="text-[11px] opacity-75 mt-0.5">{t.billingSubtitle}</p>
          </div>
          <div className="w-8 h-8 rounded-full nm-inset-sm flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-accent" />
          </div>
        </div>
      )}

      {/* 1. Estimated Cost per Photo Card */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-3 w-full">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-sm text-[var(--text-emphasis)]">
            <Coins className="w-5 h-5 text-accent animate-pulse shrink-0" />
            {t.estCost}:
          </span>
          <span className="text-accent text-sm font-extrabold">{estimatedCost}</span>
        </div>
      </div>

      {/* 2. Currency & Exchange Rate Settings Card */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-4 bg-accent/5 border border-accent/15 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent shrink-0" />
            <div>
              <h3 className="font-extrabold text-xs text-[var(--text-emphasis)]">
                {lang === "en" ? "Currency & Conversion Settings" : "కరెన్సీ & మార్పిడి సెట్టింగ్‌లు"}
              </h3>
              <p className="text-[9px] opacity-75">
                {lang === "en" ? "Select currency and set USD to INR exchange rate" : "కరెన్సీ ఎంచుకోండి మరియు డాలర్-రూపాయి రేటును మార్చండి"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {rateFetchStatus && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {rateFetchStatus}
              </span>
            )}
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              {currency === "INR" ? "₹ INR" : "$ USD"}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-3.5 pt-1">
          {/* Display Currency */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-emphasis)] flex items-center justify-between">
              <span>{lang === "en" ? "Display Currency:" : "ప్రదర్శన కరెన్సీ:"}</span>
            </label>
            <div className="relative">
              <select
                id="select-admin-currency"
                value={currency}
                onChange={(e) => setCurrency?.(e.target.value as "USD" | "INR")}
                className="w-full p-2.5 pr-8 rounded-xl text-xs font-bold border-none outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] appearance-none cursor-pointer"
              >
                <option value="INR" className="bg-[var(--bg-panel)] font-bold">
                  🇮🇳 INR (₹ - Indian Rupee)
                </option>
                <option value="USD" className="bg-[var(--bg-panel)] font-bold">
                  🇺🇸 USD ($ - US Dollar)
                </option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[var(--text-primary)]">
                <LuChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 1 USD Exchange Rate */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-emphasis)]">
              <span>{lang === "en" ? "1 USD Exchange Rate:" : "1 డాలర్ ప్రస్తుత రేటు:"}</span>
              <span className="text-[9px] font-mono text-accent font-extrabold">₹{usdToInrRate} / USD</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-accent">₹</span>
                <input
                  id="input-usd-to-inr-rate"
                  type="number"
                  step="0.01"
                  min="1"
                  max="300"
                  value={usdToInrRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setUsdToInrRate?.(val);
                    }
                  }}
                  className="w-full p-2 pl-6 pr-2 rounded-xl text-xs font-mono font-bold outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Fetch Present Rate Button */}
              {onRefreshLiveRate && (
                <button
                  type="button"
                  onClick={onRefreshLiveRate}
                  disabled={isFetchingRate}
                  title={lang === "en" ? "Fetch present live exchange rate" : "ప్రస్తుత లైవ్ రేటును పొందండి"}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white bg-accent hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0 disabled:opacity-50"
                >
                  <LuRefreshCcwIcon className={`w-3.5 h-3.5 ${isFetchingRate ? "animate-spin" : ""}`} />
                  <span>{isFetchingRate ? "Fetching..." : lang === "en" ? "Fetch Live Rate" : "లైవ్ రేటు పొందండి"}</span>
                </button>
              )}

              {/* Quick Presets */}
              <div className="flex gap-1.5 justify-end shrink-0 pt-1 sm:pt-0">
                {[94, 95, 96].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setUsdToInrRate?.(rate)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      usdToInrRate === rate
                        ? "bg-accent text-white font-extrabold shadow-sm"
                        : "nm-outset-sm hover:text-accent opacity-80"
                    }`}
                  >
                    ₹{rate}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI Model Provider Selector Card */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-3.5 bg-accent/5 border border-accent/20 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <LuSparklesIcon className="w-5 h-5 text-accent shrink-0" />
            <div>
              <h3 className="font-extrabold text-xs text-[var(--text-emphasis)]">
                {lang === "en" ? "Select AI Model Provider" : "AI మోడల్ ప్రొవైడర్‌ను ఎంచుకోండి"}
              </h3>
              <p className="text-[9px] opacity-75">
                {lang === "en" 
                  ? "Filter image & video models by provider (OpenAI / Google)" 
                  : "ఓపెన్ AI మరియు గూగుల్ ప్రొవైడర్ ఆధారంగా మోడల్స్‌ను ఎంచుకోండి"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase self-start sm:self-auto">
            {activeProvider === "all" ? (lang === "en" ? "All Providers" : "అన్ని ప్రొవైడర్లు") : activeProvider}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: "all", labelEn: "All Providers", labelTe: "అన్ని ప్రొవైడర్లు", badge: "OpenAI & Google" },
            { id: "openai", labelEn: "OpenAI", labelTe: "ఓపెన్ AI", badge: "GPTImage-2 & Sora" },
            { id: "google", labelEn: "Google", labelTe: "గూగుల్", badge: "Gemini & Veo 3.1" },
          ].map((prov) => (
            <button
              key={prov.id}
              type="button"
              id={`btn-provider-${prov.id}`}
              onClick={() => handleSetProvider(prov.id as any)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                activeProvider === prov.id
                  ? "bg-accent text-white font-extrabold shadow-md scale-[1.02]"
                  : "nm-inset-sm opacity-75 hover:opacity-100 text-[var(--text-primary)] hover:text-accent"
              }`}
            >
              <span className="text-xs font-extrabold">
                {lang === "en" ? prov.labelEn : prov.labelTe}
              </span>
              <span className={`text-[8.5px] mt-0.5 font-mono ${activeProvider === prov.id ? "text-white/80" : "opacity-60"}`}>
                {prov.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Pricing Estimator Settings Card */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <LuCalculatorIcon className="w-5 h-5 text-accent shrink-0" />
          <div>
            <h3 className="font-extrabold text-xs text-[var(--text-emphasis)]">{curT.calcTitle}</h3>
            <p className="text-[9px] opacity-75">{curT.calcSubtitle}</p>
          </div>
        </div>

        {/* Category Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5">
          <button
            id="btn-admin-toggle-image"
            type="button"
            onClick={() => setModelCategory("image")}
            className={`py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
              modelCategory === "image" 
                ? "bg-[var(--bg-panel)] text-accent shadow-md font-extrabold scale-[1.02]" 
                : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
            }`}
          >
            <LuImageIcon className="w-4 h-4" />
            <span>{curT.tabImage}</span>
          </button>
          <button
            id="btn-admin-toggle-video"
            type="button"
            onClick={() => setModelCategory("video")}
            className={`py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
              modelCategory === "video" 
                ? "bg-[var(--bg-panel)] text-accent shadow-md font-extrabold scale-[1.02]" 
                : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
            }`}
          >
            <LuVideoIcon className="w-4 h-4" />
            <span>{curT.tabVideo}</span>
          </button>
        </div>

        {/* Models Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--text-emphasis)] flex items-center justify-between">
            <span>{curT.selectModel}</span>
            <span className="text-[10px] text-accent font-extrabold">
              {modelCategory === "image" 
                ? `${formatPrice(currentImagePrice, currency, usdToInrRate)} ${curT.costPerGen}`
                : currentVideoPrice > 0 
                  ? `${formatPrice(currentVideoPrice, currency, usdToInrRate)} ${curT.costPerSec}`
                  : lang === "en" ? "Not Supported" : "మద్దతు లేదు"}
            </span>
          </label>
          <div className="relative">
            {modelCategory === "image" ? (
              <select
                id="select-admin-image-model"
                value={selectedImageModel}
                onChange={(e) => setSelectedImageModel(e.target.value)}
                className="w-full p-3 pr-10 rounded-2xl text-[11px] font-bold border-none outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] appearance-none cursor-pointer"
              >
                {filteredImageModels.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[var(--bg-panel)]">
                    [{m.provider.toUpperCase()}] {m.name} — (Base: {formatPrice(m.price, currency, usdToInrRate)})
                  </option>
                ))}
              </select>
            ) : (
              <select
                id="select-admin-video-model"
                value={selectedVideoModel}
                onChange={(e) => setSelectedVideoModel(e.target.value)}
                className="w-full p-3 pr-10 rounded-2xl text-[11px] font-bold border-none outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] appearance-none cursor-pointer"
              >
                {filteredVideoModels.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[var(--bg-panel)]">
                    [{m.provider.toUpperCase()}] {m.name}
                  </option>
                ))}
              </select>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[var(--text-primary)]">
              <LuChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[9px] text-accent/95 font-bold px-1 italic leading-tight">
            * {curT.modelDesc}: {modelCategory === "image" ? currentImageModel.desc : currentVideoModel.desc}
          </p>
        </div>

        {/* Quality Selector for GPTImage-2 */}
        {modelCategory === "image" && selectedImageModel === "gptimage_2" && (
          <div className="space-y-1.5 p-3 rounded-2xl bg-accent/5 border border-accent/20 nm-inset-sm">
            <label className="text-[11px] font-bold text-[var(--text-emphasis)] flex items-center justify-between">
              <span className="flex items-center gap-1 text-accent font-extrabold">
                <LuSparklesIcon className="w-3.5 h-3.5" />
                GPTImage-2 Quality Level
              </span>
              <span className="text-[10px] text-accent uppercase font-mono font-extrabold">{gptImageQuality}</span>
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(["low", "medium", "high"] as const).map((qual) => (
                <button
                  key={qual}
                  type="button"
                  id={`btn-admin-quality-${qual}`}
                  onClick={() => setGptImageQuality?.(qual)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] capitalize font-bold transition-all ${
                    gptImageQuality === qual
                      ? "nm-inset-sm text-accent bg-[var(--bg-panel)] font-extrabold border border-accent/30 shadow-sm"
                      : "nm-outset-sm opacity-75 hover:opacity-100"
                  }`}
                >
                  {qual}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--text-emphasis)] flex items-center justify-between">
            <span>{lang === "en" ? "Select Generation Resolution" : "తయారీ రిజల్యూషన్ ఎంచుకోండి"}</span>
            <span className="text-[10px] text-accent font-bold">
              {modelCategory === "image" 
                ? `${(currentImageResObj.multiplier * 100).toFixed(0)}% Price Rate`
                : `Model Specific Rate`}
            </span>
          </label>
          <div className="relative">
            {modelCategory === "image" ? (
              <select
                id="select-admin-image-resolution"
                value={selectedImageRes}
                onChange={(e) => setSelectedImageRes(e.target.value)}
                className="w-full p-3 pr-10 rounded-2xl text-[11px] font-bold border-none outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] appearance-none cursor-pointer"
              >
                {selectedImageModel === "gptimage_2" ? (
                  GPTIMAGE2_RESOLUTIONS.map((res) => {
                    const finalPrice = getImagePrice("gptimage_2", res.id, gptImageQuality);
                    return (
                      <option key={res.id} value={res.id} className="bg-[var(--bg-panel)]">
                        {lang === "en" ? res.labelEn : res.labelTe} — {formatPrice(finalPrice, currency, usdToInrRate)}/img
                      </option>
                    );
                  })
                ) : (
                  IMAGE_RESOLUTIONS.map((res) => {
                    const finalPrice = getImagePrice(selectedImageModel, res.id);
                    if (finalPrice === 0) return null;
                    return (
                      <option key={res.id} value={res.id} className="bg-[var(--bg-panel)]">
                        {lang === "en" ? res.labelEn : res.labelTe} — {formatPrice(finalPrice, currency, usdToInrRate)}/img
                      </option>
                    );
                  })
                )}
              </select>
            ) : (
              <select
                id="select-admin-video-resolution"
                value={selectedVideoRes}
                onChange={(e) => setSelectedVideoRes(e.target.value)}
                className="w-full p-3 pr-10 rounded-2xl text-[11px] font-bold border-none outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] appearance-none cursor-pointer"
              >
                {VIDEO_RESOLUTIONS.map((res) => {
                  const price = getVideoPrice(selectedVideoModel, res.id);
                  return (
                    <option key={res.id} value={res.id} className="bg-[var(--bg-panel)]">
                      {lang === "en" ? res.labelEn : res.labelTe} — {price > 0 ? `${formatPrice(price, currency, usdToInrRate)}/sec` : "Not Supported"}
                    </option>
                  );
                })}
              </select>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[var(--text-primary)]">
              <LuChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[9px] text-accent font-bold px-1 italic">
            * {lang === "en" ? "Dynamic rate adjusted for chosen resolution." : "ఎంచుకున్న రిజల్యూషన్ ఆధారంగా ధర సర్దుబాటు చేయబడింది."}
          </p>
        </div>
      </div>

      {/* 4. Usage Volume Simulator & Cost Result Card */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-4 w-full">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <LuTrendingUpIcon className="w-5 h-5 text-accent animate-pulse shrink-0" />
            <div>
              <h3 className="font-extrabold text-xs text-[var(--text-emphasis)]">
                {lang === "en" ? "Usage Volume Simulator" : "ఉత్పత్తి పరిమాణాల సిమ్యులేటర్"}
              </h3>
              <p className="text-[9px] opacity-75">
                {lang === "en" ? "Simulate and adjust your monthly active volume" : "మీ నెలవారీ ఉత్పత్తి పరిమాణాలను మార్చండి"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full shrink-0">
            {modelCategory === "image" ? `${imageCount} ${curT.imgUnit}` : `${videoCount} ${curT.videoUnit}`}
          </span>
        </div>

        <div className="space-y-3.5">
          <label className="text-[11px] font-extrabold text-[var(--text-emphasis)] block">
            {curT.customUse}
          </label>

          {modelCategory === "image" ? (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="opacity-80 text-[var(--text-primary)]">{curT.quantityLabel}</span>
                <span className="text-accent font-mono font-extrabold bg-accent/10 px-2.5 py-0.5 rounded-lg text-xs">{imageCount} {curT.imgUnit}</span>
              </div>
              <input
                id="slider-admin-image-count"
                type="range"
                min="1"
                max="500"
                value={imageCount}
                onChange={(e) => setImageCount(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800"
              />
              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[9px] font-bold opacity-60 text-[var(--text-primary)] mr-1">Presets:</span>
                {[10, 50, 100, 250, 500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setImageCount(val)}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold transition-all ${
                      imageCount === val
                        ? "bg-accent text-white font-extrabold shadow-sm scale-105"
                        : "nm-outset-sm hover:text-accent opacity-80"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Video Count */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="opacity-80 text-[var(--text-primary)]">{curT.videoCountLabel}</span>
                  <span className="text-accent font-mono font-extrabold bg-accent/10 px-2.5 py-0.5 rounded-lg text-xs">{videoCount} {curT.videoUnit}</span>
                </div>
                <input
                  id="slider-admin-video-count"
                  type="range"
                  min="1"
                  max="100"
                  value={videoCount}
                  onChange={(e) => setVideoCount(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[9px] font-bold opacity-60 text-[var(--text-primary)] mr-1">Videos:</span>
                  {[5, 10, 25, 50, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setVideoCount(val)}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold transition-all ${
                        videoCount === val
                          ? "bg-accent text-white font-extrabold shadow-sm scale-105"
                          : "nm-outset-sm hover:text-accent opacity-80"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Duration */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="opacity-80 text-[var(--text-primary)]">{curT.durationLabel}</span>
                  <span className="text-accent font-mono font-extrabold bg-accent/10 px-2.5 py-0.5 rounded-lg text-xs">{videoDuration} {curT.secUnit}</span>
                </div>
                <input
                  id="slider-admin-video-duration"
                  type="range"
                  min="1"
                  max="30"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[9px] font-bold opacity-60 text-[var(--text-primary)] mr-1">Secs:</span>
                  {[5, 10, 15, 20, 30].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setVideoDuration(val)}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold transition-all ${
                        videoDuration === val
                          ? "bg-accent text-white font-extrabold shadow-sm scale-105"
                          : "nm-outset-sm hover:text-accent opacity-80"
                      }`}
                    >
                      {val}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Total Estimated Calculation Results Box */}
          <div className="mt-4 p-4 rounded-2xl bg-accent/10 border border-accent/25 space-y-2.5 nm-inset-sm">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-accent text-xs font-extrabold">
                <LuSparklesIcon className="w-4 h-4 animate-spin-slow shrink-0" />
                {curT.estimateResult}:
              </span>
              <span className="text-base font-black text-accent font-mono">
                {formatPrice(totalCost, currency, usdToInrRate)}
              </span>
            </div>

            <div className="text-[10px] font-mono text-[var(--text-emphasis)] opacity-85 border-t border-accent/20 pt-2 flex flex-col gap-1">
              <span className="font-bold text-[9px] uppercase opacity-70 block text-[var(--text-primary)]">{curT.costBreakdown}:</span>
              {modelCategory === "image" ? (
                <span className="leading-relaxed font-semibold">
                  {imageCount} {curT.imgUnit} × {formatPrice(currentImagePrice, currency, usdToInrRate)} ({currentImageResObj.name} quality) = <strong className="text-accent font-black">{formatPrice(totalCost, currency, usdToInrRate)}</strong>
                </span>
              ) : (
                <span className="leading-relaxed font-semibold">
                  {currentVideoPrice > 0 ? (
                    `${videoCount} ${curT.videoUnit} × ${videoDuration}s × ${formatPrice(currentVideoPrice, currency, usdToInrRate)}/s (${currentVideoResObj.name}) = ${formatPrice(totalCost, currency, usdToInrRate)}`
                  ) : (
                    <span className="text-red-500/90 font-sans font-semibold">
                      {lang === "en" 
                        ? `Selected resolution (${currentVideoResObj.name}) is not supported for this model.`
                        : `ఎంచుకున్న రిజల్యూషన్ (${currentVideoResObj.name}) ఈ మోడల్‌కు మద్దతు లేదు.`}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Official Price Table Matrix Card */}
      <div className="nm-outset rounded-[2rem] p-5 w-full space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <TableIcon className="w-5 h-5 text-accent animate-pulse shrink-0" />
          <div>
            <h3 className="font-extrabold text-xs text-[var(--text-emphasis)]">
              {lang === "en" ? "Official Price Table Matrix" : "అధికారిక ధరల పట్టిక"}
            </h3>
            <p className="text-[9px] opacity-75">
              {lang === "en" 
                ? "Compare cost per generation across different models and output qualities" 
                : "వివిధ మోడల్స్ మరియు రిజల్యూషన్ల ఆధారంగా ఖర్చులను సరిపోల్చండి"}
            </p>
          </div>
        </div>

        <div className="w-full">
          {modelCategory === "image" ? (
            /* Image Models Section */
            <div className="space-y-2">
              <h4 className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1.5 text-accent">
                <LuImageIcon className="w-3.5 h-3.5" />
                {lang === "en" ? `Image Models (Cost per Image in ${currency})` : `చిత్రాల మోడల్స్ (ప్రతి చిత్రానికి - ${currency})`}
              </h4>
              <div className="overflow-x-auto rounded-2xl nm-inset-sm bg-neutral-50 dark:bg-neutral-900/40 p-2 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[340px]">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5">
                      <th className="py-2 px-2 text-[8.5px] font-black uppercase tracking-wider text-[var(--text-emphasis)] w-[35%]">
                        {lang === "en" ? "Model Name" : "మోడల్ పేరు"}
                      </th>
                      <th className="py-2 px-1 text-[8.5px] font-black uppercase tracking-wider text-accent text-right">
                        0.5k <span className="opacity-60 font-normal">(512px)</span>
                      </th>
                      <th className="py-2 px-1 text-[8.5px] font-black uppercase tracking-wider text-accent text-right">
                        1k <span className="opacity-60 font-normal">(1024px)</span>
                      </th>
                      <th className="py-2 px-1 text-[8.5px] font-black uppercase tracking-wider text-accent text-right">
                        2k <span className="opacity-60 font-normal">(2048px)</span>
                      </th>
                      <th className="py-2 px-1 text-[8.5px] font-black uppercase tracking-wider text-accent text-right">
                        4k <span className="opacity-60 font-normal">(4096px)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[10px] font-medium">
                    {filteredImageModels.map((m) => (
                      <tr key={m.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2 px-2 font-bold text-[var(--text-emphasis)] text-[9.5px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{m.name.replace(" (Nano Banana 2 Lite)", "").replace(" (Nano Banana 2)", "").replace(" (Nano Banana Lite)", "").replace(" (Nano Banana Pro)", "").replace(" (Nano Banana)", "")}</span>
                            <span className={`text-[7.5px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider ${m.provider === 'openai' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'}`}>
                              {m.provider}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-[var(--text-primary)]">
                          {getImagePrice(m.id, "512k", gptImageQuality) === 0 ? "N/A" : formatPrice(getImagePrice(m.id, "512k", gptImageQuality), currency, usdToInrRate)}
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-[var(--text-primary)]">
                          {getImagePrice(m.id, "1k", gptImageQuality) === 0 ? "N/A" : formatPrice(getImagePrice(m.id, "1k", gptImageQuality), currency, usdToInrRate)}
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-[var(--text-primary)]">
                          {getImagePrice(m.id, "2k", gptImageQuality) === 0 ? "N/A" : formatPrice(getImagePrice(m.id, "2k", gptImageQuality), currency, usdToInrRate)}
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-[var(--text-primary)]">
                          {getImagePrice(m.id, "4k", gptImageQuality) === 0 ? "N/A" : formatPrice(getImagePrice(m.id, "4k", gptImageQuality), currency, usdToInrRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* OpenAI gptimage-2 Quality & Size Pricing Matrix Table */}
              <div className="mt-3 p-3 rounded-2xl bg-accent/5 border border-accent/20 nm-inset-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <LuSparklesIcon className="w-3.5 h-3.5 text-accent animate-pulse" />
                    OpenAI gptimage-2 Quality & Size Pricing Matrix
                  </h5>
                  <span className="text-[8.5px] font-extrabold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
                    {currency} Pricing
                  </span>
                </div>
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10 text-[9px] font-black uppercase tracking-wider text-[var(--text-emphasis)]">
                        <th className="py-1.5 px-2">Quality</th>
                        <th className="py-1.5 px-2 text-right">1024 x 1024</th>
                        <th className="py-1.5 px-2 text-right">1024 x 1536</th>
                        <th className="py-1.5 px-2 text-right">1536 x 1024</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono text-[10px]">
                      <tr className={gptImageQuality === "low" ? "bg-emerald-500/10 font-bold" : ""}>
                        <td className="py-1.5 px-2 font-sans font-black text-emerald-600 dark:text-emerald-400">Low</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.006, currency, usdToInrRate)}</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.005, currency, usdToInrRate)}</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.005, currency, usdToInrRate)}</td>
                      </tr>
                      <tr className={gptImageQuality === "medium" ? "bg-amber-500/10 font-bold" : ""}>
                        <td className="py-1.5 px-2 font-sans font-black text-amber-600 dark:text-amber-400">Medium</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.053, currency, usdToInrRate)}</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.041, currency, usdToInrRate)}</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.041, currency, usdToInrRate)}</td>
                      </tr>
                      <tr className={gptImageQuality === "high" ? "bg-indigo-500/10 font-bold" : ""}>
                        <td className="py-1.5 px-2 font-sans font-black text-indigo-600 dark:text-indigo-400">High</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.211, currency, usdToInrRate)}</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.165, currency, usdToInrRate)}</td>
                        <td className="py-1.5 px-2 text-right">{formatPrice(0.165, currency, usdToInrRate)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Video Models Section */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h4 className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1.5 text-accent">
                  <LuVideoIcon className="w-3.5 h-3.5" />
                  {lang === "en" ? `AI Video Models (Cost per second in ${currency})` : `ఏఐ వీడియో మోడల్స్ (ప్రతి సెకనుకు ${currency} ధరలు)`}
                </h4>
                <span className="text-[8.5px] font-bold text-accent/80 bg-accent/5 border border-accent/10 px-2 py-0.5 rounded-md">
                  {lang === "en" ? "OpenAI Sora & Google Veo" : "ఓపెన్ AI సోరా & గూగుల్ వీయో"}
                </span>
              </div>
              <p className="text-[9px] text-[var(--text-primary)] opacity-85 leading-relaxed">
                {lang === "en" 
                  ? "Next-gen AI video models from OpenAI (Sora 2 & Sora 2 Pro) and Google (Veo 3.1). Rates are calculated per second of generated video duration."
                  : "ఓపెన్ AI (సోరా 2 & సోరా 2 ప్రో) మరియు గూగుల్ (వీయో 3.1) నుండి తాజా వీడియో జనరేషన్ మోడల్స్. ధరలు సెకను ప్రకారం లెక్కించబడతాయి."}
              </p>
              <div className="overflow-x-auto rounded-2xl nm-inset-sm bg-neutral-50 dark:bg-neutral-900/40 p-3 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5 pb-2 text-[9px]">
                      <th className="py-2 px-2 font-black uppercase tracking-wider text-accent text-left w-[36%]">
                        {lang === "en" ? "Model" : "మోడల్"}
                      </th>
                      <th className="py-2 px-2 font-black uppercase tracking-wider text-accent text-right w-[16%]">
                        720p
                      </th>
                      <th className="py-2 px-2 font-black uppercase tracking-wider text-accent text-right w-[16%]">
                        1024p
                      </th>
                      <th className="py-2 px-2 font-black uppercase tracking-wider text-accent text-right w-[16%]">
                        1080p
                      </th>
                      <th className="py-2 px-2 font-black uppercase tracking-wider text-accent text-right w-[16%]">
                        4K
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[10px] font-medium">
                    {filteredVideoModels.map((m) => {
                      const shortName = m.name.split(" (")[0];
                      const endpoint = m.name.match(/\(([^)]+)\)/)?.[1] || "";
                      const pricingConfig = VIDEO_MODEL_PRICING[m.id];
                      return (
                        <tr key={m.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-2">
                            <div className="font-bold text-[var(--text-emphasis)] text-[10.5px] flex items-center gap-1.5 flex-wrap">
                              <span>{shortName}</span>
                              <span className={`text-[7.5px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider ${m.provider === 'openai' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'}`}>
                                {m.provider}
                              </span>
                            </div>
                            <div className="text-[8.5px] opacity-60 font-mono select-all">
                              {endpoint}
                            </div>
                            <div className="text-[8.5px] opacity-75 mt-0.5 leading-tight">
                              {m.desc}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-[var(--text-primary)] font-bold">
                            {pricingConfig?.["720p"] ? formatPrice(pricingConfig["720p"], currency, usdToInrRate) : "—"}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-[var(--text-primary)] font-bold">
                            {pricingConfig?.["1024p"] ? formatPrice(pricingConfig["1024p"], currency, usdToInrRate) : "—"}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-[var(--text-primary)] font-bold">
                            {pricingConfig?.["1080p"] ? formatPrice(pricingConfig["1080p"], currency, usdToInrRate) : "—"}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-[var(--text-primary)] font-bold">
                            {pricingConfig?.["4K"] !== null && pricingConfig?.["4K"] !== undefined ? (
                              formatPrice(pricingConfig["4K"], currency, usdToInrRate)
                            ) : (
                              <span className="text-neutral-400 dark:text-neutral-500 text-[8px] font-sans font-medium uppercase italic block">
                                {lang === "en" ? "Not Supported" : "మద్దతు లేదు"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
