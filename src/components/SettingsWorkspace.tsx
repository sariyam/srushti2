import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { LOGOS_BASE64 } from "../assets/logoBase64";
import frontLogo from "../assets/front_logo.png";
import {
  sendOtpApi,
  verifyOtpApi,
  fetchCurrentUserApi,
  getStoredAuthUser,
  removeAuthData,
} from "../utils/api";

const UserIcon = (props: any) => <Icon icon="lucide:user" {...props} />;
const PhoneIcon = (props: any) => <Icon icon="lucide:phone" {...props} />;
const CheckCircleIcon = (props: any) => <Icon icon="lucide:check-circle-2" {...props} />;
const ShieldCheckIcon = (props: any) => <Icon icon="lucide:shield-check" {...props} />;
const LogOutIcon = (props: any) => <Icon icon="lucide:log-out" {...props} />;
const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const LanguagesIcon = (props: any) => <Icon icon="lucide:languages" {...props} />;
const KeyRoundIcon = (props: any) => <Icon icon="lucide:key-round" {...props} />;
const ArrowRightIcon = (props: any) => <Icon icon="lucide:arrow-right" {...props} />;
const RefreshCwIcon = (props: any) => <Icon icon="lucide:refresh-cw" {...props} />;
const SmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const InfoIcon = (props: any) => <Icon icon="lucide:info" {...props} />;
const FileTextIcon = (props: any) => <Icon icon="lucide:file-text" {...props} />;
const XIcon = (props: any) => <Icon icon="lucide:x" {...props} />;
const EyeIcon = (props: any) => <Icon icon="lucide:eye" {...props} />;
const EyeOffIcon = (props: any) => <Icon icon="lucide:eye-off" {...props} />;
const LockIcon = (props: any) => <Icon icon="lucide:lock" {...props} />;

const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
};

const maskPhoneNumber = (phone: string): string => {
  if (!phone) return "••••• •••••";
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    const last4 = digits.slice(-4);
    return `+91 ••••• •${last4}`;
  }
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    return `•••• •${last4}`;
  }
  return "••••• •••••";
};

interface SettingsWorkspaceProps {
  apiKey?: string;
  apiInput?: string;
  setApiInput?: (val: string) => void;
  onSaveApiKey?: (keyType?: "gemini" | "openai") => void;
  theme: "light" | "dark";
  setTheme: (val: "light" | "dark") => void;
  lang: "en" | "te";
  setLang: (val: "en" | "te") => void;
  t: any;
  hideTitle?: boolean;
  isValidatingKey?: boolean;
  keyValidationError?: string | null;
  setKeyValidationError?: (val: string | null) => void;

  selectedProvider?: "all" | "openai" | "google";
  setSelectedProvider?: (val: "all" | "openai" | "google") => void;
  selectedImageModel?: string;
  geminiApiKey?: string;
  geminiApiInput?: string;
  setGeminiApiInput?: (val: string) => void;
  onSaveGeminiApiKey?: (val?: string) => void;
  openaiApiKey?: string;
  openaiApiInput?: string;
  setOpenaiApiInput?: (val: string) => void;
  onSaveOpenaiApiKey?: (val?: string) => void;

