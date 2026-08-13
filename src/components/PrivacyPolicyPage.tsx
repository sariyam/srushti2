import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Logo } from "./Logo";
import { Language } from "../types";

const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const LanguagesIcon = (props: any) => <Icon icon="lucide:languages" {...props} />;
const ArrowLeftIcon = (props: any) => <Icon icon="lucide:arrow-left" {...props} />;
const ShieldCheckIcon = (props: any) => <Icon icon="lucide:shield-check" {...props} />;
const LockIcon = (props: any) => <Icon icon="lucide:lock" {...props} />;

export const PrivacyPolicyPage: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_lang");
      return (saved as Language) || "te";
    }
    return "te";
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("srushti_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("srushti_lang", lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));
  const toggleLang = () => setLang(prev => (prev === "en" ? "te" : "en"));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <Logo />
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-[var(--text-emphasis)] block leading-none">
                  Srushti AI
                </span>
                <span className="text-[10px] font-bold text-accent block mt-0.5">
                  /privacypolicy
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-xl nm-outset text-xs font-bold flex items-center gap-1.5 hover:text-accent transition-all cursor-pointer"
              title="Toggle Language / భాష మార్చండి"
            >
              <LanguagesIcon className="w-4 h-4 text-accent" />
              <span>{lang === "en" ? "తెలుగు" : "English"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl nm-outset text-xs font-bold flex items-center justify-center hover:text-accent transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "light" ? <MoonIcon className="w-4 h-4 text-accent" /> : <SunIcon className="w-4 h-4 text-accent" />}
            </button>

            {/* Back to Main App */}
            <a
              href="/"
              className="px-3.5 py-1.5 rounded-xl nm-outset text-xs font-extrabold text-accent bg-accent/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>{lang === "te" ? "యాప్‌కి వెళ్లండి" : "Back to App"}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Banner Header */}
        <div className="nm-outset rounded-[2.5rem] p-6 sm:p-8 bg-[var(--bg-panel)] space-y-3 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl nm-inset-sm flex items-center justify-center text-accent">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-emphasis)] tracking-tight">
                {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
              </h1>
              <p className="text-xs font-medium text-accent mt-0.5">
                {lang === "te" ? "చివరి నవీకరణ: ఆగష్టు 2026" : "Last Updated: August 2026"}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-85 pt-1">
            {lang === "te"
              ? "Srushti AI మీ సమాచారాన్ని మరియు అప్‌లోడ్ చేసిన ప్రొడక్ట్ చిత్రాలను ఎలా సేకరిస్తుంది, ఉపయోగిస్తుంది మరియు భద్రపరుస్తుందో వివరించే విధానం."
              : "At Srushti AI, protecting your personal privacy and product image assets is fundamental. This Privacy Policy details our data processing practices."}
          </p>
        </div>

        {/* Security Highlight Box */}
        <div className="nm-outset rounded-[2rem] p-5 sm:p-6 space-y-2.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <LockIcon className="w-5 h-5 shrink-0" />
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
              {lang === "te" ? "భద్రతా ప్రమాణాలు (Encrypted Data Standards)" : "Data Protection & Privacy Guarantee"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] font-medium break-words">
            {lang === "te"
              ? "మీరు అప్‌లోడ్ చేసిన ఫోటోలు మరియు ప్రొడక్ట్ చిత్రాలు ఎన్‌క్రిప్ట్ చేయబడతాయి మరియు కేవలం AI ఇమేజ్ జనరేషన్ ప్రక్రియ కోసం మాత్రమే ఉపయోగించబడతాయి. మేము మీ డేటాను ఏ మూడవ పక్ష ప్రకటన నెట్‌వర్క్‌లకు విక్రయించము."
              : "All uploaded photos and media assets are encrypted during transmission and processing. Your data is strictly used for generative model processing and is never sold to third-party ad networks."}
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">1</span>
              <span>{lang === "te" ? "మేము సేకరించే సమాచారం (Information We Collect)" : "1. Information We Collect"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>{lang === "te" ? "• ఖాతా సమాచారం: లాగిన్ సమయం నమోదు చేసిన ఫోన్ నంబర్." : "• Account Identification: Phone number supplied during OTP verification."}</p>
              <p>{lang === "te" ? "• అప్‌లోడ్ చేసిన చిత్రాలు: మీరు గార్మెంట్ లేదా జ్యువెలరీ ట్రయల్ కోసం అప్‌లోడ్ చేసిన ప్రొడక్ట్ ఫోటోలు." : "• Uploaded Product Media: Images uploaded for garment, model, or jewelry trial rendering."}</p>
              <p>{lang === "te" ? "• అప్లికేషన్ ప్రాధాన్యతలు: థీమ్ (Light/Dark) మరియు భాష ఎంపికలు (English/తెలుగు)." : "• App Preferences: Visual theme and preferred language choices."}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">2</span>
              <span>{lang === "te" ? "సమాచార వినియోగం (How We Use Your Data)" : "2. How We Use Your Data"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "సేకరించిన సమాచారాన్ని కేవలం కృత్రిమ మేధస్సు మోడల్ ప్రొడక్ట్ చిత్రాలను సిద్ధం చేయడానికి, వినియోగదారు ఖాతా లాగిన్ ధృవీకరణకు మరియు మీ ప్రాధాన్యతలను సేవ్ చేయడానికి మాత్రమే ఉపయోగిస్తాము."
                : "Information is used exclusively to generate requested AI imagery, verify login requests via OTP, optimize user interface performance, and maintain custom settings."}
            </p>
          </section>

          {/* Section 3 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">3</span>
              <span>{lang === "te" ? "డేటా రక్షణ & భద్రత (Data Security & Retention)" : "3. Data Security & Retention"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మేము సురక్షితమైన క్లౌడ్ మౌలిక సదుపాయాలు మరియు ఎన్‌క్రిప్షన్ ప్రోటోకాల్‌లను ఉపయోగిస్తాము. అనధికారిక ప్రాప్యత నుండి మీ డేటా రక్షించబడుతుంది."
                : "We enforce strict encryption in transit and at rest using modern secure Cloud architecture. Media assets are processed ephemeral-first to protect user confidentiality."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">4</span>
              <span>{lang === "te" ? "వినియోగదారు హక్కులు (Your Privacy Rights)" : "4. Your Privacy Rights"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మీరు ఎప్పుడైనా మీ ఖాతా సెషన్ డేటాను తొలగించమని అభ్యర్థించవచ్చు లేదా సపోర్ట్ బృందాన్ని సంప్రదించవచ్చు."
                : "You may clear active session data or request account deletion at any time by accessing settings or contacting our support team."}
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-6 px-4 sm:px-8 mt-auto bg-[var(--bg-primary)] text-center text-xs opacity-75">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Srushti AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/termsandconditions" className="hover:text-accent font-extrabold transition-colors">
              {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
            </a>
            <a href="/privacypolicy" className="text-accent font-extrabold underline">
              {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
