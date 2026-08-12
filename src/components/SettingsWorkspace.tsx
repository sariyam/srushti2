import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { LOGOS_BASE64 } from "../assets/logoBase64";
import frontLogo from "../assets/front_logo.png";

const UserIcon = (props: any) => <Icon icon="lucide:user" {...props} />;
const PhoneIcon = (props: any) => <Icon icon="lucide:phone" {...props} />;
const MailIcon = (props: any) => <Icon icon="lucide:mail" {...props} />;
const LockIcon = (props: any) => <Icon icon="lucide:lock" {...props} />;
const CheckCircleIcon = (props: any) => <Icon icon="lucide:check-circle-2" {...props} />;
const ShieldCheckIcon = (props: any) => <Icon icon="lucide:shield-check" {...props} />;
const LogOutIcon = (props: any) => <Icon icon="lucide:log-out" {...props} />;
const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const LanguagesIcon = (props: any) => <Icon icon="lucide:languages" {...props} />;
const SaveIcon = (props: any) => <Icon icon="lucide:save" {...props} />;
const KeyRoundIcon = (props: any) => <Icon icon="lucide:key-round" {...props} />;
const ArrowRightIcon = (props: any) => <Icon icon="lucide:arrow-right" {...props} />;
const RefreshCwIcon = (props: any) => <Icon icon="lucide:refresh-cw" {...props} />;
const SmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const InfoIcon = (props: any) => <Icon icon="lucide:info" {...props} />;
const FileTextIcon = (props: any) => <Icon icon="lucide:file-text" {...props} />;
const ScaleIcon = (props: any) => <Icon icon="lucide:scale" {...props} />;
const XIcon = (props: any) => <Icon icon="lucide:x" {...props} />;

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
  selectedVideoModel?: string;
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
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({
  theme,
  setTheme,
  lang,
  setLang,
  t,
  hideTitle = false,
  isSignedOut: propIsSignedOut,
  setIsSignedOut: propSetIsSignedOut,
  onCloseModal,
}) => {
  // Profile Field States
  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem("srushti_user_fullname") || "Vijay Sariyam";
  });
  const [phoneNumber] = useState("+91 98765 43210");
  const [email, setEmail] = useState("vijay.sariyam02@gmail.com");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [internalSignedOut, setInternalSignedOut] = useState(false);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/termsandconditions") {
        setLegalModal("terms");
      } else if (path === "/privacypolicy") {
        setLegalModal("privacy");
      }
    }
  }, []);

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

  const startResendTimer = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = (e?: React.FormEvent) => {
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

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpStep("otp");
      setOtpValue("849201"); // Auto-fill sample OTP for instant convenience
      setOtpNotice(
        isEn
          ? `OTP sent to ${authCountryCode} ${authPhone}. Demo code: 849201`
          : `OTP ${authCountryCode} ${authPhone} కి పంపబడింది. డెమో కోడ్: 849201`
      );
      startResendTimer();
    }, 900);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
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

    setTimeout(() => {
      setIsVerifyingOtp(false);
      setIsSignedOut(false);
      setOtpStep("phone");
      setOtpValue("");
      setOtpNotice(null);
      if (onCloseModal) {
        onCloseModal();
      }
    }, 800);
  };

  const handleSaveFullName = (val: string) => {
    setFullName(val);
    localStorage.setItem("srushti_user_fullname", val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleVerifyEmail = () => {
    if (isEmailVerified || isVerifyingEmail) return;
    setIsVerifyingEmail(true);
    setVerificationNotice(null);

    setTimeout(() => {
      setIsVerifyingEmail(false);
      setIsEmailVerified(true);
      setVerificationNotice(
        isEn
          ? `Verification email sent & confirmed for ${email}!`
          : `సరిచూసే ఇమెయిల్ ${email} కి పంపబడింది మరియు నిర్ధారించబడింది!`
      );
    }, 1200);
  };

  const handleSignOut = () => {
    setIsSignedOut(true);
    setOtpStep("phone");
    setOtpValue("");
    setOtpError(null);
    setOtpNotice(null);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-5 w-full max-w-3xl mx-auto"
    >
      {/* Title Header */}
      {!hideTitle && (
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-extrabold text-[var(--text-emphasis)]">{t.settingsTitle}</h2>
            <p className="text-[11px] opacity-75 mt-0.5">{t.settingsSubtitle}</p>
          </div>
          <div className="w-8 h-8 rounded-full nm-inset-sm flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-accent" />
          </div>
        </div>
      )}

      {/* Responsive 2-Column Grid: Stacks on mobile/tablet, side-by-side on desktop with equal height columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start lg:items-stretch">
        {/* Left Side: Account Profile or Sign In Card */}
        <div className="space-y-5 w-full lg:h-full lg:flex lg:flex-col">
          {isSignedOut ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="nm-outset rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 border border-accent/20 bg-[var(--bg-panel)] w-full overflow-hidden lg:h-full lg:flex lg:flex-col lg:justify-between"
            >
          {/* Header Logo above Sign In */}
          <div className="flex flex-col items-center justify-center text-center space-y-1.5 sm:space-y-2 pt-1 pb-2 border-b border-black/5 dark:border-white/5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden nm-outset-sm p-1.5 bg-[var(--bg-panel)] flex items-center justify-center shadow-md">
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
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[var(--text-emphasis)] tracking-tight">Srushti AI</h2>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-extrabold text-accent uppercase tracking-wider">Business to Brand</p>
            </div>
          </div>

          <div className="flex items-start sm:items-center justify-between border-b border-black/5 dark:border-white/5 pb-3 gap-2">
            <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl nm-inset-sm flex items-center justify-center text-accent shrink-0 mt-0.5 sm:mt-0">
                <SmartphoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-[var(--text-emphasis)] leading-tight whitespace-normal break-words">
                  {isEn ? "Sign In to Your Account" : "మీ ఖాతాలోకి సైన్ ఇన్ అవ్వండి"}
                </h3>
                <p className="text-[10px] sm:text-[11px] opacity-70 leading-snug mt-0.5 whitespace-normal break-words">
                  {otpStep === "phone"
                    ? (isEn ? "Enter phone number to receive 6-digit OTP code" : "6 అంకెల OTP కోడ్‌ను అందుకోవడానికి ఫోన్ నంబర్‌ను నమోదు చేయండి")
                    : (isEn ? `OTP sent to ${authCountryCode} ${authPhone}` : `OTP ${authCountryCode} ${authPhone} కి పంపబడింది`)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 shrink-0 self-start sm:self-auto">
              <KeyRoundIcon className="w-3 h-3 text-accent" />
              <span>{otpStep === "phone" ? (isEn ? "Step 1 of 2" : "దశ 1/2") : (isEn ? "Step 2 of 2" : "దశ 2/2")}</span>
            </div>
          </div>

          {/* Step 1: Phone Number Entry */}
          {otpStep === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5 sm:space-y-4">
              <div className="space-y-1.5">
                <label className="font-extrabold opacity-80 text-[10px] sm:text-[11px] md:text-xs block">
                  {isEn ? "Mobile Phone Number" : "మొబైల్ ఫోన్ నంబర్"}
                </label>
                <div className="flex items-center gap-2">
                  {/* Country Code Picker */}
                  <select
                    value={authCountryCode}
                    onChange={(e) => setAuthCountryCode(e.target.value)}
                    className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-mono font-bold border border-transparent outline-none nm-inset-sm bg-[var(--bg-secondary)] text-[var(--text-emphasis)] shrink-0 cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>

                  {/* Phone Input */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full p-3 sm:p-3.5 pl-8 sm:pl-9 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-wider border border-transparent outline-none nm-inset-sm bg-[var(--bg-secondary)] focus:ring-2 focus:ring-accent text-[var(--text-emphasis)]"
                    />
                    <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 opacity-50 text-[var(--text-primary)]" />
                  </div>
                </div>
              </div>

              {otpError && (
                <p className="text-[10px] sm:text-[11px] font-bold text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  {otpError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className={`w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold nm-outset text-accent bg-accent/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSendingOtp ? "opacity-70 pointer-events-none" : ""
                }`}
              >
                {isSendingOtp ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-[11px] font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span className="break-words">{otpNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep("phone");
                      setOtpError(null);
                    }}
                    className="text-[10px] font-extrabold underline text-accent shrink-0 cursor-pointer self-end sm:self-auto"
                  >
                    {isEn ? "Change Number" : "నంబర్ మార్చు"}
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <label className="font-extrabold opacity-80 block">
                    {isEn ? "Enter 6-Digit OTP" : "6 అంకెల OTP నమోదు చేయండి"}
                  </label>
                  <span className="text-[9px] sm:text-[10px] opacity-60 font-mono font-bold">Demo OTP: 849201</span>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    placeholder="849201"
                    className="w-full p-3 sm:p-3.5 pl-9 sm:pl-10 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-[0.2em] sm:tracking-[0.3em] border border-transparent outline-none nm-inset-sm bg-[var(--bg-secondary)] focus:ring-2 focus:ring-accent text-[var(--text-emphasis)]"
                  />
                  <KeyRoundIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 sm:left-3.5 opacity-50 text-accent" />
                </div>
              </div>

              {otpError && (
                <p className="text-[10px] sm:text-[11px] font-bold text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  {otpError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isSendingOtp}
                  onClick={() => handleSendOtp()}
                  className={`w-full sm:w-auto px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold nm-outset-sm text-[var(--text-primary)] hover:text-accent transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold nm-outset text-accent bg-accent/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isVerifyingOtp ? "opacity-70 pointer-events-none" : ""
                  }`}
                >
                  {isVerifyingOtp ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        /* User Profile Details Card */
        <div className="nm-outset rounded-[2rem] p-5 space-y-4 w-full lg:h-full lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-accent shrink-0" />
              <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">
                {isEn ? "Account Profile" : "ఖాతా వివరాలు"}
              </h3>
            </div>
            {isSaved && (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 animate-fade-in">
                <CheckCircleIcon className="w-3 h-3" />
                {isEn ? "Saved" : "సేవ్ చేయబడింది"}
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-extrabold opacity-80 flex items-center justify-between text-[11px]">
                <span>{isEn ? "Full Name" : "పూర్తి పేరు"}</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => handleSaveFullName(e.target.value)}
                  placeholder={isEn ? "Enter your full name" : "మీ పూర్తి పేరు నమోదు చేయండి"}
                  className="w-full p-3.5 pr-10 rounded-2xl text-xs font-semibold border border-transparent outline-none nm-inset-sm bg-[var(--bg-secondary)] focus:ring-2 focus:ring-accent text-[var(--text-emphasis)]"
                />
                <SaveIcon className="w-4 h-4 absolute right-3.5 opacity-40 text-accent" />
              </div>
            </div>

            {/* Phone Number (Disabled) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-extrabold opacity-80 flex items-center gap-1">
                  <span>{isEn ? "Phone Number" : "ఫోన్ నంబర్"}</span>
                </label>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 opacity-70 flex items-center gap-1">
                  <LockIcon className="w-2.5 h-2.5" />
                  {isEn ? "Disabled" : "అచేతనం"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={phoneNumber}
                  disabled
                  readOnly
                  className="w-full p-3.5 pl-9 rounded-2xl text-xs font-mono font-bold border border-transparent outline-none nm-inset-sm bg-[var(--bg-secondary)] opacity-60 cursor-not-allowed text-[var(--text-primary)]"
                />
                <PhoneIcon className="w-4 h-4 absolute left-3 opacity-50 text-[var(--text-primary)]" />
                <LockIcon className="w-3.5 h-3.5 absolute right-3.5 opacity-40 text-[var(--text-primary)]" />
              </div>
            </div>

            {/* Email + Verify Button */}
            <div className="space-y-1.5">
              <label className="font-extrabold opacity-80 text-[11px] block">
                {isEn ? "Email Address" : "ఇమెయిల్ అడ్రస్"}
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailVerified(false);
                      setVerificationNotice(null);
                    }}
                    placeholder={isEn ? "Enter email address" : "ఇమెయిల్ అడ్రస్ నమోదు చేయండి"}
                    className="w-full p-3.5 pl-9 rounded-2xl text-xs font-medium border border-transparent outline-none nm-inset-sm bg-[var(--bg-secondary)] focus:ring-2 focus:ring-accent text-[var(--text-emphasis)]"
                  />
                  <MailIcon className="w-4 h-4 absolute left-3 opacity-50 text-[var(--text-primary)]" />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={isEmailVerified || isVerifyingEmail}
                  className={`px-4 py-3 sm:py-3.5 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    isEmailVerified
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default"
                      : "nm-outset text-accent hover:scale-[1.02] active:scale-[0.98] bg-accent/10"
                  } ${isVerifyingEmail ? "opacity-70 pointer-events-none" : ""}`}
                >
                  {isVerifyingEmail ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{isEn ? "Verifying..." : "పరిశీలిస్తోంది..."}</span>
                    </>
                  ) : isEmailVerified ? (
                    <>
                      <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                      <span>{isEn ? "Verified ✓" : "వెరిఫై చేయబడింది ✓"}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span>{isEn ? "Verify Email" : "ఇమెయిల్ వెరిఫై"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Verification Message Alert */}
              {verificationNotice && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1.5"
                >
                  <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{verificationNotice}</span>
                </motion.p>
              )}
            </div>
          </div>

          {/* Sign Out Action Button */}
          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] opacity-60 font-semibold">
              {isEn ? "Logged in as" : "లాగ్ ఇన్ అయ్యారు"}: <span className="font-extrabold text-[var(--text-emphasis)]">{fullName}</span>
            </span>
            <button
              id="profile-btn-signout"
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              <span>{isEn ? "Sign Out" : "సైన్ అవుట్"}</span>
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Right Side: Theme / Appearance & Language Options */}
    <div className="space-y-5 w-full lg:h-full lg:flex lg:flex-col lg:justify-between">
          {/* Note Card with embedded Terms & Conditions & Privacy Policy links */}
          <div className="nm-outset rounded-[2rem] p-4 sm:p-5 space-y-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <h4 className="font-extrabold text-xs sm:text-sm tracking-tight">
                {lang === "te" ? "గమనిక" : "Note"}
              </h4>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--text-primary)] opacity-90 font-medium break-words">
              {lang === "te"
                ? "గమనిక: జనరేట్ చేయబడిన చిత్రాల ఖచ్చితత్వం అప్‌లోడ్ చేసిన ప్రొడక్ట్ ఇమేజ్ యొక్క నాణ్యత మరియు స్పష్టతపై ఆధారపడి ఉంటుంది. సోర్స్ ఇమేజ్ తక్కువ రిజల్యూషన్, మసకగా, క్రాప్ చేయబడి లేదా కనిపించే వివరాలు లేనట్లయితే, జనరేట్ చేయబడిన చిత్రం అసలు ప్రొడక్ట్ కంటే భిన్నంగా ఉండవచ్చు."
                : "Note: The accuracy of generated images depends on the quality and clarity of the uploaded product image. If the source image is low-resolution, blurry, cropped, or lacks visible details, the generated image may vary from the original product."}
            </p>
            <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-[var(--text-primary)]">
              <span>{lang === "te" ? "Srushti AI ని ఉపయోగించడం ద్వారా, మీరు మా" : "By using Srushti AI, you agree to our"}</span>
              <button
                id="link-terms-and-conditions"
                type="button"
                onClick={() => {
                  setLegalModal("terms");
                  if (typeof window !== "undefined") {
                    window.history.pushState({}, "", "/termsandconditions");
                  }
                }}
                className="underline underline-offset-2 text-accent hover:opacity-80 transition-opacity cursor-pointer font-extrabold"
              >
                {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
              </button>
              <span>{lang === "te" ? "మరియు" : "&"}</span>
              <button
                id="link-privacy-policy"
                type="button"
                onClick={() => {
                  setLegalModal("privacy");
                  if (typeof window !== "undefined") {
                    window.history.pushState({}, "", "/privacypolicy");
                  }
                }}
                className="underline underline-offset-2 text-accent hover:opacity-80 transition-opacity cursor-pointer font-extrabold"
              >
                {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
              </button>
              <span>{lang === "te" ? "కు అంగీకరిస్తున్నారు." : ""}</span>
            </div>
          </div>

          {/* Choose Theme / Appearance Card */}
          <div className="nm-outset rounded-[2rem] p-5 space-y-4">
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

          {/* Choose Language / భాష ఎంచుకోండి Card */}
          <div className="nm-outset rounded-[2rem] p-5 space-y-4">
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

      {/* Legal Modal Dialog for Terms & Conditions & Privacy Policy */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-neutral-300 dark:border-neutral-700 rounded-[2rem] p-5 sm:p-7 text-[var(--text-primary)] shadow-2xl max-h-[85vh] flex flex-col space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl nm-inset-sm flex items-center justify-center text-accent">
                    {legalModal === "terms" ? <FileTextIcon className="w-5 h-5" /> : <ShieldCheckIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg text-[var(--text-emphasis)]">
                      {legalModal === "terms" 
                        ? (lang === "te" ? "నిబంధనలు మరియు షరతులు (Terms & Conditions)" : "Terms & Conditions") 
                        : (lang === "te" ? "గోప్యతా విధానం (Privacy Policy)" : "Privacy Policy")}
                    </h2>
                    <p className="text-[11px] opacity-60 font-mono">
                      {legalModal === "terms" ? "/termsandconditions" : "/privacypolicy"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLegalModal(null);
                    if (typeof window !== "undefined") {
                      window.history.pushState({}, "", "/");
                    }
                  }}
                  className="p-2 rounded-xl nm-outset-sm hover:text-red-500 transition-all cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-4 text-xs leading-relaxed text-[var(--text-primary)]">
                {legalModal === "terms" ? (
                  <div className="space-y-3.5">
                    <p className="opacity-80">
                      Welcome to <strong>Srushti AI</strong>. By accessing or using our platform, services, or AI generation features, you agree to be bound by the following Terms & Conditions.
                    </p>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium text-[11px] space-y-1.5">
                      <p className="font-extrabold flex items-center gap-1.5">
                        <InfoIcon className="w-4 h-4 shrink-0 text-amber-500" />
                        <span>AI Image Generation & Accuracy Disclaimer</span>
                      </p>
                      <p>
                        Note: The accuracy of generated images depends on the quality and clarity of the uploaded product image. If the source image is low-resolution, blurry, cropped, or lacks visible details, the generated image may vary from the original product.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">1. User Accounts & Authentication</h3>
                      <p className="opacity-80">You must provide a valid phone number to authenticate and access Srushti AI services. You are responsible for maintaining confidentiality of your account session.</p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">2. Uploaded Content & Intellectual Property</h3>
                      <p className="opacity-80">You retain full ownership rights over all product images uploaded to Srushti AI. You grant Srushti AI a limited non-exclusive license solely to process and generate garment and jewelry visualizations on your behalf.</p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">3. Prohibited Conduct</h3>
                      <p className="opacity-80">Users must not upload content that violates third-party intellectual property rights, contains unlawful material, or attempts to reverse engineer AI model endpoints.</p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">4. Limitation of Liability</h3>
                      <p className="opacity-80">Srushti AI shall not be liable for any direct, indirect, or incidental damages resulting from variations in AI-generated product images compared to physical products.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <p className="opacity-80">
                      At <strong>Srushti AI</strong>, your privacy and data protection are central to our platform. This Privacy Policy outlines how your personal information and uploaded media are managed.
                    </p>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">1. Information We Collect</h3>
                      <p className="opacity-80">• Account Information: Phone number provided during OTP authentication.</p>
                      <p className="opacity-80">• Uploaded Media: Product images uploaded for generating AI garment and jewelry trials.</p>
                      <p className="opacity-80">• App Preferences: UI theme (Light/Dark) and language preferences (English/Telugu).</p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">2. Usage of Collected Information</h3>
                      <p className="opacity-80">Information collected is used strictly to process AI generation requests, verify account logins, and save workspace display preferences.</p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">3. Data Protection & Security</h3>
                      <p className="opacity-80">Uploaded images are encrypted during transmission and processing. Srushti AI does not sell, rent, or trade user data with third-party advertising networks.</p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[var(--text-emphasis)]">4. Your Data Rights</h3>
                      <p className="opacity-80">You may request deletion of your profile or stored session data at any time through our support team.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    setLegalModal(null);
                    if (typeof window !== "undefined") {
                      window.history.pushState({}, "", "/");
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold nm-outset text-accent bg-accent/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {lang === "te" ? "అర్థమైంది / మూసివేయి" : "I Understand & Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