  isSignedOut?: boolean;
  setIsSignedOut?: (val: boolean) => void;
  onCloseModal?: () => void;
  onSignInSuccess?: () => void;
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
  isValidatingKey,
  keyValidationError,
  setKeyValidationError,
  selectedProvider,
  setSelectedProvider,
  selectedImageModel,
  geminiApiKey,
  geminiApiInput,
  setGeminiApiInput,
  onSaveGeminiApiKey,
  openaiApiKey,
  openaiApiInput,
  setOpenaiApiInput,
  onSaveOpenaiApiKey,
  isSignedOut: propIsSignedOut,
  setIsSignedOut: propSetIsSignedOut,
  onCloseModal,
  onSignInSuccess,
}) => {
  // Profile Field States
  const [phoneNumber, setPhoneNumber] = useState(() => {
    const stored = getStoredAuthUser();
    if (stored?.phone) return stored.phone;
    return localStorage.getItem("srushti_user_phone") || "";
  });
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [internalSignedOut, setInternalSignedOut] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("srushti_is_signed_out") === "true";
    }
    return false;
  });

  const isSignedOut = propIsSignedOut !== undefined ? propIsSignedOut : internalSignedOut;
  const setIsSignedOut = propSetIsSignedOut || setInternalSignedOut;

  // Phone + OTP Sign In States
  const [authCountryCode, setAuthCountryCode] = useState("+91");
  const [authPhone, setAuthPhone] = useState("98765 43210");
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [otpValue, setOtpValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isEn = lang === "en";

  // Sync profile from backend on mount if already authenticated
  useEffect(() => {
    const initUser = async () => {
      const stored = getStoredAuthUser();
      if (stored && stored.phone) {
        setPhoneNumber(stored.phone);
      }
      try {
        const liveUser = await fetchCurrentUserApi();
        if (liveUser && liveUser.phone) {
          setPhoneNumber(liveUser.phone);
        }
      } catch (e) {
        // Silently ignore background refresh errors
      }
    };
    initUser();
  }, []);

  const resendTimerRef = React.useRef<any>(null);

  const startResendTimer = () => {
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    setResendCooldown(120);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = authPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setOtpError(
        isEn
          ? "Please enter a valid 10-digit mobile number."
          : "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి."
      );
      return;
    }

    setOtpError(null);
    setIsSendingOtp(true);

    try {
      const formattedPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
      const res = await sendOtpApi(formattedPhone);
      setIsSendingOtp(false);
      setOtpStep("otp");
      setOtpValue("");

      setOtpNotice(
        isEn
          ? `OTP dispatched via SMS to ${authCountryCode} ${formattedPhone}.`
          : `SMS ద్వారా ${authCountryCode} ${formattedPhone} కి OTP పంపబడింది.`
      );
      startResendTimer();
    } catch (err: any) {
      setIsSendingOtp(false);
      setOtpError(
        err?.message ||
          (isEn
            ? "Failed to dispatch OTP. Please check your network and try again."
            : "OTP పంపడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.")
      );
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpValue || otpValue.trim().length !== 6) {
      setOtpError(
        isEn
          ? "Please enter the 6-digit OTP code sent to your phone."
          : "దయచేసి మీ ఫోన్‌కు పంపిన 6 అంకెల OTP కోడ్‌ను నమోదు చేయండి."
      );
      return;
    }

    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      const cleanPhone = authPhone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
      const res = await verifyOtpApi(formattedPhone, otpValue);

      setIsVerifyingOtp(false);
      const verifiedUser = (res as any)?.user || res.data?.user;
      const verifiedPhone = verifiedUser?.phone || (cleanPhone.length === 10 ? cleanPhone : formattedPhone);
      if (verifiedPhone) {
        setPhoneNumber(verifiedPhone);
        localStorage.setItem("srushti_user_phone", verifiedPhone);
      }

      setIsSignedOut(false);
      setOtpStep("phone");
      setOtpValue("");
      setOtpNotice(null);

      if (onSignInSuccess) {
        onSignInSuccess();
      } else if (onCloseModal) {
        onCloseModal();
      }
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setOtpError(
        err?.message ||
          (isEn
            ? "Invalid or expired OTP. Please verify and try again."
            : "చెల్లని లేదా గడువు ముగిసిన OTP. దయచేసి తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.")
      );
    }
  };

  const handleSignOut = () => {
    removeAuthData();
    setPhoneNumber("");
    setIsSignedOut(true);
    setOtpStep("phone");
    setOtpValue("");
    setOtpError(null);
    setOtpNotice(null);
  };

  const renderNoteCard = () => (
    <div className="neu-m3-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-2.5 bg-[var(--md-surface-container-high)] border border-amber-500/30 w-full min-w-0">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <InfoIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
        <h4 className="font-extrabold text-xs sm:text-sm tracking-tight">
          {lang === "te" ? "ముఖ్య గమనిక" : "Important Note"}
        </h4>
      </div>
      <p className="text-[11px] sm:text-xs leading-relaxed text-[var(--md-on-surface-variant)] opacity-90 font-medium break-words">
        {lang === "te"
          ? "జనరేట్ చేయబడిన చిత్రాల ఖచ్చితత్వం అప్‌లోడ్ చేసిన ప్రొడక్ట్ ఇమేజ్ యొక్క నాణ్యత మరియు స్పష్టతపై ఆధారపడి ఉంటుంది. సోర్స్ ఇమేజ్ తక్కువ రిజల్యూషన్, మసకగా, క్రాప్ చేయబడి లేదా కనిపించే వివరాలు లేనట్లయితే, ఫలితాలు మారవచ్చు."
          : "The accuracy of generated images depends on the quality and clarity of the uploaded product image. If the source image is low-resolution, blurry, cropped, or lacks visible details, the generated image may vary from the original product."}
      </p>
      <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] sm:text-xs font-bold text-[var(--md-on-surface-variant)]">
        <span>{lang === "te" ? "Srushti AI ని ఉపయోగించడం ద్వారా, మీరు మా" : "By using Srushti AI, you agree to our"}</span>
        <a
          id="link-terms-and-conditions"
          href="/termsandconditions"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-accent hover:opacity-80 transition-opacity cursor-pointer font-extrabold"
        >
          {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
        </a>
        <span>{lang === "te" ? "మరియు" : "&"}</span>
        <a
          id="link-privacy-policy"
          href="/privacypolicy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-accent hover:opacity-80 transition-opacity cursor-pointer font-extrabold"
        >
          {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
        </a>
        <span>{lang === "te" ? "కు అంగీకరిస్తున్నారు." : ""}</span>
        <span className="opacity-40">•</span>
        <a
          href="mailto:hi@srushtiai.in"
          className="text-accent underline hover:opacity-80 font-bold"
        >
          Support: hi@srushtiai.in
        </a>
      </div>
    </div>
  );

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`space-y-4 sm:space-y-5 w-full mx-auto ${isSignedOut ? "max-w-4xl" : "max-w-xl"}`}
    >
      {/* Title Header */}
      {!hideTitle && (
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--md-on-surface)]">{t.settingsTitle}</h2>
            <p className="text-xs text-[var(--md-on-surface-variant)] opacity-75 mt-0.5">{t.settingsSubtitle}</p>
          </div>
          <div className="w-9 h-9 rounded-full neu-m3-inset-sm flex items-center justify-center text-accent">
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      )}

      {/* Responsive Grid: 2-column grid when signed out on desktop/tablet, clean single column when signed in */}
      <div className={isSignedOut ? "grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch p-1 sm:p-1.5 w-full" : "w-full space-y-4 sm:space-y-5 p-1"}>
        {/* Left Side: Account Profile or Sign In Card */}
        <div className="space-y-4 sm:space-y-5 w-full min-w-0">
          {isSignedOut ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="neu-m3-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 space-y-4 sm:space-y-5 bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] w-full"
            >
              {/* Header Logo above Sign In */}
              <div className="flex items-center justify-center text-center gap-3 pt-1 pb-3 border-b border-black/5 dark:border-white/5">
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl overflow-hidden neu-m3-inset-sm p-2 bg-[var(--md-surface-container-lowest)] flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src={LOGOS_BASE64.front || frontLogo || "/assets/front_logo.png"}
                    alt="Srushti AI Logo"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.failed) {
                        target.dataset.failed = "1";
                        target.src = frontLogo || "/assets/front_logo.png";
                      } else if (target.dataset.failed === "1") {
                        target.dataset.failed = "2";
                        target.src = "/front_logo.png";
                      }
                    }}
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-[var(--md-on-surface)] tracking-tight">Srushti AI</h2>
                  <p className="text-xs sm:text-sm font-extrabold text-accent uppercase tracking-wider">Business to Brand</p>
                </div>
              </div>

              {/* Step indicator header */}
              <div className="flex items-start sm:items-center justify-between border-b border-black/5 dark:border-white/5 pb-3 gap-2">
                <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-m3-inset-sm flex items-center justify-center text-accent bg-accent/10 shrink-0">
                    <SmartphoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-[var(--md-on-surface)] leading-tight">
                      {isEn ? "Sign In to Your Account" : "మీ ఖాతాలోకి సైన్ ఇన్ అవ్వండి"}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--md-on-surface-variant)] opacity-70 mt-0.5 leading-snug">
                      {otpStep === "phone"
                        ? (isEn ? "Enter phone number to receive 6-digit OTP code" : "6 అంకెల OTP కోడ్‌ను అందుకోవడానికి ఫోన్ నంబర్‌ను నమోదు చేయండి")
                        : (isEn ? `OTP sent to ${authCountryCode} ${authPhone}` : `OTP ${authCountryCode} ${authPhone} కి పంపబడింది`)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 shrink-0">
                  <KeyRoundIcon className="w-3 h-3 text-accent" />
                  <span>{otpStep === "phone" ? (isEn ? "Step 1 of 2" : "దశ 1/2") : (isEn ? "Step 2 of 2" : "దశ 2/2")}</span>
                </div>
              </div>

              {/* Step 1: Phone Number Entry */}
              {otpStep === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5 sm:space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-extrabold opacity-80 text-xs sm:text-sm block text-[var(--md-on-surface)]">
                      {isEn ? "Mobile Phone Number" : "మొబైల్ ఫోన్ నంబర్"}
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Fixed Country Code */}
                      <div
                        id="fixed-country-code"
                        className="px-3 sm:px-3.5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-mono font-bold neu-m3-inset-sm bg-[var(--md-surface-container-lowest)] text-[var(--md-on-surface)] shrink-0 flex items-center justify-center select-none gap-1 border border-black/5 dark:border-white/5"
                      >
                        <span className="text-accent font-black">IN</span>
                        <span>+91</span>
                      </div>

                      {/* Phone Input */}
                      <div className="relative flex-1 flex items-center min-w-0">
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full p-3 sm:p-3.5 pl-9 sm:pl-10 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-wider neu-m3-input bg-[var(--md-surface-container-lowest)] text-[var(--md-on-surface)]"
                        />
                        <PhoneIcon className="w-4 h-4 absolute left-3 opacity-50 text-[var(--md-on-surface-variant)]" />
                      </div>
                    </div>
                  </div>

                  {otpError && (
                    <p className="text-xs font-bold text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                      {otpError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className={`w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold neu-m3-btn-filled flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isSendingOtp ? "opacity-70 pointer-events-none" : ""
                    }`}
                  >
                    {isSendingOtp ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-[var(--md-on-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{isEn ? "Sending OTP..." : "OTP పంపుతోంది..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{isEn ? "Send OTP via SMS" : "SMS ద్వారా OTP పంపండి"}</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleVerifyOtp} className="space-y-3.5 sm:space-y-4">
                  {/* Notice Banner */}
                  {otpNotice && (
                    <div className="p-3 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span className="break-words">{otpNotice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("phone");
                          setOtpError(null);
                        }}
                        className="text-xs font-extrabold underline text-accent shrink-0 cursor-pointer self-end sm:self-auto"
                      >
                        {isEn ? "Change Number" : "నంబర్ మార్చు"}
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <label className="font-extrabold opacity-80 block text-[var(--md-on-surface)]">
                        {isEn ? "Enter 6-Digit OTP" : "6 అంకెల OTP నమోదు చేయండి"}
                      </label>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="w-full p-3 sm:p-3.5 pl-10 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-[0.25em] sm:tracking-[0.35em] neu-m3-input bg-[var(--md-surface-container-lowest)] text-[var(--md-on-surface)]"
                      />
                      <KeyRoundIcon className="w-4 h-4 absolute left-3.5 opacity-50 text-accent" />
                    </div>
                  </div>

                  {otpError && (
                    <p className="text-xs font-bold text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                      {otpError}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isSendingOtp}
                      onClick={() => handleSendOtp()}
                      className={`w-full sm:w-auto px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold neu-m3-btn-tonal flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                        resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <RefreshCwIcon className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                      <span>
                        {resendCooldown > 0
                          ? `${isEn ? "Resend in" : "తిరిగి పంపు"} ${resendCooldown}s`
                          : isEn
                          ? "Resend OTP"
                          : "OTP మళ్ళీ పంపు"}
                      </span>
                    </button>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold neu-m3-btn-filled flex items-center justify-center gap-2 cursor-pointer ${
                        isVerifyingOtp ? "opacity-70 pointer-events-none" : ""
                      }`}
                    >
                      {isVerifyingOtp ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-[var(--md-on-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>{isEn ? "Verifying OTP..." : "OTP పరిశీలిస్తోంది..."}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="w-4 h-4 text-accent" />
                          <span>{isEn ? "Verify & Sign In" : "పరిశీలించి సైన్ ఇన్ అవ్వండి"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            /* User Profile Details (When Authenticated) */
            <div className="space-y-4 sm:space-y-5 w-full">
              {/* Account Phone & Security Card */}
              <div className="neu-m3-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 space-y-4 bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)]">
                {/* Registered Phone Number with Eye Security Toggle */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs sm:text-sm">
                    <label className="font-extrabold opacity-80 flex items-center gap-1.5 text-[var(--md-on-surface)]">
                      <PhoneIcon className="w-4 h-4 text-accent" />
                      <span>{isEn ? "Registered Phone Number" : "నమోదైన ఫోన్ నంబర్"}</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                          isPhoneVisible
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        <LockIcon className="w-2.5 h-2.5" />
                        <span>{isPhoneVisible ? (isEn ? "Visible" : "కనిపిస్తోంది") : (isEn ? "Protected" : "రక్షించబడింది")}</span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircleIcon className="w-2.5 h-2.5" />
                        <span>{isEn ? "Verified" : "ధృవీకరించబడింది"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      id="profile-phone-input"
                      type="text"
                      value={
                        phoneNumber
                          ? (isPhoneVisible ? formatPhoneNumber(phoneNumber) : maskPhoneNumber(phoneNumber))
                          : (isEn ? "No phone number linked" : "ఫోన్ నంబర్ లింక్ చేయబడలేదు")
                      }
                      disabled
                      readOnly
                      className="w-full p-3 sm:p-3.5 pl-9 sm:pl-10 pr-12 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-wider neu-m3-input bg-[var(--md-surface-container-lowest)] text-[var(--md-on-surface)] cursor-default select-all"
                    />
                    <PhoneIcon className="w-4 h-4 absolute left-3 opacity-50 text-[var(--md-on-surface-variant)]" />
                    <button
                      type="button"
                      id="btn-toggle-phone-visibility"
                      onClick={() => setIsPhoneVisible((prev) => !prev)}
                      className="absolute right-2.5 p-2 rounded-xl neu-m3-icon-btn text-[var(--md-on-surface)] transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                      title={isPhoneVisible ? (isEn ? "Hide phone number" : "ఫోన్ నంబర్ దాచు") : (isEn ? "Show phone number" : "ఫోన్ నంబర్ చూపించు")}
                      aria-label={isPhoneVisible ? "Hide phone number" : "Show phone number"}
                    >
                      {isPhoneVisible ? (
                        <EyeOffIcon className="w-4 h-4 text-accent" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-[var(--md-on-surface-variant)]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Status Information Badge & Sign Out Action */}
                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl neu-m3-inset-sm bg-[var(--md-surface-container-lowest)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-500 shrink-0 self-center" />
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-[var(--md-on-surface)]">
                        {isEn ? "OTP Secure Account" : "OTP సురక్షిత ఖాతా"}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[var(--md-on-surface-variant)] opacity-70">
                        {isEn ? "Passwordless Mobile Login Active" : "పాస్‌వర్డ్‌లెస్ మొబైల్ లాగిన్ యాక్టివ్"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="profile-btn-signout"
                    onClick={handleSignOut}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center whitespace-nowrap"
                    title={isEn ? "Sign out of your account" : "మీ ఖాతా నుండి సైన్ అవుట్ అవ్వండి"}
                  >
                    <LogOutIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? "Sign Out" : "సైన్ అవుట్"}</span>
                  </button>
                </div>
              </div>

              {/* Preferences: Choose Theme & Choose Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Choose Theme Card */}
                <div className="neu-m3-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-[var(--md-surface-container-high)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === "light" ? <SunIcon className="w-4 h-4 text-accent" /> : <MoonIcon className="w-4 h-4 text-accent" />}
                      <span className="font-extrabold text-xs sm:text-sm text-[var(--md-on-surface)]">{t.settingsThemeLabel}</span>
                    </div>
                    <span className="text-[10.5px] font-bold text-accent capitalize">
                      {theme === "light" ? t.lightTheme : t.darkTheme}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl neu-m3-tabs-track">
                    <button
                      type="button"
                      id="profile-theme-light"
                      onClick={() => setTheme("light")}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        theme === "light" 
                          ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-sm font-extrabold scale-[1.02]" 
                          : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                      }`}
                    >
                      <SunIcon className="w-3.5 h-3.5" />
                      <span>{t.lightTheme}</span>
                    </button>
                    
                    <button
                      type="button"
                      id="profile-theme-dark"
                      onClick={() => setTheme("dark")}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        theme === "dark" 
                          ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-sm font-extrabold scale-[1.02]" 
                          : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                      }`}
                    >
                      <MoonIcon className="w-3.5 h-3.5" />
                      <span>{t.darkTheme}</span>
                    </button>
                  </div>
                </div>

                {/* Choose Language Card */}
                <div className="neu-m3-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-[var(--md-surface-container-high)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LanguagesIcon className="w-4 h-4 text-accent" />
                      <span className="font-extrabold text-xs sm:text-sm text-[var(--md-on-surface)]">{t.settingsLanguageLabel}</span>
                    </div>
                    <span className="text-[10.5px] font-bold text-accent uppercase">
                      {lang}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl neu-m3-tabs-track">
                    <button
                      type="button"
                      id="profile-lang-en"
                      onClick={() => setLang("en")}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        lang === "en" 
                          ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-sm font-extrabold scale-[1.02]" 
                          : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                      }`}
                    >
                      English
                    </button>
                    
                    <button
                      type="button"
                      id="profile-lang-te"
                      onClick={() => setLang("te")}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        lang === "te" 
                          ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-md font-extrabold scale-[1.02]" 
                          : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                      }`}
                    >
                      తెలుగు
                    </button>
                  </div>
                </div>
              </div>

              {/* Note Card with embedded Terms & Conditions & Privacy Policy links */}
              {renderNoteCard()}
            </div>
          )}
        </div>

        {/* Right Side: Theme / Appearance & Language Options (during Sign In to Your Account) */}
        {isSignedOut && (
          <div className="space-y-4 sm:space-y-5 w-full min-w-0 flex flex-col justify-between">
            {/* Show Note Card above Choose Theme during Sign In to Your Account */}
            {renderNoteCard()}

            {/* Theme & Language Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 w-full min-w-0">
              {/* Choose Theme / Appearance Card */}
              <div className="neu-m3-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] w-full min-w-0">
                <div className="flex items-center gap-2">
                  {theme === "light" ? <SunIcon className="w-5 h-5 text-accent" /> : <MoonIcon className="w-5 h-5 text-accent" />}
                  <h3 className="font-extrabold text-xs sm:text-sm text-[var(--md-on-surface)]">{t.settingsThemeLabel}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl neu-m3-tabs-track">
                  <button
                    id="settings-theme-light"
                    onClick={() => setTheme("light")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === "light" 
                        ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-md font-extrabold scale-[1.02]" 
                        : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                    }`}
                  >
                    <SunIcon className="w-4 h-4" />
                    <span>{t.lightTheme}</span>
                  </button>
                  
                  <button
                    id="settings-theme-dark"
                    onClick={() => setTheme("dark")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === "dark" 
                        ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-md font-extrabold scale-[1.02]" 
                        : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                    }`}
                  >
                    <MoonIcon className="w-4 h-4" />
                    <span>{t.darkTheme}</span>
                  </button>
                </div>
              </div>

              {/* Choose Language / భాష ఎంచుకోండి Card */}
              <div className="neu-m3-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] w-full min-w-0">
                <div className="flex items-center gap-2">
                  <LanguagesIcon className="w-5 h-5 text-accent" />
                  <h3 className="font-extrabold text-xs sm:text-sm text-[var(--md-on-surface)]">{t.settingsLanguageLabel}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl neu-m3-tabs-track">
                  <button
                    id="settings-lang-en"
                    onClick={() => setLang("en")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      lang === "en" 
                        ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-md font-extrabold scale-[1.02]" 
                        : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                    }`}
                  >
                    English
                  </button>
                  
                  <button
                    id="settings-lang-te"
                    onClick={() => setLang("te")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      lang === "te" 
                        ? "neu-m3-outset-sm bg-[var(--md-surface-container-high)] text-accent shadow-md font-extrabold scale-[1.02]" 
                        : "opacity-60 hover:opacity-100 text-[var(--md-on-surface-variant)]"
                    }`}
                  >
                    తెలుగు
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
