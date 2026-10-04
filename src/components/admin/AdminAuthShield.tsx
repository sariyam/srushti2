import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { sendOtpApi, verifyOtpApi, setAuthToken, setStoredAuthUser, AuthUser } from "../../utils/api";

interface AdminAuthShieldProps {
  onAuthenticated: (user: AuthUser) => void;
  lang: "en" | "te";
}

export const AdminAuthShield: React.FC<AdminAuthShieldProps> = ({ onAuthenticated, lang }) => {
  const [phone, setPhone] = useState("+919059108434");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const clean = phone.replace(/[^\d+]/g, "");
    if (clean.length < 10) {
      setErrorMsg(isEn ? "Please enter a valid phone number" : "దయచేసి సరైన ఫోన్ నంబర్‌ను నమోదు చేయండి");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtpApi(clean);
      if (res.success) {
        setStep("otp");
        setSuccessMsg(isEn ? "Verification OTP dispatched successfully." : "ధృవీకరణ OTP విజయవంతంగా పంపబడింది.");
      } else {
        setErrorMsg(res.error || res.message || "Failed to dispatch OTP");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error while sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (otp.trim().length < 4) {
      setErrorMsg(isEn ? "Please enter the verification code" : "దయచేసి ధృవీకరణ కోడ్‌ను నమోదు చేయండి");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtpApi(phone, otp.trim());
      if (res.success && res.user && res.tokens?.accessToken) {
        // Enforce strictly role: admin
        if (res.user.role !== "admin") {
          setErrorMsg(
            isEn
              ? `Access Denied: Your account role is '${res.user.role}'. Only 'admin' accounts can access the master console.`
              : `యాక్సెస్ తిరస్కరించబడింది: మీ ఖాతా రోల్ '${res.user.role}'. కేవలం 'admin' ఖాతాలు మాత్రమే ప్రవేశించగలరు.`
          );
          return;
        }

        setAuthToken(res.tokens.accessToken);
        setStoredAuthUser(res.user);
        onAuthenticated(res.user);
      } else {
        setErrorMsg(res.error || res.message || "Invalid verification code");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to verify OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)] flex items-center justify-center p-4">
      <div className="w-full max-w-md m3-card-elevated p-6 sm:p-8 space-y-6">
        {/* Header with Security Shield Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-[var(--md-primary)] text-[var(--md-on-primary)] flex items-center justify-center shadow-md">
            <Icon icon="lucide:shield-alert" className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-[var(--md-on-surface)] tracking-tight">
            {isEn ? "Admin Console Authentication" : "అడ్మిన్ కన్సోల్ ప్రమాణీకరణ"}
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] leading-relaxed">
            {isEn
              ? "Restricted area. Please authenticate with registered administrator phone credentials."
              : "పరిమిత ప్రాంతం. దయచేసి నమోదిత అడ్మినిస్ట్రేటర్ ఫోన్ నంబర్‌తో లాగిన్ అవ్వండి."}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-[var(--md-error-container)] text-[var(--md-on-error-container)] text-xs font-semibold flex items-start gap-2">
            <Icon icon="lucide:alert-circle" className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-[var(--md-success-container)] text-[var(--md-on-success-container)] text-xs font-semibold flex items-start gap-2">
            <Icon icon="lucide:check-circle-2" className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Phone Entry */}
        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--md-on-surface)] block">
                {isEn ? "Administrator Phone Number" : "అడ్మినిస్ట్రేటర్ ఫోన్ నంబర్"}
              </label>
              <div className="relative">
                <Icon
                  icon="lucide:phone"
                  className="w-4 h-4 text-[var(--md-outline)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9059108434"
                  className="m3-text-field w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold"
                />
              </div>
              <p className="text-[10px] text-[var(--md-on-surface-variant)] opacity-80">
                {isEn ? "System seeded admin: +919059108434" : "సిస్టమ్ అడ్మిన్: +919059108434"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="m3-btn-filled w-full py-3 rounded-full text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Sending OTP..." : "OTP పంపుతోంది..."}</span>
                </>
              ) : (
                <>
                  <Icon icon="lucide:send" className="w-4 h-4" />
                  <span>{isEn ? "Request Admin OTP" : "అడ్మిన్ OTP అభ్యర్థించండి"}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--md-on-surface)] block">
                  {isEn ? "Enter 6-Digit OTP Code" : "6-అంకెల OTP కోడ్‌ను నమోదు చేయండి"}
                </label>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-[10px] text-[var(--md-primary)] font-bold hover:underline cursor-pointer"
                >
                  {isEn ? "Change phone" : "నంబర్ మార్చండి"}
                </button>
              </div>
              <div className="relative">
                <Icon
                  icon="lucide:key-round"
                  className="w-4 h-4 text-[var(--md-outline)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="m3-text-field w-full pl-10 pr-4 py-2.5 text-center text-lg font-mono font-black tracking-widest"
                />
              </div>
              <p className="text-[10px] text-[var(--md-on-surface-variant)] opacity-80 text-center">
                {isEn ? "Default dev test OTP is 123456" : "డిఫాల్ట్ టెస్ట్ OTP: 123456"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 4}
              className="m3-btn-filled w-full py-3 rounded-full text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Verifying..." : "ధృవీకరిస్తోంది..."}</span>
                </>
              ) : (
                <>
                  <Icon icon="lucide:unlock" className="w-4 h-4" />
                  <span>{isEn ? "Authorize Admin Access" : "యాక్సెస్ ధృవీకరించండి"}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Back Link to Studio */}
        <div className="pt-2 border-t border-[var(--md-outline-variant)] text-center">
          <a
            href="/studio"
            className="text-xs font-bold text-[var(--md-on-surface-variant)] hover:text-[var(--md-primary)] inline-flex items-center gap-1.5"
          >
            <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
            <span>{isEn ? "Return to Creative Studio" : "స్టూడియోకి తిరిగి వెళ్లండి"}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
