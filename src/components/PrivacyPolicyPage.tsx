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
const SmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const CreditCardIcon = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const DatabaseIcon = (props: any) => <Icon icon="lucide:database" {...props} />;
const UserCheckIcon = (props: any) => <Icon icon="lucide:user-check" {...props} />;

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
                  /privacy
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
              ? "Srushti AI మీ మొబైల్ సమాచారాన్ని, రేజర్‌పే లావాదేవీల డేటాను మరియు అప్‌లోడ్ చేసిన ప్రొడక్ట్ చిత్రాలను ఎలా సేకరిస్తుంది, ప్రాసెస్ చేస్తుంది మరియు భద్రపరుస్తుందో వివరించే పారదర్శక విధానం."
              : "At Srushti AI, protecting your personal privacy, mobile credentials, and payment data is fundamental. This Privacy Policy details our data collection and protection practices regarding Mobile OTP authentication and Razorpay payments."}
          </p>
        </div>

        {/* Security Highlight Box */}
        <div className="nm-outset rounded-[2rem] p-5 sm:p-6 space-y-2.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <LockIcon className="w-5 h-5 shrink-0" />
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
              {lang === "te" ? "భద్రతా ప్రమాణాలు & చెల్లింపు గోప్యత" : "Data Protection & Financial Privacy Guarantee"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] font-medium break-words">
            {lang === "te"
              ? "మీ మొబైల్ నంబర్ మరియు పేమెంట్ వివరాలు ఎండ్-టు-ఎండ్ ఎన్‌క్రిప్ట్ చేయబడతాయి. బ్యాంక్ లేదా కార్డ్ వివరాలను మేము మా సర్వర్లలో నిల్వ చేయము. మీ డేటాను ఏ మూడవ పక్ష ప్రకటన నెట్‌వర్క్‌లకు ఎట్టి పరిస్థితుల్లోనూ విక్రయించము."
              : "All phone numbers and transaction requests are encrypted during transmission. We never store credit card numbers, CVVs, or Net Banking passwords on Srushti AI servers. Your personal data is never sold to third-party ad networks."}
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Section 1: Mobile OTP Login */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-accent">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">1</span>
              <SmartphoneIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "మొబైల్ OTP లాగిన్ & గుర్తింపు డేటా (Mobile OTP Login & Identification Data)" : "1. Mobile OTP Authentication & User Data"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• సేకరించే వివరాలు: మీరు లాగిన్ లేదా రిజిస్ట్రేషన్ సమయంలో నమోదు చేసిన 10 అంకెల మొబైల్ నంబర్ మరియు ధృవీకరణ OTP స్థితి."
                  : "• Data Collected: Valid 10-digit mobile phone number provided during login or account registration, along with OTP delivery and verification status."}
              </p>
              <p>
                {lang === "te"
                  ? "• సమాచార ప్రయోజనం: మొబైల్ నంబర్ కేవలం మీ వాలెట్ బ్యాలెన్స్, జనరేట్ చేసిన ఫోటోల చరిత్ర, సురక్షిత లాగిన్ సెషన్ మరియు ముఖ్యమైన లావాదేవీ రశీదులను అందించడానికి మాత్రమే ఉపయోగించబడుతుంది."
                  : "• Purpose of Collection: Your phone number is used strictly for user identification, provisioning your rechargeable wallet credits, retrieving generated photoshoot history, and dispatching transaction receipts."}
              </p>
              <p>
                {lang === "te"
                  ? "• ఎటువంటి స్పామ్ లేదు: మీ మొబైల్ నంబర్‌కు అనవసరమైన ప్రమోషనల్ కాల్స్ లేదా స్పామ్ ఎస్సెమ్మెస్‌లు పంపబడవు."
                  : "• No Spam Guarantee: We do not share your phone number with third-party telemarketers or external advertisers."}
              </p>
            </div>
          </section>

          {/* Section 2: Razorpay Payment Processing */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-amber-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">2</span>
              <CreditCardIcon className="w-4 h-4 text-amber-500" />
              <span>{lang === "te" ? "రేజర్‌పే పేమెంట్ డేటా & భద్రత (Razorpay Payment Gateway Data)" : "2. Payment Processing via Razorpay"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• గేట్‌వే నిర్వహణ: Srushti AI లో అన్ని ఆన్‌లైన్ పేమెంట్లు Razorpay (Razorpay Software Private Limited) ద్వారా నేరుగా నిర్వహించబడతాయి."
                  : "• Payment Aggregator: All monetary transactions, credit pack purchases, and micro-wallet recharges are securely handled by Razorpay, an RBI-licensed payment aggregator."}
              </p>
              <p>
                {lang === "te"
                  ? "• రేజర్‌పేతో పంచుకునే వివరాలు: ఆర్డర్ ఐడీ (Order ID), చెల్లింపు మొత్తం, వినియోగదారు మొబైల్ నంబర్ మరియు పేమెంట్ స్థితి."
                  : "• Data Shared with Razorpay: Order ID, transaction amount, customer phone number/email, and IP address for fraud detection and payment authorization."}
              </p>
              <p>
                {lang === "te"
                  ? "• బ్యాంక్ వివరాల రక్షణ (PCI-DSS): క్రెడిట్/డెబిట్ కార్డ్ నంబర్లు, CVV కోడ్‌లు లేదా బ్యాంక్ నెట్ బ్యాంకింగ్ పాస్‌వర్డ్‌లు Srushti AI సర్వర్లలో ఎప్పటికీ సేవ్ చేయబడవు. ఇవన్నీ నేరుగా రేజర్‌పే యొక్క 256-bit ఎన్‌క్రిప్టెడ్ PCI-DSS సర్టిఫైడ్ సర్వర్లలో మాత్రమే ప్రాసెస్ చేయబడతాయి."
                  : "• PCI-DSS Compliance: Srushti AI never touches, stores, or handles credit/debit card numbers, CVVs, or Net Banking credentials. All financial authorizations occur directly through Razorpay's PCI-DSS Level 1 compliant secure infrastructure."}
              </p>
              <p>
                {lang === "te"
                  ? "• లావాదేవీ రికార్డులు: పన్ను మరియు ఆడిటింగ్ అవసరాల కోసం ఆర్డర్ ఐడీ మరియు పేమెంట్ రశీదు సమాచారం సురక్షితంగా భద్రపరచబడుతుంది."
                  : "• Invoicing & Records: We retain basic transaction metadata (Order ID, Payment ID, timestamp, amount, and credit quantity) for statutory taxation, GST compliance, and accounting records."}
              </p>
            </div>
          </section>

          {/* Section 3: Uploaded Product Media */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">3</span>
              <DatabaseIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "అప్‌లోడ్ చేసిన ప్రొడక్ట్ చిత్రాలు (Uploaded Product Images & AI Generation)" : "3. Uploaded Product Media & AI Processing"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మీరు అప్‌లోడ్ చేసిన ప్రొడక్ట్ ఫోటోలు కేవలం AI మోడల్ జనరేషన్ కోసం మాత్రమే ఉపయోగించబడతాయి. ప్రాసెసింగ్ పూర్తయిన తర్వాత మీ ఫోటోలు సురక్షిత క్లౌడ్ నిల్వలో భద్రపరచబడతాయి మరియు మీ అనుమతి లేకుండా బయటి వ్యక్తులకు అందించబడవు."
                : "Product photographs uploaded for fashion, garment, or jewelry visualization are used solely to run generative AI synthesis. Images are transmitted via encrypted HTTPS and retained securely in accordance with your account access."}
            </p>
          </section>

          {/* Section 4: Data Security & Retention */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">4</span>
              <LockIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "డేటా ఎన్‌క్రిప్షన్ & భద్రత (Data Encryption & Security)" : "4. Data Encryption & Security Standards"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మేము అత్యాధునిక TLS/SSL ఎన్‌క్రిప్షన్ ప్రోటోకాల్స్ మరియు ఫైర్‌వాల్ రక్షణను ఉపయోగిస్తాము. మీ లాగిన్ సెషన్ టోకెన్లు సురక్షితంగా నిర్వహించబడతాయి."
                : "We employ modern TLS/SSL encryption for all data in transit, reinforced with cloud perimeter firewalls. Secure session tokens protect your authentication status against unauthorized interception."}
            </p>
          </section>

          {/* Section 5: User Rights */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">5</span>
              <UserCheckIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "వినియోగదారు గోప్యతా హక్కులు (Your Rights & Data Deletion)" : "5. Your Rights & Data Deletion"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మీరు ఎప్పుడైనా మీ ఖాతా డేటాను లేదా అప్‌లోడ్ చేసిన చిత్రాలను తొలగించమని మా సపోర్ట్ బృందాన్ని (support@srushti.ai) సంప్రదించి అభ్యర్థించవచ్చు."
                : "You possess the right to review, update, or request the deletion of your account and uploaded assets. To request data deletion or account removal, contact our data protection team at support@srushti.ai."}
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-6 px-4 sm:px-8 mt-auto bg-[var(--bg-primary)] text-center text-xs opacity-75">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Srushti AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-accent font-extrabold transition-colors">
              {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
            </a>
            <a href="/privacy" className="text-accent font-extrabold underline">
              {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
