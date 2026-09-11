import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";

import { 
  IMAGE_MODELS, 
  IMAGE_RESOLUTIONS, 
  GPTIMAGE2_RESOLUTIONS,
  getImagePrice,
  formatPrice
} from "../data";
import { 
  CreditSettings, 
  getCreditSettings, 
  saveCreditSettings, 
  DEFAULT_CREDIT_SETTINGS,
  formatCredits
} from "../utils/wallet";
import { fetchAdminUsageLogsApi, UsageLogItem } from "../utils/api";

const CreditCard = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const Coins = (props: any) => <Icon icon="lucide:coins" {...props} />;
const LuImageIcon = (props: any) => <Icon icon="lucide:image" {...props} />;
const LuSparklesIcon = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const LuCalculatorIcon = (props: any) => <Icon icon="lucide:calculator" {...props} />;
const LuTrendingUpIcon = (props: any) => <Icon icon="lucide:trending-up" {...props} />;
const LuChevronDownIcon = (props: any) => <Icon icon="lucide:chevron-down" {...props} />;
const TableIcon = (props: any) => <Icon icon="lucide:table" {...props} />;
const LuRefreshCcwIcon = (props: any) => <Icon icon="lucide:refresh-ccw" {...props} />;
const LuSlidersIcon = (props: any) => <Icon icon="lucide:sliders" {...props} />;
const LuZapIcon = (props: any) => <Icon icon="lucide:zap" {...props} />;
const LuPercentIcon = (props: any) => <Icon icon="lucide:percent" {...props} />;
const LuDollarSignIcon = (props: any) => <Icon icon="lucide:dollar-sign" {...props} />;
const LuShieldAlertIcon = (props: any) => <Icon icon="lucide:shield-alert" {...props} />;

interface AdminWorkspaceProps {
  apiKey?: string;
  apiInput?: string;
  setApiInput?: (val: string) => void;
  onSaveApiKey?: (keyType?: "gemini" | "openai") => void;
  estimatedCost: string;
  lang: "en" | "te";
  t: any;
  selectedImageModel: string;
  setSelectedImageModel: (val: string) => void;
  gptImageQuality?: "low" | "medium" | "high";
  setGptImageQuality?: (val: "low" | "medium" | "high") => void;
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

  // Validation & provider key props
  isValidatingKey?: boolean;
  keyValidationError?: string | null;
  setKeyValidationError?: (val: string | null) => void;
  geminiApiKey?: string;
  geminiApiInput?: string;
  setGeminiApiInput?: (val: string) => void;
  onSaveGeminiApiKey?: (val?: string) => void;
  openaiApiKey?: string;
  openaiApiInput?: string;
  setOpenaiApiInput?: (val: string) => void;
  onSaveOpenaiApiKey?: (val?: string) => void;
}

