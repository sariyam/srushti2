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
const MailIcon = (props: any) => <Icon icon="lucide:mail" {...props} />;
const HeadsetIcon = (props: any) => <Icon icon="lucide:headset" {...props} />;
const FileTextIcon = (props: any) => <Icon icon="lucide:file-text" {...props} />;

export const PrivacyPolicyPage: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_lang");
      return (saved as Language) || "en";
    }
    return "en";
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
                  /privacy-policy
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
              <span>{lang === "te" ? "యాప్‌కి వెళ్లండి" : "Back to Home"}</span>
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
                {lang === "te" ? "చివరి నవీకరణ: సెప్టెంబర్ 2026 | వర్షన్ 2.0" : "Last Updated: September 2026 | Version 2.0"}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-85 pt-1">
            {lang === "te"
              ? "Srushti AI (డొమైన్: srushtiai.in) మీ వ్యక్తిగత సమాచారాన్ని, రేజర్‌పే లావాదేవీల రికార్డులను మరియు అప్‌లోడ్ చేసిన ఉత్పత్తి చిత్రాలను ఎలా సేకరిస్తుంది, భద్రపరుస్తుంది మరియు నిర్వహిస్తుందో వివరించే పారదర్శక విధానం."
              : "At Srushti AI ('we', 'us', or 'our', operating via the official domain srushtiai.in), protecting user data and financial privacy is our highest priority. This Privacy Policy details how we collect, handle, process, and secure your information in compliance with the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000."}
          </p>
          <div className="text-xs font-medium opacity-75 pt-1 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Operating Entity: <strong>Srushti AI</strong></span>
            <span>Official Domain: <strong>srushtiai.in</strong></span>
            <span>Privacy Desk: <strong>hi@srushtiai.in</strong></span>
            <span>Payment Processor: <strong>Razorpay (PCI-DSS Level 1)</strong></span>
          </div>
        </div>

        {/* Financial Security Highlight Box */}
        <div className="nm-outset rounded-[2rem] p-5 sm:p-6 space-y-2.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <LockIcon className="w-5 h-5 shrink-0" />
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
              {lang === "te" ? "ఆర్థిక భద్రత & PCI-DSS హామీ" : "Financial Data Protection & Zero-Card-Storage Guarantee"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] font-medium break-words">
            {lang === "te"
              ? "ముఖ్యమైన గమనిక: క్రెడిట్/డెబిట్ కార్డు నంబర్లు, CVV కోడ్‌లు, నెట్ బ్యాంకింగ్ పాస్‌వర్డ్‌లు లేదా UPI PIN వివరాలను Srushti AI ఎట్టి పరిస్థితుల్లోనూ సేకరించదు లేదా తన సర్వర్లలో నిల్వ చేయదు. అన్ని చెల్లింపులు పూర్తిగా Razorpay యొక్క PCI-DSS Level 1 సర్టిఫైడ్ సురక్షిత సర్వర్ల ద్వారా నిర్వహించబడతాయి."
              : "Crucial Financial Safeguard: Srushti AI NEVER collects, stores, or accesses your sensitive payment instruments (credit/debit card numbers, CVV codes, net banking passwords, or UPI PINs). All monetary transactions are processed directly by Razorpay Software Private Limited under strict PCI-DSS Level 1 banking security compliance."}
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Section 1: Information We Collect */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-accent">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">1</span>
              <SmartphoneIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "మేము సేకరించే సమాచారం (Information We Collect)" : "1. Information We Collect"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2.5">
              <p>
                {lang === "te"
                  ? "• ఖాతా సమాచారం: మీ 10 అంకెల భారతీయ మొబైల్ నంబర్ మరియు లాగిన్ సమయంలో ధృవీకరించబడిన OTP స్థితి."
                  : "• Account & Identity Information: Your valid 10-digit Indian mobile number, required for secure One-Time Password (OTP) verification and authentication."}
              </p>
              <p>
                {lang === "te"
                  ? "• లావాదేవీ వివరాలు: రేజర్‌పే ఆర్డర్ ఐడీ (Order ID), పేమెంట్ ఐడీ (Payment ID), మొత్తం (Amount in INR), సమయం, కొనుగోలు చేసిన క్రెడిట్స్ మరియు లావాదేవీ స్థితి. (కార్డ్/బ్యాంక్ వివరాలు ఇందులో ఉండవు)."
                  : "• Transaction & Invoicing Metadata: Razorpay Order ID, Razorpay Payment ID, transaction currency (INR ₹), amount paid, timestamp, and credit fulfillment status. We strictly do not store card numbers or banking secrets."}
              </p>
              <p>
                {lang === "te"
                  ? "• వినియోగదారు మీడియా: వర్చువల్ మోడల్ ఫోటోషూట్ ప్రాసెస్ చేయడానికి మీరు స్వచ్ఛందంగా అప్‌లోడ్ చేసిన దుస్తులు లేదా ఆభరణాల ఫోటోలు."
                  : "• User Uploaded Media: Product and garment imagery voluntarily provided by you to run generative AI photoshoot syntheses."}
              </p>
              <p>
                {lang === "te"
                  ? "• సాంకేతిక సమాచారం: సర్వర్ భద్రత, మోసాల నివారణ మరియు రేట్-లిమిటింగ్ కోసం ఐపీ అడ్రస్, బ్రౌజర్ రకం మరియు పరికర సమాచారం."
                  : "• Device & Technical Diagnostics: IP address, device telemetry, and browser user-agent collected solely for fraud mitigation, session management, and DDoS protection."}
              </p>
            </div>
          </section>

          {/* Section 2: How We Use Information */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">2</span>
              <DatabaseIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "సమాచార వినియోగ ప్రయోజనాలు (How We Use Your Data)" : "2. Purpose of Data Processing"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "మేము సేకరించిన సమాచారాన్ని క్రింది చట్టబద్ధమైన ప్రయోజనాల కోసం మాత్రమే ఉపయోగిస్తాము:"
                  : "We process your personal information exclusively for the following legitimate business purposes:"}
              </p>
              <p>
                {lang === "te"
                  ? "• మీ వాలెట్ క్రెడిట్‌లను నిర్వహించడం మరియు తక్షణమే డిజిటల్ క్రెడిట్స్ కేటాయించడం."
                  : "• Provisioning, authenticating, and synchronizing your prepaid digital wallet credits."}
              </p>
              <p>
                {lang === "te"
                  ? "• మీరు అభ్యర్థించిన ఏఐ మోడల్ ఫోటోషూట్ చిత్రాలను ఉత్పత్తి చేయడం మరియు డౌన్‌లోడ్ కోసం అందించడం."
                  : "• Synthesizing, rendering, and delivering your requested high-resolution AI fashion visuals."}
              </p>
              <p>
                {lang === "te"
                  ? "• Razorpay ద్వారా చెల్లింపు రశీదులను ధృవీకరించడం మరియు చట్టబద్ధమైన పన్ను రికార్డులను నిర్వహించడం."
                  : "• Verifying financial transaction status, tax bookkeeping, and issuing digital purchase confirmations."}
              </p>
              <p>
                {lang === "te"
                  ? "• మీ అభ్యర్థన మేరకు కస్టమర్ మద్దతు మరియు ఫిర్యాదుల పరిష్కారాన్ని అందించడం."
                  : "• Providing prompt customer support, handling service inquiries, and executing refunds where applicable."}
              </p>
            </div>
          </section>

          {/* Section 3: Razorpay & Third-Party Processors */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-amber-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">3</span>
              <CreditCardIcon className="w-4 h-4 text-amber-500" />
              <span>{lang === "te" ? "రేజర్‌పే & మూడవ పక్ష సేవా భాగస్వాములు" : "3. Payment Gateway & Third-Party Service Providers"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• చెల్లింపు అగ్రిగేటర్: Srushti AI లో అన్ని ఆర్థిక లావాదేవీలు Razorpay Software Private Limited ద్వారా నిర్వహించబడతాయి. చెల్లింపు ప్రాసెసింగ్ సమయంలో Razorpay కి అవసరమైన లావాదేవీ ఐడీ మరియు మొత్తం మాత్రమే బదిలీ చేయబడతాయి."
                  : "• Payment Processing Partner: Payments are facilitated through Razorpay Software Private Limited, an RBI-licensed payment aggregator. When you initialize a recharge, Razorpay manages the secure checkout interface and communicates transaction status back to our servers."}
              </p>
              <p>
                {lang === "te"
                  ? "• నో-సేల్ హామీ (No Sale of Data): మేము మీ వ్యక్తిగత సమాచారాన్ని, ఫోన్ నంబర్‌ను లేదా ఫోటోలను ఏ ఇతర ప్రకటన కంపెనీలకు లేదా మూడవ పక్షాలకు ఎట్టి పరిస్థితుల్లోనూ విక్రయించము, అద్దెకు ఇవ్వము."
                  : "• No-Sale Policy: Srushti AI never sells, rents, monetizes, or leases your phone numbers, personal identity, or visual assets to third-party data brokers or marketing agencies."}
              </p>
              <p>
                {lang === "te"
                  ? "• క్లౌడ్ మౌలిక సదుపాయాలు: మా సర్వర్లు అత్యాధునిక ఎన్‌క్రిప్ట్ చేసిన సురక్షిత డేటా సెంటర్లలో పనిచేస్తాయి."
                  : "• Cloud Infrastructure: Generative computations and temporary storage operate within tier-1 secure cloud data centers governed by industry-standard encryption standards."}
              </p>
            </div>
          </section>

          {/* Section 4: Data Security & Storage */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">4</span>
              <LockIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "డేటా భద్రత & రక్షణ ప్రమాణాలు (Data Security)" : "4. Data Security & Encryption"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• ఎండ్‌-టు-ఎండ్‌ ఎన్‌క్రిప్షన్: మా వెబ్‌సైట్ మరియు API కమ్యూనికేషన్లు 256-bit TLS/SSL ఎన్‌క్రిప్షన్ ద్వారా రక్షించబడతాయి."
                  : "• Encryption Standards: All communications between your client browser and our application are secured using 256-bit Transport Layer Security (TLS/HTTPS) protocols."}
              </p>
              <p>
                {lang === "te"
                  ? "• యాక్సెస్ నియంత్రణ: డేటాబేస్ యాక్సెస్ కఠినమైన ప్రమాణీకరణ మరియు పరిమిత అధికారాలతో నిర్వహించబడుతుంది."
                  : "• Restricted Access: Administrative access to production databases is strictly role-gated and monitored with automated anomaly detection."}
              </p>
            </div>
          </section>

          {/* Section 5: User Rights & Data Deletion */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-emerald-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">5</span>
              <UserCheckIcon className="w-4 h-4 text-emerald-500" />
              <span>{lang === "te" ? "మీ హక్కులు & డేటా తొలగింపు అభ్యర్థన (Your Rights & Deletion)" : "5. Your Rights & Account Data Deletion"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "భారతీయ డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ చట్టం ప్రకారం, మీకు క్రింది హక్కులు ఉన్నాయి:"
                  : "Under applicable data protection laws, including the Digital Personal Data Protection Act, 2023, you have the following rights:"}
              </p>
              <p>
                {lang === "te"
                  ? "• మీ వ్యక్తిగత ఖాతా సమాచారాన్ని తెలుసుకోవడం మరియు సరిచేయడం."
                  : "• Right to Access: You may request details of any personal information held about you."}
              </p>
              <p>
                {lang === "te"
                  ? "• డేటా తొలగింపు హక్కు: మీ ఖాతా, మొబైల్ నంబర్ రికార్డులు లేదా అప్‌లోడ్ చేసిన చిత్రాలను పూర్తిగా తొలగించాలని కోరుతూ hi@srushtiai.in కు ఇమెయిల్ పంపవచ్చు. చట్టబద్ధమైన పన్ను రికార్డులు మినహా మిగిలిన మొత్తం డేటా 30 రోజుల్లో తొలగించబడుతుంది."
                  : "• Right to Erasure / Account Deletion: You can permanently delete your uploaded images, photoshoot history, and account profile by writing to hi@srushtiai.in. We honor deletion requests within 30 days, retaining only statutory accounting logs mandated by taxation authorities."}
              </p>
            </div>
          </section>

          {/* Section 6: Cookies & Local Storage */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">6</span>
              <span>{lang === "te" ? "కుకీలు & స్థానిక నిల్వ (Cookies & Storage)" : "6. Cookies & Local Storage"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "మేము ట్రాకింగ్ యాడ్ కుకీలను ఉపయోగించము. మీ భాష ఎంపిక (తెలుగు/ఇంగ్లీష్), డార్క్/లైట్ థీమ్ మరియు లాగిన్ సెషన్ నిర్వహణ కోసం కేవలం బ్రౌజర్ స్థానిక నిల్వ (Local Storage) ను మాత్రమే ఉపయోగిస్తాము."
                : "Srushti AI does not employ invasive advertising tracking cookies. We utilize essential client-side LocalStorage exclusively to remember your preferred UI theme (light/dark), language choice (English/Telugu), and authenticated session token."}
            </p>
          </section>

          {/* Section 7: Grievance Redressal & Privacy Contact */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-accent">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">7</span>
              <HeadsetIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "డేటా రక్షణ & ఫిర్యాదుల అధికారి (Grievance Officer)" : "7. Grievance Redressal & Privacy Contact"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "గోప్యతా సమస్యలు లేదా డేటా రక్షణకు సంబంధించి ఏవైనా ప్రశ్నలు ఉంటే మా అధికారిని సంప్రదించండి:"
                  : "If you have any questions, concerns, or grievances concerning your data privacy or transaction privacy, please reach out to our designated Privacy & Grievance Officer:"}
              </p>
              <div className="p-4 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5 space-y-1.5 font-medium">
                <p><strong>Designation:</strong> Data Protection & Grievance Redressal Officer</p>
                <p><strong>Platform:</strong> Srushti AI (srushtiai.in)</p>
                <p className="flex items-center gap-1.5">
                  <MailIcon className="w-4 h-4 text-accent shrink-0" />
                  <span><strong>Official Email:</strong> <a href="mailto:hi@srushtiai.in" className="text-accent underline font-bold">hi@srushtiai.in</a></span>
                </p>
                <p><strong>Hours:</strong> Monday to Saturday, 10:00 AM – 6:00 PM IST</p>
                <p><strong>Response Timeline:</strong> Queries acknowledged within 24–48 hours; resolution completed within 15 working days.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-6 px-4 sm:px-8 mt-auto bg-[var(--bg-primary)] text-center text-xs opacity-85">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Srushti AI (srushtiai.in). All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/terms-and-conditions" className="hover:text-accent font-extrabold transition-colors">
              {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
            </a>
            <a href="/privacy-policy" className="text-accent font-extrabold underline">
              {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
            </a>
            <a href="mailto:hi@srushtiai.in" className="hover:text-accent font-extrabold transition-colors flex items-center gap-1.5">
              <span>Contact: hi@srushtiai.in</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

