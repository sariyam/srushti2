import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";

const SettingsIcon = (props: any) => <Icon icon="lucide:settings" {...props} />;
const KeyIcon = (props: any) => <Icon icon="lucide:key" {...props} />;
const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const LanguagesIcon = (props: any) => <Icon icon="lucide:languages" {...props} />;
const CheckCircle2Icon = (props: any) => <Icon icon="lucide:circle-check" {...props} />;
const InfoIcon = (props: any) => <Icon icon="lucide:info" {...props} />;
const EyeIcon = (props: any) => <Icon icon="lucide:eye" {...props} />;
const EyeOffIcon = (props: any) => <Icon icon="lucide:eye-off" {...props} />;
const SparklesIcon = (props: any) => <Icon icon="lucide:sparkles" {...props} />;

interface SettingsWorkspaceProps {
  apiKey: string;
  apiInput: string;
  setApiInput: (val: string) => void;
  onSaveApiKey: (keyType?: "gemini" | "openai") => void;
  theme: "light" | "dark";
  setTheme: (val: "light" | "dark") => void;
  lang: "en" | "te";
  setLang: (val: "en" | "te") => void;
  t: any;
  hideTitle?: boolean;
  isValidatingKey?: boolean;
  keyValidationError?: string | null;
  setKeyValidationError?: (val: string | null) => void;

