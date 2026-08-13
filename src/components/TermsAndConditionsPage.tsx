import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Logo } from "./Logo";
import { Language } from "../types";

const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const LanguagesIcon = (props: any) => <Icon icon="lucide:languages" {...props} />;
const ArrowLeftIcon = (props: any) => <Icon icon="lucide:arrow-left" {...props} />;
const InfoIcon = (props: any) => <Icon icon="lucide:info" {...props} />;
const FileTextIcon = (props: any) => <Icon icon="lucide:file-text" {...props} />;
const ShieldCheckIcon = (props: any) => <Icon icon="lucide:shield-check" {...props} />;

export const TermsAndConditionsPage: React.FC = () => {
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
                  /termsandconditions
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
              <FileTextIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-emphasis)] tracking-tight">
                {lang === "te" ? "నిబంధనలు మరియు షరతులు" : "Terms & Conditions"}
              </h1>
              <p className="text-xs font-medium text-accent mt-0.5">
                {lang === "te" ? "చివరి నవీకరణ: ఆగష్టు 2026" : "Last Updated: August 2026"}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-85 pt-1">
            {lang === "te"
              ? "సృష్టి ఏఐ (Srushti AI) ప్లాట్‌ఫారమ్‌ను ఉపయోగించడానికి ప్రాథమిక నిబంధనలు. దయచేసి మా సేవలను ఉపయోగించే ముందు ఈ నిబంధనలను శ్రద్ధగా చదవండి."
              : "Welcome to Srushti AI. Please review the following Terms and Conditions carefully before accessing or using our generative AI visualization services."}
          </p>
        </div>

        {/* AI Generation Accuracy Disclaimer Highlight Box */}
        <div className="nm-outset rounded-[2rem] p-5 sm:p-6 space-y-2.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <InfoIcon className="w-5 h-5 shrink-0" />
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
              {lang === "te" ? "గమనిక: చిత్ర ఖచ్చితత్వం నిరాకరణ (Note: Image Accuracy Disclaimer)" : "Important Note: AI Image Generation Accuracy"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] font-medium break-words">
            {lang === "te"
              ? "గమనిక: జనరేట్ చేయబడిన చిత్రాల ఖచ్చితత్వం అప్‌లోడ్ చేసిన ప్రొడక్ట్ ఇమేజ్ యొక్క నాణ్యత మరియు స్పష్టతపై ఆధారపడి ఉంటుంది. సోర్స్ ఇమేజ్ తక్కువ రిజల్యూషన్, మసకగా, క్రాప్ చేయబడి లేదా కనిపించే వివరాలు లేనట్లయితే, జనరేట్ చేయబడిన చిత్రం అసలు ప్రొడక్ట్ కంటే భిన్నంగా ఉండవచ్చు."
              : "Note: The accuracy of generated images depends on the quality and clarity of the uploaded product image. If the source image is low-resolution, blurry, cropped, or lacks visible details, the generated image may vary from the original product."}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">1</span>
              <span>{lang === "te" ? "సేవల అంగీకారం (Acceptance of Terms)" : "1. Acceptance of Terms"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "Srushti AI అప్లికేషన్‌ను ఉపయోగించడం ద్వారా లేదా ఖాతాను సృష్టించడం ద్వారా, మీరు ఈ నిబంధనలకు మరియు వర్తించే అన్ని చట్టాలకు కట్టుబడి ఉండటానికి అంగీకరిస్తున్నారు. మీరు ఈ నిబంధనలతో అంగీకరించకపోతే, దయచేసి మా సేవను ఉపయోగించవద్దు."
                : "By accessing, browsing, or using Srushti AI, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must immediately discontinue using our application."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">2</span>
              <span>{lang === "te" ? "వినియోగదారు ప్రామాణీకరణ (User Accounts & Verification)" : "2. User Accounts & Verification"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "అప్లికేషన్ సేవలను పొందడానికి చెల్లుబాటు అయ్యే ఫోన్ నంబర్ ద్వారా OTP ప్రామాణీకరణ అవసరం. మీ ఖాతా సెషన్ భద్రతకు మీరే బాధ్యత వహిస్తారు."
                : "Certain features require identity verification via mobile OTP authentication. You are responsible for safeguarding your login credentials and maintaining the confidentiality of your active session."}
            </p>
          </section>

          {/* Section 3 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">3</span>
              <span>{lang === "te" ? "మేధో సంపత్తి మరియు అప్‌లోడ్ చేసిన కంటెంట్ (Intellectual Property & Content Rights)" : "3. Intellectual Property & Uploaded Content"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మీరు అప్‌లోడ్ చేసిన ప్రొడక్ట్ చిత్రాలపై పూర్తి హక్కులు మీకే ఉంటాయి. Srushti AI కి కేవలం మీ మోడల్ విజువలైజేషన్ ప్రాసెస్ చేయడానికి మాత్రమే తాత్కాలిక అనుమతి ఉంటుంది."
                : "You retain full ownership of all images and product media uploaded to Srushti AI. By uploading content, you grant Srushti AI a worldwide, non-exclusive, royalty-free license solely for processing and generating requested garment and jewelry visualizations."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">4</span>
              <span>{lang === "te" ? "బాధ్యత పరిమితి (Limitation of Liability)" : "4. Limitation of Liability"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "జనరేట్ చేసిన కృత్రిమ మేధస్సు (AI) చిత్రాలు కేవలం విజువలైజేషన్ కోసం మాత్రమే. అసలు భౌతిక ఉత్పత్తి మరియు AI చిత్రాల మధ్య తేడాలకు Srushti AI బాధ్యత వహించదు."
                : "Srushti AI provides generative visualizations for commercial presentation purposes. Srushti AI and its operators shall not be held liable for any indirect or consequential damages arising from variance between AI-generated images and physical products."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">5</span>
              <span>{lang === "te" ? "సవరణలు (Modifications)" : "5. Modifications to Terms"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "Srushti AI ఈ నిబంధనలను ఎప్పుడైనా నవీకరించే హక్కును కలిగి ఉంది. నవీకరించబడిన నిబంధనలు ఈ పేజీలో అందుబాటులో ఉంటాయి."
                : "We reserve the right to update or modify these Terms and Conditions at any time. Continued use of Srushti AI following updates constitutes your binding acceptance of modified terms."}
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-6 px-4 sm:px-8 mt-auto bg-[var(--bg-primary)] text-center text-xs opacity-75">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Srushti AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/termsandconditions" className="text-accent font-extrabold underline">
              {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
            </a>
            <a href="/privacypolicy" className="hover:text-accent font-extrabold transition-colors">
              {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