const localT = {
  en: {
    tabImage: "Image Models",
    selectModel: "Select AI Model",
    calcTitle: "Usage Cost Calculator",
    calcSubtitle: "Calculate real-time API pricing based on your production volume",
    quantityLabel: "Number of Images",
    estimateResult: "Estimated Monthly Cost",
    costPerGen: "per image",
    costBreakdown: "Calculated Formula Breakdown",
    customUse: "Simulate Your Production Volume:",
    rateUnit: "rate",
    imgUnit: "images",
    modelDesc: "Model Capability Focus",
    totalEst: "Estimated Cost"
  },
  te: {
    tabImage: "చిత్రాల మోడల్స్",
    selectModel: "ఏఐ మోడల్‌ను ఎంచుకోండి",
    calcTitle: "లైవ్ వాడుక ధరల క్యాలిక్యులేటర్",
    calcSubtitle: "మీ ఫోటోల తయారీ వాల్యూమ్ ఆధారంగా నిజ-సమయ ఖర్చును లెక్కించండి",
    quantityLabel: "చిత్రాల సంఖ్య",
    estimateResult: "అంచనా వేసిన మొత్తం ఖరీదు",
    costPerGen: "ప్రతి చిత్రానికి",
    costBreakdown: "ధరల గణన వివరణ",
    customUse: "మీ ప్రొడక్ట్ వాల్యూమ్‌ను ఎంచుకోండి:",
    rateUnit: "రేటు",
    imgUnit: "చిత్రాలు",
    modelDesc: "మోడల్ ప్రత్యేకత",
    totalEst: "అంచనా వ్యయం"
  }
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
  gptImageQuality = "low",
  setGptImageQuality,
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

  isValidatingKey = false,
  keyValidationError = null,
  setKeyValidationError,
  geminiApiKey,
  geminiApiInput,
  setGeminiApiInput,
  onSaveGeminiApiKey,
  openaiApiKey,
  openaiApiInput,
  setOpenaiApiInput,
  onSaveOpenaiApiKey,
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

  // Live admin usage activity log state
  const [adminUsageLogs, setAdminUsageLogs] = useState<UsageLogItem[]>([]);
  const [isLoadingUsage, setIsLoadingUsage] = useState<boolean>(false);

  const loadAdminUsage = async () => {
    setIsLoadingUsage(true);
    try {
      const logs = await fetchAdminUsageLogsApi(30);
      setAdminUsageLogs(logs);
    } catch (e) {
      console.warn("Failed to load admin usage logs:", e);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  useEffect(() => {
    loadAdminUsage();
  }, []);

  // Auto switch selected model if filtered out
  useEffect(() => {
    if (activeProvider !== "all") {
      const isImgValid = filteredImageModels.some((m) => m.id === selectedImageModel);
      if (!isImgValid && filteredImageModels.length > 0) {
        setSelectedImageModel(filteredImageModels[0].id);
      }
    }
  }, [activeProvider, selectedImageModel, filteredImageModels, setSelectedImageModel]);
  
  // Resolution dropdown states
  const [selectedImageRes, setSelectedImageRes] = useState("1k");

  // Enforce resolution limits
  useEffect(() => {
    if (selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2") {
      const isValid = GPTIMAGE2_RESOLUTIONS.some(r => r.id === selectedImageRes);
      if (!isValid) {
        setSelectedImageRes("1024x1024");
      }
    }
  }, [selectedImageModel, selectedImageRes]);

  // Usage volume states
  const [imageCount, setImageCount] = useState(50);

  const curT = localT[lang] || localT["en"];

  // Fetch current selected model data
  const currentImageModel = IMAGE_MODELS.find(m => m.id === selectedImageModel) || IMAGE_MODELS[0];

  // Fetch resolution settings
  const currentImageResObj = (selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2")
    ? (GPTIMAGE2_RESOLUTIONS.find(r => r.id === selectedImageRes) || GPTIMAGE2_RESOLUTIONS[0])
    : (IMAGE_RESOLUTIONS.find(r => r.id === selectedImageRes) || IMAGE_RESOLUTIONS[1]);

  const currentImagePrice = getImagePrice(selectedImageModel, selectedImageRes, gptImageQuality);

  // Dynamic calculations
  const totalCost = imageCount * currentImagePrice;

  // Credit Settings state
  const [creditSettings, setCreditSettings] = useState<CreditSettings>(() => getCreditSettings());
  const [creditSettingsSavedToast, setCreditSettingsSavedToast] = useState(false);

  const handleUpdateCreditSetting = (key: keyof CreditSettings, value: any) => {
    const updated = { ...creditSettings, [key]: value };
    setCreditSettings(updated);
    saveCreditSettings(updated);
    setCreditSettingsSavedToast(true);
    setTimeout(() => setCreditSettingsSavedToast(false), 2500);
  };

  const handleResetCreditSettings = () => {
    setCreditSettings(DEFAULT_CREDIT_SETTINGS);
    saveCreditSettings(DEFAULT_CREDIT_SETTINGS);
    setCreditSettingsSavedToast(true);
    setTimeout(() => setCreditSettingsSavedToast(false), 2500);
  };

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

      {/* 1. Estimated Cost per Photo Card (Displaying both Credits and Currency) */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-3 w-full bg-gradient-to-r from-accent/5 via-transparent to-accent/5 border border-accent/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0 shadow-inner">
              <Coins className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-emphasis)] block">
                {lang === "en" ? "Generation Cost Rate" : "జనరేషన్ క్రెడిట్ రేట్"}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] opacity-80">
                {lang === "en" 
                  ? "Active Model: GPTImage-2 (Low Quality • Default Payload)" 
                  : "యాక్టివ్ మోడల్: GPTImage-2 (తక్కువ క్వాలిటీ • డిఫాల్ట్ పేలోడ్)"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-accent text-white font-black text-xs shadow-md shadow-accent/25 flex items-center gap-1.5">
              <LuZapIcon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>
                {formatCredits(creditSettings.costPerImageGenLow)}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-accent/80 px-2.5 py-1 rounded-lg nm-inset-sm">
              ≈ {estimatedCost}
            </span>
          </div>
        </div>
      </div>

      {/* NEW SECTION: CREDIT SYSTEM SETTINGS */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-4 w-full border border-accent/20 bg-accent/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <LuSlidersIcon className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">
                  {lang === "en" ? "Credit System & Pricing Settings" : "క్రెడిట్ సిస్టమ్ & ధరల అమరికలు"}
                </h3>
                {creditSettingsSavedToast && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse">
                    {lang === "en" ? "Saved ✓" : "సేవ్ చేయబడింది ✓"}
                  </span>
                )}
              </div>
              <p className="text-[9.5px] opacity-75">
                {lang === "en"
                  ? "Configure credit exchange rates for Razorpay purchases, deduction costs, and threshold limits."
                  : "రేజర్‌పే కొనుగోళ్లు, తగ్గింపు ఖర్చులు మరియు లిమిట్‌ల కోసం క్రెడిట్ మార్పిడి రేట్లను కాన్ఫిగర్ చేయండి."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetCreditSettings}
            className="text-[10px] font-bold text-accent hover:underline self-start sm:self-auto cursor-pointer"
          >
            {lang === "en" ? "Reset Defaults" : "డిఫాల్ట్ పునరుద్ధరించండి"}
          </button>
        </div>

        {/* Grid of Credit Configuration Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Card: Currency to Credit Exchange Rates */}
          <div className="p-4 rounded-2xl nm-inset-sm bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-emphasis)] border-b border-black/5 dark:border-white/5 pb-2">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-accent" />
                {lang === "en" ? "Recharge Conversion Rates" : "రీఛార్జ్ మార్పిడి రేట్లు"}
              </span>
              <span className="text-[9px] text-accent font-black">Razorpay Gateway</span>
            </div>

            {/* 1 INR to Credits */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-primary)] opacity-85">
                  {lang === "en" ? "1 INR (₹) gives:" : "1 రూపాయితో లభించే క్రెడిట్స్:"}
                </span>
                <span className="font-mono text-accent font-extrabold text-xs">
                  {creditSettings.creditsPerInr} Credits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={creditSettings.creditsPerInr}
                  onChange={(e) => handleUpdateCreditSetting("creditsPerInr", Math.max(0.01, parseFloat(e.target.value) || 1))}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] focus:ring-1 focus:ring-accent"
                />
                <span className="text-[10px] font-bold opacity-60">Credits / ₹</span>
              </div>
            </div>

            {/* 1 USD to Credits */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-primary)] opacity-85">
                  {lang === "en" ? "1 USD ($) gives:" : "1 డాలర్‌తో లభించే క్రెడిట్స్:"}
                </span>
                <span className="font-mono text-accent font-extrabold text-xs">
                  {creditSettings.creditsPerUsd} Credits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={creditSettings.creditsPerUsd}
                  onChange={(e) => handleUpdateCreditSetting("creditsPerUsd", Math.max(1, parseFloat(e.target.value) || 85))}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] focus:ring-1 focus:ring-accent"
                />
                <span className="text-[10px] font-bold opacity-60">Credits / $</span>
              </div>
            </div>
          </div>

          {/* Card: AI Photo Shoot Generation Credit Costs */}
          <div className="p-4 rounded-2xl nm-inset-sm bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-emphasis)] border-b border-black/5 dark:border-white/5 pb-2">
              <span className="flex items-center gap-1.5">
                <LuSparklesIcon className="w-3.5 h-3.5 text-accent" />
                {lang === "en" ? "Photo Shoot Generation Cost" : "ఫోటో షూట్ క్రెడిట్ ఛార్జీ"}
              </span>
              <span className="text-[9px] text-accent font-black uppercase">Default [Low] Payload</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <label className="text-xs font-extrabold text-[var(--text-emphasis)] block">
                  {lang === "en" ? "Cost Per AI Photo (Credits)" : "ప్రతి ఫోటోకు క్రెడిట్ ఖర్చు"}
                </label>
                <p className="text-[10px] text-[var(--text-secondary)] opacity-75">
                  {lang === "en" ? "Standard photo generation cost sent with default [low] quality payload." : "తక్కువ ఖర్చుతో వేగంగా రూపొందించడానికి [low] క్వాలిటీతో ఒక్కో ఫోటోకు అయ్యే ఖర్చు."}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={creditSettings.costPerImageGenLow}
                  onChange={(e) => handleUpdateCreditSetting("costPerImageGenLow", Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-20 text-center py-1.5 rounded-xl text-xs font-mono font-black outline-none nm-inset-sm bg-[var(--bg-secondary)] text-accent border border-accent/30 focus:ring-1 focus:ring-accent"
                />
                <span className="text-[10px] font-bold text-accent">Credits</span>
              </div>
            </div>
          </div>

          {/* Card 3: Profit Margin & Business Markup Settings */}
          <div className="p-4 rounded-2xl nm-inset-sm bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-emphasis)] border-b border-black/5 dark:border-white/5 pb-2">
              <span className="flex items-center gap-1.5">
                <LuPercentIcon className="w-3.5 h-3.5 text-emerald-500" />
                {lang === "en" ? "Profit Margin & Markup Settings" : "లాభ మార్జిన్ & ధర మార్కప్"}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black">
                {creditSettings.pricingMode === "cost_plus_margin" 
                  ? `${creditSettings.profitMarginPercent}% Markup Active` 
                  : "Flat Rate Active"}
              </span>
            </div>

            {/* Pricing Mode Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-primary)] opacity-85">
                  {lang === "en" ? "Pricing Strategy:" : "ధరల వ్యూహం:"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl nm-inset-sm bg-black/5 dark:bg-white/5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => handleUpdateCreditSetting("pricingMode", "flat_credits")}
                  className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    creditSettings.pricingMode === "flat_credits"
                      ? "nm-outset-sm bg-[var(--bg-panel)] text-accent font-extrabold shadow-sm"
                      : "opacity-65 hover:opacity-100"
                  }`}
                >
                  <Coins className="w-3 h-3 text-inherit" />
                  <span>{lang === "en" ? "Flat Credits" : "స్థిర క్రెడిట్స్"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateCreditSetting("pricingMode", "cost_plus_margin")}
                  className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    creditSettings.pricingMode === "cost_plus_margin"
                      ? "nm-outset-sm bg-[var(--bg-panel)] text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm"
                      : "opacity-65 hover:opacity-100"
                  }`}
                >
                  <LuTrendingUpIcon className="w-3 h-3 text-inherit" />
                  <span>{lang === "en" ? "Cost + Margin" : "ఖర్చు + మార్జిన్"}</span>
                </button>
              </div>
            </div>

            {/* Profit Margin Slider & Input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-primary)] opacity-85">
                  {lang === "en" ? "Studio Profit Margin (%):" : "స్టూడియో లాభ మార్జిన్ (%):"}
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  +{creditSettings.profitMarginPercent}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={creditSettings.profitMarginPercent}
                  onChange={(e) => handleUpdateCreditSetting("profitMarginPercent", parseInt(e.target.value) || 0)}
                  className="flex-1 accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={creditSettings.profitMarginPercent}
                    onChange={(e) => handleUpdateCreditSetting("profitMarginPercent", Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 text-center py-1 rounded-xl text-xs font-mono font-bold outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] opacity-75 font-bold">%</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[8.5px] opacity-60 px-0.5">
                <span>0% (Cost Only)</span>
                <span>25% (Standard)</span>
                <span>50% (High Profit)</span>
                <span>100%+ (Premium)</span>
              </div>
            </div>

            {/* Profit Simulation Preview */}
            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[9.5px]">
              <span className="opacity-80">
                {lang === "en" ? "Example HD Photo Effective Cost:" : "ఉదాహరణ HD ఫోటో ఖర్చు:"}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {creditSettings.pricingMode === "cost_plus_margin"
                  ? `${Math.round(creditSettings.costPerImageGenMed * (1 + creditSettings.profitMarginPercent / 100) * 10) / 10} Credits (${creditSettings.costPerImageGenMed} base + ${Math.round(creditSettings.costPerImageGenMed * (creditSettings.profitMarginPercent / 100) * 10) / 10} profit)`
                  : `${creditSettings.costPerImageGenMed} Credits (Flat)`}
              </span>
            </div>
          </div>

          {/* Card 4: Wallet Security & Threshold Settings */}
          <div className="p-4 rounded-2xl nm-inset-sm bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-emphasis)] border-b border-black/5 dark:border-white/5 pb-2">
              <span className="flex items-center gap-1.5">
                <LuShieldAlertIcon className="w-3.5 h-3.5 text-amber-500" />
                {lang === "en" ? "Thresholds & Automation" : "పరిమితులు & ఆటోమేషన్"}
              </span>
              <span className="text-[9px] text-amber-500 font-black">Studio Protection</span>
            </div>

            {/* Low Balance Warning Threshold */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-primary)] opacity-85">
                  {lang === "en" ? "Low Balance Alert Threshold:" : "తక్కువ బ్యాలెన్స్ హెచ్చరిక పరిమితి:"}
                </span>
                <span className="font-mono text-amber-500 font-extrabold text-xs">
                  {creditSettings.lowBalanceThreshold} Credits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={creditSettings.lowBalanceThreshold}
                  onChange={(e) => handleUpdateCreditSetting("lowBalanceThreshold", Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-[10px] font-bold opacity-60">Credits</span>
              </div>
            </div>

            {/* Auto Credit Deduction Switch */}
            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-[var(--text-primary)] block">
                  {lang === "en" ? "Auto Deduct on Generation" : "జనరేషన్‌పై ఆటో క్రెడిట్ తగ్గింపు"}
                </span>
                <span className="text-[9px] opacity-70">
                  {lang === "en" ? "Automatically deduct balance on generation" : "ఫోటో తయారైనప్పుడు క్రెడిట్స్ వెంటనే కట్ చేయబడతాయి"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateCreditSetting("autoCreditDeduction", !creditSettings.autoCreditDeduction)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                  creditSettings.autoCreditDeduction ? "bg-accent justify-end" : "bg-neutral-300 dark:bg-neutral-700 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
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
                  ? "Standard high-performance OpenAI suite (GPTImage-2 & Sora 2)" 
                  : "ప్రామాణిక ఓపెన్ AI మోడల్స్ (GPTImage-2 మరియు సోరా 2)"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase self-start sm:self-auto">
            OpenAI
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {[
            { id: "openai", labelEn: "OpenAI AI Suite", labelTe: "ఓపెన్ AI స్వీట్", badge: "GPTImage-2 & Sora 2" }
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

        {/* Models Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--text-emphasis)] flex items-center justify-between">
            <span>{curT.selectModel}</span>
            <span className="text-[10px] text-accent font-extrabold">
              {`${formatPrice(currentImagePrice, currency, usdToInrRate)} ${curT.costPerGen}`}
            </span>
          </label>
          <div className="relative">
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[var(--text-primary)]">
              <LuChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[9px] text-accent/95 font-bold px-1 italic leading-tight">
            * {curT.modelDesc}: {currentImageModel.desc}
          </p>
        </div>

        {/* Quality & Model Status for GPT-Image-2.5 Sunburst */}
        {(selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2") && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-accent/5 border border-accent/20 nm-inset-sm text-xs">
            <div className="flex items-center gap-2">
              <LuSparklesIcon className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="font-bold text-[var(--text-emphasis)] block text-[11px]">
                  {lang === "en" ? "Model & Payload Quality" : "మోడల్ & పేలోడ్ క్వాలిటీ"}
                </span>
                <span className="text-[9.5px] text-[var(--text-secondary)] opacity-80">
                  {lang === "en" 
                    ? "Model: gpt-image-2.5-sunburst • Defaulted to [low] for rapid artisan workflow & cost-efficiency" 
                    : "మోడల్: gpt-image-2.5-sunburst • వేగవంతమైన వర్క్‌ఫ్లో కోసం [low] డిఫాల్ట్"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                sunburst
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 shrink-0">
                low
              </span>
            </div>
          </div>
        )}

        {/* Resolution Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--text-emphasis)] flex items-center justify-between">
            <span>{lang === "en" ? "Select Generation Resolution" : "తయారీ రిజల్యూషన్ ఎంచుకోండి"}</span>
            <span className="text-[10px] text-accent font-bold">
              {`${(currentImageResObj.multiplier * 100).toFixed(0)}% Price Rate`}
            </span>
          </label>
          <div className="relative">
            <select
              id="select-admin-image-resolution"
              value={selectedImageRes}
              onChange={(e) => setSelectedImageRes(e.target.value)}
              className="w-full p-3 pr-10 rounded-2xl text-[11px] font-bold border-none outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] appearance-none cursor-pointer"
            >
              {(selectedImageModel === "gpt_image_2_5_sunburst" || selectedImageModel === "gptimage_2") ? (
                GPTIMAGE2_RESOLUTIONS.map((res) => {
                  const finalPrice = getImagePrice(selectedImageModel, res.id, gptImageQuality);
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
                {lang === "en" ? "Usage Volume Simulator" : "ప్రొడక్ట్ పరిమాణాల సిమ్యులేటర్"}
              </h3>
              <p className="text-[9px] opacity-75">
                {lang === "en" ? "Simulate and adjust your monthly active volume" : "మీ నెలవారీ ప్రొడక్ట్ పరిమాణాలను మార్చండి"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full shrink-0">
            {`${imageCount} ${curT.imgUnit}`}
          </span>
        </div>

        <div className="space-y-3.5">
          <label className="text-[11px] font-extrabold text-[var(--text-emphasis)] block">
            {curT.customUse}
          </label>

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
              <span className="leading-relaxed font-semibold">
                {imageCount} {curT.imgUnit} × {formatPrice(currentImagePrice, currency, usdToInrRate)} ({currentImageResObj.name} quality) = <strong className="text-accent font-black">{formatPrice(totalCost, currency, usdToInrRate)}</strong>
              </span>
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
          {/* Image Models Section */}
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

            {/* OpenAI GPT-Image-2.5 Sunburst Quality & Size Pricing Matrix Table */}
            <div className="mt-3 p-3 rounded-2xl bg-accent/5 border border-accent/20 nm-inset-sm space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <LuSparklesIcon className="w-3.5 h-3.5 text-accent animate-pulse" />
                  OpenAI GPT-Image-2.5 Sunburst Quality & Size Pricing Matrix
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
                    <tr className="bg-accent/10 font-bold text-accent">
                      <td className="py-1.5 px-2 font-sans font-black text-accent">
                        <span className="flex items-center gap-1">
                          Low
                          <span className="text-[7.5px] uppercase tracking-wider px-1 py-0.5 rounded bg-accent/20 text-accent font-extrabold">Active Default</span>
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-right font-black">{formatPrice(0.006, currency, usdToInrRate)}</td>
                      <td className="py-1.5 px-2 text-right font-black">{formatPrice(0.005, currency, usdToInrRate)}</td>
                      <td className="py-1.5 px-2 text-right font-black">{formatPrice(0.005, currency, usdToInrRate)}</td>
                    </tr>
                    <tr className="text-[var(--text-primary)] opacity-60">
                      <td className="py-1.5 px-2 font-sans font-medium text-[var(--text-primary)]">Medium</td>
                      <td className="py-1.5 px-2 text-right">{formatPrice(0.053, currency, usdToInrRate)}</td>
                      <td className="py-1.5 px-2 text-right">{formatPrice(0.041, currency, usdToInrRate)}</td>
                      <td className="py-1.5 px-2 text-right">{formatPrice(0.041, currency, usdToInrRate)}</td>
                    </tr>
                    <tr className="text-[var(--text-primary)] opacity-60">
                      <td className="py-1.5 px-2 font-sans font-medium text-[var(--text-primary)]">High</td>
                      <td className="py-1.5 px-2 text-right">{formatPrice(0.211, currency, usdToInrRate)}</td>
                      <td className="py-1.5 px-2 text-right">{formatPrice(0.165, currency, usdToInrRate)}</td>
                      <td className="py-1.5 px-2 text-right">{formatPrice(0.165, currency, usdToInrRate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Live AI Generation & Usage Activity Card */}
      <div className="nm-outset rounded-[2rem] p-5 space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:activity" className="w-5 h-5 text-accent shrink-0" />
            <div>
              <h3 className="font-extrabold text-xs text-[var(--text-emphasis)]">
                {lang === "en" ? "Live AI Generation & Usage Activity" : "లైవ్ ఏఐ ఫోటో షూట్ వాడుక వివరాలు"}
              </h3>
              <p className="text-[9px] opacity-75">
                {lang === "en" ? "Real-time audit log of photo shoots and credit deductions" : "నిజ సమయ ఏఐ ఫోటో షూట్ మరియు క్రెడిట్స్ వివరాలు"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadAdminUsage}
            disabled={isLoadingUsage}
            className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold nm-outset-sm text-accent hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <LuRefreshCcwIcon className={`w-3 h-3 ${isLoadingUsage ? "animate-spin" : ""}`} />
            <span>{lang === "en" ? "Refresh" : "తాజాకరించు"}</span>
          </button>
        </div>

        <div className="space-y-2">
          {adminUsageLogs.length === 0 ? (
            <div className="p-6 rounded-2xl nm-inset-sm text-center text-[var(--text-primary)] opacity-60 text-xs">
              <Icon icon="lucide:inbox" className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-accent" />
              <span>{lang === "en" ? "No recent usage activity found." : "ఇటీవలి వాడుక లాగ్‌లు ఏవీ లేవు."}</span>
            </div>
          ) : (
            <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {adminUsageLogs.map((item) => {
                const dateStr = new Date(item.createdAt).toLocaleDateString(lang === "te" ? "te-IN" : "en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl nm-inset-sm bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Icon icon="lucide:camera" className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-[11px] text-[var(--text-emphasis)] capitalize truncate">
                            {item.workspace} Shoot • {item.itemType}
                          </span>
                          {item.userPhone && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5 opacity-75">
                              {item.userPhone}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[9.5px] opacity-60 mt-0.5">
                          <span>{dateStr}</span>
                          {item.latencyMs && <span>• {item.latencyMs}ms</span>}
                          {item.metadata?.resolution && <span>• {item.metadata.resolution}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-black text-rose-500 text-xs block">
                        -{formatCredits(item.creditsDeducted)}
                      </span>
                      <span
                        className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-full inline-block mt-0.5 ${
                          item.status === "failed" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