  // Provider-aligned settings props
  selectedProvider?: "all" | "openai" | "google";
  setSelectedProvider?: (val: "all" | "openai" | "google") => void;
  selectedImageModel?: string;
  selectedVideoModel?: string;
  geminiApiKey?: string;
  geminiApiInput?: string;
  setGeminiApiInput?: (val: string) => void;
  onSaveGeminiApiKey?: (val?: string) => void;
  openaiApiKey?: string;
  openaiApiInput?: string;
  setOpenaiApiInput?: (val: string) => void;
  onSaveOpenaiApiKey?: (val?: string) => void;
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({
  apiKey,
  apiInput,
  setApiInput,
  onSaveApiKey,
  theme,
  setTheme,
  lang,
  setLang,
  t,
  hideTitle = false,
  isValidatingKey = false,
  keyValidationError = null,
  setKeyValidationError,

  selectedProvider = "openai",
  setSelectedProvider,
  selectedImageModel,
  selectedVideoModel,
  geminiApiKey,
  geminiApiInput,
  setGeminiApiInput,
  onSaveGeminiApiKey,
  openaiApiKey,
  openaiApiInput,
  setOpenaiApiInput,
  onSaveOpenaiApiKey,
}) => {
  const [showKey, setShowKey] = useState(false);

  // Automatically take active provider key type directly from Admin Panel settings
  const isOpenAiSelected = 
    selectedProvider === "openai" || 
    (selectedProvider === "all" && (selectedImageModel === "gptimage_2" || selectedVideoModel === "sora_2" || selectedVideoModel === "sora_2_pro"));

  const isGemini = !isOpenAiSelected;
  const activeKeyType: "gemini" | "openai" = isGemini ? "gemini" : "openai";

  // Determine current field values based on active key type from Admin Panel
  const currentInputVal = isGemini 
    ? (geminiApiInput !== undefined ? geminiApiInput : apiInput) 
    : (openaiApiInput !== undefined ? openaiApiInput : apiInput);

  const handleInputChange = (val: string) => {
    if (isGemini) {
      if (setGeminiApiInput) setGeminiApiInput(val);
      else setApiInput(val);
    } else {
      if (setOpenaiApiInput) setOpenaiApiInput(val);
      else setApiInput(val);
    }
    if (setKeyValidationError) setKeyValidationError(null);
  };

  const handleSaveCurrentKey = () => {
    if (isGemini) {
      if (onSaveGeminiApiKey) onSaveGeminiApiKey(currentInputVal);
      else onSaveApiKey("gemini");
    } else {
      if (onSaveOpenaiApiKey) onSaveOpenaiApiKey(currentInputVal);
      else onSaveApiKey("openai");
    }
  };

  const currentSavedKey = isGemini
    ? (geminiApiKey !== undefined ? geminiApiKey : apiKey)
    : (openaiApiKey !== undefined ? openaiApiKey : (apiKey.startsWith("sk-") ? apiKey : ""));

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 landscape:space-y-0 landscape:grid landscape:grid-cols-2 landscape:gap-6"
    >
      {/* Title */}
      {!hideTitle && (
        <div className="flex items-center justify-between px-1 col-span-2 landscape:hidden">
          <div>
            <h2 className="text-base font-extrabold text-[var(--text-emphasis)]">{t.settingsTitle}</h2>
            <p className="text-[11px] opacity-75 mt-0.5">{t.settingsSubtitle}</p>
          </div>
          <div className="w-8 h-8 rounded-full nm-inset-sm flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-accent" />
          </div>
        </div>
      )}

      {/* Left Column: Provider-Based API Key Configuration */}
      <div className="space-y-4 flex flex-col h-full justify-between">
        <div className="nm-outset rounded-[2rem] p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header with Title & Active Provider Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-accent" />
                <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">
                  {lang === "en" ? "API Key Configuration" : "API కీ అమరికలు"}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 shrink-0">
                <SparklesIcon className="w-3 h-3 text-accent" />
                <span>
                  {selectedProvider === "all"
                    ? (lang === "en" ? "All AI Models" : "అన్ని AI మోడల్స్")
                    : selectedProvider === "openai"
                    ? "OpenAI"
                    : "Google AI"}
                </span>
              </div>
            </div>

            {/* Active Provider Indicator */}
            <div className="flex items-center justify-between p-3 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5 text-xs font-bold">
              <span className="opacity-70 text-[11px]">
                {lang === "en" ? "Active Provider:" : "యాక్టివ్ ప్రొవైడర్:"}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-panel)] font-extrabold shadow-sm">
                <span className={`w-2 h-2 rounded-full ${isGemini ? "bg-blue-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`}></span>
                <span className={isGemini ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"}>
                  {isGemini ? "Google Gemini" : "OpenAI"}
                </span>
              </div>
            </div>

            {/* Help Text for Active Provider Key */}
            <p className="text-[11px] opacity-85 leading-relaxed">
              {isGemini ? (
                lang === "en"
                  ? "Enter your Google Gemini API Key (starts with AIza). Required for Gemini 3.1 Flash/Pro Image & Veo 3.1 Video models."
                  : "AIza తో ప్రారంభమయ్యే మీ గూగుల్ జెమిని API కీని నమోదు చేయండి. జెమిని 3.1 మరియు వీయో 3.1 కోసం అవసరం."
              ) : (
                lang === "en"
                  ? "Enter your OpenAI API Key (starts with sk-). Required for GPTImage-2 Image & Sora 2 Video models."
                  : "sk- తో ప్రారంభమయ్యే మీ ఓపెన్ AI API కీని నమోదు చేయండి. GPTImage-2 మరియు సోరా 2 కోసం అవసరం."
              )}
            </p>

            {/* Masked Password Style Input with Eye Toggle */}
            <div className="space-y-2">
              <div className="relative flex items-center">
                <input
                  id={`settings-api-key-${activeKeyType}`}
                  type={showKey ? "text" : "password"}
                  value={currentInputVal}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={
                    isGemini 
                      ? "Paste Gemini Key (e.g. AIzaSy...)" 
                      : "Paste OpenAI Key (e.g. sk-proj-...)"
                  }
                  className={`w-full p-3.5 pr-11 rounded-2xl text-xs font-mono border outline-none nm-inset-sm bg-[var(--bg-secondary)] focus:ring-2 focus:ring-accent text-[var(--text-emphasis)] ${
                    keyValidationError ? "border-red-500 focus:ring-red-500" : "border-transparent"
                  }`}
                  disabled={isValidatingKey}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 text-xs text-[var(--text-primary)] opacity-60 hover:opacity-100 p-1 rounded-lg transition-opacity"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOffIcon className="w-4 h-4 text-accent" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>

              {/* Validation Error Message Alert */}
              {keyValidationError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[11px] font-extrabold flex items-start gap-2 shadow-sm"
                >
                  <InfoIcon className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span className="leading-snug">{keyValidationError}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Status and Save Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              {currentSavedKey ? (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2Icon className="w-3.5 h-3.5" />
                  {isGemini ? "Saved Gemini Key" : "Saved OpenAI Key"}
                </span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1">
                  <InfoIcon className="w-3.5 h-3.5 animate-pulse" />
                  {isGemini ? "Gemini Key Required" : "OpenAI Key Required"}
                </span>
              )}
            </div>

            <button
              id={`settings-btn-save-${activeKeyType}`}
              onClick={handleSaveCurrentKey}
              disabled={isValidatingKey}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold nm-outset-sm text-accent bg-accent/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 ${
                isValidatingKey ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {isValidatingKey && (
                <svg className="animate-spin h-3.5 w-3.5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isValidatingKey ? t.validatingKey : t.saveKey}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Theme & Language Preferences */}
      <div className="space-y-4 flex flex-col h-full justify-between">
        {/* Theme Selection Card */}
        <div className="nm-outset rounded-[2rem] p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {theme === "light" ? <SunIcon className="w-5 h-5 text-accent" /> : <MoonIcon className="w-5 h-5 text-accent" />}
              <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">{t.settingsThemeLabel}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5">
              <button
                id="settings-theme-light"
                onClick={() => setTheme("light")}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  theme === "light" 
                    ? "bg-[var(--bg-panel)] text-accent shadow-md font-extrabold scale-[1.02]" 
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                <SunIcon className="w-4 h-4" />
                <span>{t.lightTheme}</span>
              </button>
              
              <button
                id="settings-theme-dark"
                onClick={() => setTheme("dark")}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  theme === "dark" 
                    ? "bg-[var(--bg-panel)] text-accent shadow-md font-extrabold scale-[1.02]" 
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                <MoonIcon className="w-4 h-4" />
                <span>{t.darkTheme}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="nm-outset rounded-[2rem] p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LanguagesIcon className="w-5 h-5 text-accent" />
              <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">{t.settingsLanguageLabel}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5">
              <button
                id="settings-lang-en"
                onClick={() => setLang("en")}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  lang === "en" 
                    ? "bg-[var(--bg-panel)] text-accent shadow-md font-extrabold scale-[1.02]" 
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                English
              </button>
              
              <button
                id="settings-lang-te"
                onClick={() => setLang("te")}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  lang === "te" 
                    ? "bg-[var(--bg-panel)] text-accent shadow-md font-extrabold scale-[1.02]" 
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
