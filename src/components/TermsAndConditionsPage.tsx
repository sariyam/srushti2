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
const SmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const CreditCardIcon = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const RotateCcwIcon = (props: any) => <Icon icon="lucide:rotate-ccw" {...props} />;
const PackageCheckIcon = (props: any) => <Icon icon="lucide:package-check" {...props} />;
const ScaleIcon = (props: any) => <Icon icon="lucide:scale" {...props} />;
const MailIcon = (props: any) => <Icon icon="lucide:mail" {...props} />;
const HeadsetIcon = (props: any) => <Icon icon="lucide:headset" {...props} />;

export const TermsAndConditionsPage: React.FC = () => {
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
                  /terms-and-conditions
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
              <FileTextIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-emphasis)] tracking-tight">
                {lang === "te" ? "నిబంధనలు మరియు షరతులు" : "Terms and Conditions"}
              </h1>
              <p className="text-xs font-medium text-accent mt-0.5">
                {lang === "te" ? "చివరి నవీకరణ: సెప్టెంబర్ 2026 | వర్షన్ 2.0" : "Last Updated: September 2026 | Version 2.0"}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-85 pt-1">
            {lang === "te"
              ? "సృష్టి ఏఐ (Srushti AI) ప్లాట్‌ఫారమ్‌ను ఉపయోగించడానికి ప్రాథమిక నిబంధనలు. డిజిటల్ ఏఐ ఫోటోషూట్ సేవలు, రేజర్‌పే పేమెంట్లు, డెలివరీ విధానం మరియు క్యాన్సిలేషన్/రీఫండ్ నిబంధనలు ఇక్కడ వివరించబడ్డాయి."
              : "Welcome to Srushti AI ('we', 'our', 'us'). These Terms and Conditions govern your access to and use of Srushti AI's generative AI photoshoot visualization software, digital wallet credit top-ups, and online payment services processed securely via Razorpay."}
          </p>
          <div className="text-xs font-medium opacity-75 pt-1 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Operating Entity: <strong>Srushti AI</strong></span>
            <span>Support: <strong>hi@srushti-ai.com</strong></span>
            <span>Payment Gateway: <strong>Razorpay (RBI Regulated)</strong></span>
          </div>
        </div>

        {/* AI Generation Accuracy Disclaimer Highlight Box */}
        <div className="nm-outset rounded-[2rem] p-5 sm:p-6 space-y-2.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <InfoIcon className="w-5 h-5 shrink-0" />
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
              {lang === "te" ? "గమనిక: చిత్ర ఖచ్చితత్వం నిరాకరణ (AI Generation Accuracy Disclaimer)" : "Important Note: AI Image Generation Accuracy"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] font-medium break-words">
            {lang === "te"
              ? "జనరేట్ చేయబడిన చిత్రాల ఖచ్చితత్వం మీరు అప్‌లోడ్ చేసిన ప్రొడక్ట్ ఫోటో నాణ్యత, లైటింగ్ మరియు స్పష్టతపై ఆధారపడి ఉంటుంది. సోర్స్ చిత్రం తక్కువ రిజల్యూషన్ లేదా మసకగా ఉంటే, జనరేట్ చేయబడిన అవుట్‌పుట్ అసలు ఉత్పత్తి కంటే కొద్దిగా భిన్నంగా ఉండవచ్చు."
              : "The visual fidelity of generated fashion, garment, and jewelry photoshoot images is intrinsically dependent on the quality, lighting, and resolution of the source media uploaded by the user. While our generative pipeline strives for photorealism, variance in drape, shade, or background rendering may occur."}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {/* Section 1: Acceptance of Terms */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">1</span>
              <span>{lang === "te" ? "సేవల అంగీకారం (Acceptance of Terms)" : "1. Acceptance of Terms & Services"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "Srushti AI వెబ్‌సైట్, స్టూడియో లేదా చెల్లింపు వ్యవస్థను ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలకు మరియు వర్తించే అన్ని భారతీయ చట్టాలు (Information Technology Act, 2000 తో సహా) కట్టుబడి ఉండటానికి అంగీకరిస్తున్నారు."
                  : "By accessing, browsing, registering via OTP, or recharging wallet credits on Srushti AI, you confirm that you are at least 18 years of age and legally competent to enter into this binding agreement. If you do not agree with any part of these Terms, you must not use our platform."}
              </p>
              <p>
                {lang === "te"
                  ? "Srushti AI ఆన్‌లైన్ ఇ-కామర్స్ విక్రేతలు, బొటిక్‌లు మరియు చిన్న వ్యాపారులకు వారి వస్త్రాలు మరియు ఆభరణాల కోసం మోడల్ ఫోటోషూట్ చిత్రాలను డిజిటల్‌గా రూపొందించే సాఫ్ట్‌వేర్ సేవలను అందిస్తుంది."
                  : "Srushti AI provides on-demand artificial intelligence software as a service (SaaS), enabling online merchants, home businesses, and apparel sellers to synthesize photorealistic virtual model imagery from plain product photos."}
              </p>
            </div>
          </section>

          {/* Section 2: Mobile OTP Login */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">2</span>
              <SmartphoneIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "మొబైల్ OTP ప్రామాణీకరణ & ఖాతా భద్రత" : "2. Mobile Authentication & Account Security"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• ఖాతా లాగిన్ మరియు వాలెట్ బ్యాలెన్స్ యాక్సెస్ కోసం భారతీయ 10 అంకెల మొబైల్ నంబర్ ద్వారా One-Time Password (OTP) ప్రామాణీకరణ నిర్వహించబడుతుంది."
                  : "• User authentication and wallet credit synchronization are governed via a valid 10-digit mobile number and secure One-Time Password (OTP) validation."}
              </p>
              <p>
                {lang === "te"
                  ? "• మీ మొబైల్ OTP రహస్య కోడ్‌ను ఇతరులతో ఎప్పుడూ పంచుకోవద్దు. మీ పరికరం ద్వారా జరిగే అన్ని కార్యకలాపాలకు మీరే బాధ్యులు."
                  : "• You are solely responsible for maintaining the confidentiality of your credentials and OTP codes. Srushti AI personnel will never ask for your OTP via phone, email, or social media."}
              </p>
            </div>
          </section>

          {/* Section 3: Pricing & Payments via Razorpay */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-amber-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">3</span>
              <CreditCardIcon className="w-4 h-4 text-amber-500" />
              <span>{lang === "te" ? "ధరలు & రేజర్‌పే చెల్లింపులు (Pricing & Razorpay Payments)" : "3. Pricing, Invoicing & Razorpay Payment Processing"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• ధరలు: అన్ని ప్యాకేజీలు మరియు వాలెట్ టాప్-అప్ ప్లాన్లు భారతీయ రూపాయలలో (INR ₹) వర్తించే పన్నులతో సహా స్పష్టంగా ప్రదర్శించబడతాయి. మేము ₹1 నుండి మైక్రో-ట్రయల్ రీఛార్జ్ ప్యాకేజీలను అందిస్తున్నాము."
                  : "• Currency & Pricing: All fees, credit packs, and wallet recharges are quoted in Indian Rupees (INR ₹). Prices are clearly itemized on the wallet checkout screen prior to initiating payment. We support affordable micro-topups starting from ₹1 trial packs."}
              </p>
              <p>
                {lang === "te"
                  ? "• చెల్లింపు భాగస్వామి: అన్ని ఆన్‌లైన్ లావాదేవీలు రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా (RBI) నిబంధనల ప్రకారం ఆమోదించబడిన Razorpay (Razorpay Software Private Limited) ద్వారా సురక్షితంగా ప్రాసెస్ చేయబడతాయి."
                  : "• Authorized Payment Partner: All payments are processed through Razorpay (Razorpay Software Private Limited), an authorized Payment Aggregator regulated by the Reserve Bank of India (RBI)."}
              </p>
              <p>
                {lang === "te"
                  ? "• ఆమోదించబడే విధానాలు: UPI (Google Pay, PhonePe, Paytm, BHIM, Cred), డెబిట్/క్రెడిట్ కార్డులు (Visa, Mastercard, RuPay), నెట్ బ్యాంకింగ్ మరియు వాలెట్లు."
                  : "• Supported Payment Modes: UPI (Google Pay, PhonePe, Paytm, BHIM, Cred), Debit & Credit Cards (Visa, MasterCard, RuPay), Net Banking across major Indian banks, and supported digital wallets."}
              </p>
              <p>
                {lang === "te"
                  ? "• PCI-DSS సమ్మతి: కార్డ్ నంబర్లు, CVV లేదా బ్యాంక్ పాస్‌వర్డ్‌లను Srushti AI ఎప్పటికీ నిల్వ చేయదు. చెల్లింపులు Razorpay యొక్క PCI-DSS Level 1 ఎన్‌క్రిప్టెడ్ నెట్‌వర్క్ ద్వారా నిర్వహించబడతాయి."
                  : "• Security Standards: Srushti AI strictly adheres to RBI card storage guidelines and PCI-DSS Level 1 compliance. We never capture, view, or store payment card details, CVVs, or Net Banking credentials on our systems."}
              </p>
              <p>
                {lang === "te"
                  ? "• రికరింగ్ సబ్‌స్క్రిప్షన్ లేదు: Srushti AI ఎటువంటి ఆటో-డెబిట్ లేదా ముందస్తు అనుమతి లేని నెలవారీ కట్లను అమలు చేయదు. మీ వాలెట్‌ను మీరు రీఛార్జ్ చేసినప్పుడు మాత్రమే మొత్తం డెబిట్ అవుతుంది."
                  : "• Pay-As-You-Go: Srushti AI operates on an on-demand prepaid wallet model. There are no recurring auto-debit subscriptions without your explicit affirmative action."}
              </p>
            </div>
          </section>

          {/* Section 4: Digital Delivery & Fulfillment Policy (MANDATORY FOR RAZORPAY) */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-emerald-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">4</span>
              <PackageCheckIcon className="w-4 h-4 text-emerald-500" />
              <span>{lang === "te" ? "డిజిటల్ డెలివరీ & సర్వీస్ పూర్తి విధానం (Shipping & Delivery Policy)" : "4. Shipping & Delivery Policy (Digital Fulfillment)"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• భౌతిక వస్తువుల డెలివరీ లేదు: Srushti AI స్వచ్ఛమైన డిజిటల్ సాఫ్ట్‌వేర్ సేవలను అందిస్తుంది. ఎటువంటి భౌతిక వస్తువుల షిప్పింగ్ లేదా కొరియర్ ఉండదు."
                  : "• Digital Products Only: Srushti AI is a cloud-based software-as-a-service platform offering digital virtual photoshoots and digital wallet credits. No tangible physical goods are shipped or delivered."}
              </p>
              <p>
                {lang === "te"
                  ? "• తక్షణ డెలివరీ సమయం: Razorpay ద్వారా చెల్లింపు విజయవంతమైన వెంటనే, డిజిటల్ క్రెడిట్స్ క్షణాల్లో (సాధారణంగా 1 నుండి 10 సెకన్లలో) మీ Srushti AI వాలెట్‌లో జమవుతాయి."
                  : "• Instant Service Delivery Timeline: Upon successful authorization and confirmation of payment by Razorpay, digital credits are provisioned electronically to the user's account immediately (typically within 1 to 5 seconds, and no later than 10 minutes in event of network congestion)."}
              </p>
              <p>
                {lang === "te"
                  ? "• ఫోటోల లభ్యత: జనరేట్ చేయబడిన హై-డెఫినిషన్ AI మోడల్ చిత్రాలు వెంటనే యాప్ ఇంటర్‌ఫేస్‌లో వీక్షించడానికి మరియు డౌన్‌లోడ్ చేసుకోవడానికి అందుబాటులో ఉంటాయి."
                  : "• Output Delivery: AI-synthesized model photographs are made accessible instantaneously within the web application interface for real-time preview and direct high-resolution PNG/JPEG download."}
              </p>
              <p>
                {lang === "te"
                  ? "• డెలివరీ నిర్ధారణ: ప్రతి విజయవంతమైన చెల్లింపుకు ఆర్డర్ ఐడీ (Order ID) మరియు పేమెంట్ ఐడీ (Payment ID) తో కూడిన డిజిటల్ రశీదు స్క్రీన్‌పై ప్రదర్శించబడుతుంది."
                  : "• Delivery Confirmation: A digital transaction reference containing the unique Razorpay Payment ID and allocated credit count is displayed on-screen and retained in the user's account activity log."}
              </p>
            </div>
          </section>

          {/* Section 5: Cancellation & Refund Policy (MANDATORY FOR RAZORPAY) */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-rose-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">5</span>
              <RotateCcwIcon className="w-4 h-4 text-rose-500" />
              <span>{lang === "te" ? "రద్దు మరియు రీఫండ్ విధానం (Cancellation & Refund Policy)" : "5. Cancellation & Refund Policy"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• ఆర్డర్ రద్దు: వినియోగదారు అభ్యర్థన మేరకు AI మోడల్ జనరేషన్ ప్రాసెస్ ప్రారంభమైన తర్వాత లేదా క్రెడిట్స్ ఉపయోగించబడిన తర్వాత ఆర్డర్‌ను రద్దు చేయడం సాధ్యపడదు."
                  : "• Cancellation: Due to the real-time computational resources consumed during AI synthesis, cancellation is not possible once an image generation task has commenced or credits have been utilized."}
              </p>
              <p>
                {lang === "te"
                  ? "• ఉపయోగించని క్రెడిట్స్: మీ వాలెట్‌లో ఉన్న అన్‌యూజ్డ్ క్రెడిట్స్‌కు లైఫ్‌టైమ్ వాలిడిటీ ఉంటుంది, కాబట్టి వాటిని మీరు ఎప్పుడైనా భవిష్యత్తు ఫోటోషూట్‌ల కోసం ఉపయోగించుకోవచ్చు."
                  : "• Credit Validity: Purchased wallet credits come with lifetime validity and do not expire, allowing users to consume them flexibly across future studio sessions."}
              </p>
              <p>
                {lang === "te"
                  ? "• సాంకేతిక సమస్యలు & డబుల్ డెబిట్ రీఫండ్: సర్వర్ లోపం లేదా నెట్‌వర్క్ సమస్యల కారణంగా మీ ఖాతా నుండి డబ్బు కట్ అయ్యి, వాలెట్‌లో క్రెడిట్స్ జమ కాకపోతే, ఆ మొత్తం స్వయంచాలకంగా లేదా మీ అభ్యర్థన మేరకు పూర్తిగా రీఫండ్ చేయబడుతుంది."
                  : "• Failed Transactions / Technical Non-Delivery: If funds are debited from your bank account or UPI but credits fail to reflect in your Srushti AI wallet due to technical failure or communication timeout, our automated reconciliation system initiates a reversal."}
              </p>
              <p>
                {lang === "te"
                  ? "• రీఫండ్ అభ్యర్థన విధానం: రీఫండ్ కోసం Razorpay Payment ID తో మా సపోర్ట్ ఇమెయిల్ (hi@srushti-ai.com) కి 7 రోజులలోపు వివరాలను పంపండి."
                  : "• How to Claim a Refund: Users can write to our dedicated support desk at hi@srushti-ai.com with their registered mobile number and Razorpay Payment ID (pay_xxxx) within 7 days of the transaction."}
              </p>
              <p>
                {lang === "te"
                  ? "• రీఫండ్ కాలపరిమితి: ఆమోదించబడిన రీఫండ్‌లు బ్యాంకింగ్ నిబంధనల ప్రకారం 5 నుండి 7 పనిదినాల్లో మీ అసలు చెల్లింపు ఖాతాకు (Bank / UPI / Card) జమ చేయబడతాయి."
                  : "• Refund Settlement Timeline: Once validated, eligible refunds will be initiated via Razorpay back to the original source payment instrument (Bank account, UPI handle, or Credit/Debit card) within 5 to 7 standard business working days."}
              </p>
            </div>
          </section>

          {/* Section 6: Intellectual Property & Commercial Usage */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">6</span>
              <ShieldCheckIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "మేధో సంపత్తి & వాణిజ్య వినియోగ హక్కులు" : "6. Intellectual Property & Commercial Rights"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "• మీరు అప్‌లోడ్ చేసిన ఉత్పత్తి చిత్రాలపై పూర్తి కాపీరైట్ మీకే ఉంటుంది. కేవలం మీ అభ్యర్థన మేరకు ఫోటోషూట్ ప్రాసెస్ చేయడానికి మాత్రమే Srushti AI కి అనుమతి ఉంటుంది."
                  : "• You retain all copyright, title, and ownership rights to the product imagery you upload. You grant Srushti AI a limited, non-exclusive license solely to process and synthesize the requested model imagery."}
              </p>
              <p>
                {lang === "te"
                  ? "• కమర్షియల్ వినియోగం: Srushti AI ద్వారా జనరేట్ చేయబడిన ఫోటోలను మీరు మీ Instagram, WhatsApp, Amazon, Flipkart, Meesho లేదా వెబ్‌సైట్ విక్రయాల కోసం వాణిజ్యపరంగా నిరభ్యంతరంగా ఉపయోగించవచ్చు."
                  : "• Commercial Freedom: Generated photographs can be utilized freely for commercial merchandising, Instagram catalogues, WhatsApp sales, Amazon, Flipkart, Meesho, Shopify stores, and digital marketing."}
              </p>
            </div>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)]">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">7</span>
              <span>{lang === "te" ? "బాధ్యత పరిమితి (Limitation of Liability)" : "7. Limitation of Liability"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "Srushti AI సేవలను 'యాజ్ ఈజ్' (As-is) ప్రాతిపదికన అందిస్తుంది. ఏఐ చిత్రాలు విజువలైజేషన్ కోసం మాత్రమే రూపొందించబడ్డాయి. భౌతిక వస్త్ర ఉత్పత్తి మరియు AI చిత్రం మధ్య ఏర్పడే స్వల్ప వైవిధ్యాల వల్ల వచ్చే నష్టాలకు Srushti AI బాధ్యత వహించదు."
                : "To the maximum extent permitted by applicable Indian law, Srushti AI and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service. Total cumulative liability shall not exceed the amount paid by you to Srushti AI in the preceding 30 days."}
            </p>
          </section>

          {/* Section 8: Governing Law & Jurisdiction */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-indigo-500">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">8</span>
              <ScaleIcon className="w-4 h-4 text-indigo-500" />
              <span>{lang === "te" ? "వర్తించే చట్టం & న్యాయపరిధి (Governing Law & Jurisdiction)" : "8. Governing Law & Dispute Resolution"}</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {lang === "te"
                ? "ఈ నిబంధనలు మరియు చెల్లింపు లావాదేవీలు భారతదేశ చట్టాల ప్రకారం నిర్వహించబడతాయి. ఏవైనా వివాదాలు తలెత్తితే అవి భారతదేశంలోని సంబంధిత కోర్టుల పరిధికి మాత్రమే లోబడి ఉంటాయి."
                : "These Terms and Conditions and any transactions conducted on Srushti AI shall be governed by and interpreted in accordance with the laws of the Republic of India. Any legal dispute arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in India."}
            </p>
          </section>

          {/* Section 9: Customer Support & Grievance Officer */}
          <section className="nm-outset rounded-[2rem] p-6 space-y-3 bg-[var(--bg-panel)] border-l-4 border-accent">
            <h2 className="font-extrabold text-base text-[var(--text-emphasis)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg nm-inset-sm flex items-center justify-center text-xs text-accent font-mono">9</span>
              <HeadsetIcon className="w-4 h-4 text-accent" />
              <span>{lang === "te" ? "కస్టమర్ సపోర్ట్ & ఫిర్యాదుల అధికారి (Grievance Redressal)" : "9. Customer Support & Grievance Redressal Officer"}</span>
            </h2>
            <div className="text-xs sm:text-sm leading-relaxed opacity-85 space-y-2">
              <p>
                {lang === "te"
                  ? "Information Technology Act, 2000 మరియు రూల్స్ ప్రకారం కస్టమర్ సపోర్ట్ మరియు ఫిర్యాదుల పరిష్కార వివరాలు క్రింది విధంగా ఉన్నాయి:"
                  : "In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of our Grievance Redressal Officer are provided below:"}
              </p>
              <div className="p-4 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5 space-y-1.5 font-medium">
                <p><strong>Designation:</strong> Customer Support & Grievance Officer</p>
                <p><strong>Platform:</strong> Srushti AI</p>
                <p className="flex items-center gap-1.5">
                  <MailIcon className="w-4 h-4 text-accent shrink-0" />
                  <span><strong>Official Email:</strong> <a href="mailto:hi@srushti-ai.com" className="text-accent underline font-bold">hi@srushti-ai.com</a></span>
                </p>
                <p><strong>Working Hours:</strong> Monday to Saturday, 10:00 AM – 6:00 PM IST</p>
                <p><strong>Response Timeline:</strong> Queries acknowledged within 24–48 business hours; resolution provided within 15 working days.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-6 px-4 sm:px-8 mt-auto bg-[var(--bg-primary)] text-center text-xs opacity-85">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Srushti AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/terms-and-conditions" className="text-accent font-extrabold underline">
              {lang === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}
            </a>
            <a href="/privacy-policy" className="hover:text-accent font-extrabold transition-colors">
              {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
            </a>
            <a href="mailto:hi@srushti-ai.com" className="hover:text-accent font-extrabold transition-colors flex items-center gap-1.5">
              <span>Contact: hi@srushti-ai.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

