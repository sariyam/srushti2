import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminSettingsApi,
  updateAdminSettingByKeyApi,
  SystemSettingRecord,
} from "../../utils/api";
import {
  CreditSettings,
  getCreditSettings,
  saveCreditSettings,
  DEFAULT_CREDIT_SETTINGS,
  formatCredits,
} from "../../utils/wallet";
import { getImagePrice, formatPrice } from "../../data";

interface PricingMarginsTabProps {
  lang: "en" | "te";
}

export const PricingMarginsTab: React.FC<PricingMarginsTabProps> = ({ lang }) => {
  const [creditSettings, setCreditSettings] = useState<CreditSettings>(() => getCreditSettings());
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [usdToInrRate, setUsdToInrRate] = useState<number>(85.0);
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(false);
  const [rateFetchStatus, setRateFetchStatus] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<number>(50);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  useEffect(() => {
    // Load remote server pricing settings
    const loadRemote = async () => {
      try {
        const settings = await fetchAdminSettingsApi();
        const pr = settings.find((s) => s.key === "pricing_rules")?.value;
        if (pr) {
          const merged = { ...creditSettings, ...pr };
          setCreditSettings(merged);
          saveCreditSettings(merged);
        }
      } catch (e) {
        console.warn("Using local credit settings fallback:", e);
      }
    };
    loadRemote();
  }, []);

  const handleUpdate = (field: keyof CreditSettings, value: any) => {
    const updated = { ...creditSettings, [field]: value };
    setCreditSettings(updated);
    saveCreditSettings(updated);
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await updateAdminSettingByKeyApi(
        "pricing_rules",
        creditSettings,
        "Razorpay currency exchange ratios, image generation credit deductions, and margin multipliers"
      );
      setToastMsg(isEn ? "Pricing settings synced to server" : "ధరల అమరికలు సర్వర్‌తో సింక్ చేయబడ్డాయి");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to sync pricing settings to server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setCreditSettings(DEFAULT_CREDIT_SETTINGS);
    saveCreditSettings(DEFAULT_CREDIT_SETTINGS);
    setToastMsg(isEn ? "Defaults restored" : "డిఫాల్ట్ పునరుద్ధరించబడింది");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleFetchLiveRate = async () => {
    setIsFetchingRate(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      if (data?.rates?.INR) {
        const rate = Math.round(data.rates.INR * 100) / 100;
        setUsdToInrRate(rate);
        setRateFetchStatus(`Live: ₹${rate}/USD`);
        setTimeout(() => setRateFetchStatus(null), 4000);
      }
    } catch {
      setRateFetchStatus("Rate fetch failed");
      setTimeout(() => setRateFetchStatus(null), 3000);
    } finally {
      setIsFetchingRate(false);
    }
  };

  // Base raw price for low quality
  const rawModelPriceUsd = getImagePrice("gpt-image-2.5-sunburst", "1024x1024", "low") || 0.005;
  const effectiveCostPerImage =
    creditSettings.pricingMode === "cost_plus_margin"
      ? creditSettings.costPerImageGenLow * (1 + creditSettings.profitMarginPercent / 100)
      : creditSettings.costPerImageGenLow;

  const totalCalculatedCredits = imageCount * effectiveCostPerImage;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:coins" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Pricing Rules & Margin Engine" : "ధరల వ్యవస్థ & లాభాల ఇంజిన్"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Configure credit exchange rates for Razorpay recharges, shoot deductions, and margin markups."
              : "రేజర్‌పే రీఛార్జ్ మార్పిడి రేట్లు, ఫోటో షూట్ తగ్గింపులు మరియు లాభ మార్జిన్‌లను అమర్చండి."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="m3-btn-outlined px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
          >
            {isEn ? "Reset Defaults" : "డిఫాల్ట్"}
          </button>
          <button
            type="button"
            onClick={handleSaveToServer}
            disabled={isSaving}
            className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Icon icon="lucide:save" className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : isEn ? "Save Pricing" : "సేవ్ చేయండి"}</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-2xl bg-[var(--md-success-container)] text-[var(--md-on-success-container)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Icon icon="lucide:check-circle" className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-[var(--md-error-container)] text-[var(--md-on-error-container)] text-xs font-bold flex items-center gap-2">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pricing & Credit Conversion Rules Table */}
      <div className="m3-card overflow-hidden">
        <div className="p-4 border-b border-[var(--md-outline-variant)] bg-[var(--md-surface-container)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
              <Icon icon="lucide:coins" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                {isEn ? "Pricing & Credit Conversion Matrix" : "ధరల & క్రెడిట్ మార్పిడి పట్టిక"}
              </h3>
              <p className="text-[10px] text-[var(--md-on-surface-variant)]">
                {isEn ? "Configure wallet recharge yields, per-shoot deduction rates, margin markups, and live currency exchange." : "రీఛార్జ్ రేట్లు, షూట్ ఛార్జీలు, లాభాల మార్జిన్ మరియు కరెన్సీ మార్పిడి నియంత్రణలు."}
              </p>
            </div>
          </div>
          <span className="m3-badge text-[9px] px-2.5 py-1 uppercase font-mono font-bold">
            Live Configuration
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--md-surface-container)] border-b border-[var(--md-outline-variant)] text-[10px] font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                <th className="py-3 px-4">{isEn ? "Rule / Metric" : "నియమం / కొలత"}</th>
                <th className="py-3 px-3">{isEn ? "Category" : "వర్గం"}</th>
                <th className="py-3 px-4">{isEn ? "Interactive Controls" : "విలువ & సర్దుబాటు"}</th>
                <th className="py-3 px-3">{isEn ? "Effective Rate" : "ప్రభావవంతమైన రేటు"}</th>
                <th className="py-3 px-4 text-right">{isEn ? "Integration Scope" : "పరిధి"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--md-outline-variant)]">
              {/* Row 1: INR Recharge */}
              <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                      <Icon icon="lucide:credit-card" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                        {isEn ? "1 INR (₹) Recharge Yield" : "1 రూపాయితో క్రెడిట్స్"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        Domestic Indian UPI / NetBanking / Cards
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Recharge
                  </span>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={creditSettings.creditsPerInr}
                      onChange={(e) => handleUpdate("creditsPerInr", Math.max(0.1, parseFloat(e.target.value) || 1))}
                      className="m3-text-field w-32 px-3 py-1.5 text-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-bold text-[var(--md-on-surface-variant)]">Credits</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-black text-[var(--md-primary)]">
                  1 ₹ = {creditSettings.creditsPerInr} Credits
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-[var(--md-primary)]">
                    Razorpay Gateway
                  </span>
                </td>
              </tr>

              {/* Row 2: USD Recharge */}
              <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon icon="lucide:dollar-sign" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                        {isEn ? "1 USD ($) Recharge Yield" : "1 డాలర్‌తో క్రెడిట్స్"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        Global International Credit / Debit Cards
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    Recharge
                  </span>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={creditSettings.creditsPerUsd}
                      onChange={(e) => handleUpdate("creditsPerUsd", Math.max(1, parseFloat(e.target.value) || 85))}
                      className="m3-text-field w-32 px-3 py-1.5 text-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-bold text-[var(--md-on-surface-variant)]">Credits</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-black text-indigo-600 dark:text-indigo-400">
                  1 $ = {creditSettings.creditsPerUsd} Credits
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    Stripe / Global
                  </span>
                </td>
              </tr>

              {/* Row 3: Shoot Cost Low Quality */}
              <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Icon icon="lucide:zap" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                        {isEn ? "Cost Per AI Photo (Low Quality)" : "ఒక్కో చిత్రానికి ఖర్చు (Low)"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        Fast generation preview (gptimage_2 standard)
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    Shoot Deduction
                  </span>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={creditSettings.costPerImageGenLow}
                      onChange={(e) => handleUpdate("costPerImageGenLow", Math.max(0.1, parseFloat(e.target.value) || 1))}
                      className="m3-text-field w-32 px-3 py-1.5 text-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-bold text-[var(--md-on-surface-variant)]">Credits</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-black text-amber-600 dark:text-amber-400">
                  {creditSettings.costPerImageGenLow} Credits / Photo
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-[var(--md-outline)]">
                    Per Render
                  </span>
                </td>
              </tr>

              {/* Row 4: Shoot Cost Medium & High Quality */}
              <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Icon icon="lucide:sparkles" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                        {isEn ? "Medium & High Quality HD Deductions" : "మీడియం & హై క్వాలిటీ ఛార్జీలు"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        Tiered high-fidelity commercial resolution
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-purple-500/10 text-purple-700 dark:text-purple-300">
                    Quality Tiers
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] opacity-70">Med:</span>
                    <strong className="font-mono">{creditSettings.costPerImageGenMed || 4} Cr</strong>
                    <span className="opacity-40">|</span>
                    <span className="text-[10px] opacity-70">HD:</span>
                    <strong className="font-mono">{creditSettings.costPerImageGenHigh || 8} Cr</strong>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-[var(--md-on-surface)]">
                  {creditSettings.costPerImageGenMed || 4} (Med) / {creditSettings.costPerImageGenHigh || 8} (HD)
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-[var(--md-outline)]">
                    HD Pipelines
                  </span>
                </td>
              </tr>

              {/* Row 5: Profit Margin & Strategy */}
              <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Icon icon="lucide:trending-up" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                        {isEn ? "Studio Profit Margin & Strategy" : "లాభాల వ్యూహం & మార్జిన్"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        {creditSettings.pricingMode === "cost_plus_margin" ? "Cost plus dynamic margin" : "Flat studio rate"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    Margin Strategy
                  </span>
                </td>
                <td className="py-3 px-4 max-w-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex p-0.5 rounded-full bg-[var(--md-surface-container-high)] text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => handleUpdate("pricingMode", "flat_credits")}
                          className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                            creditSettings.pricingMode === "flat_credits"
                              ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          Flat
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate("pricingMode", "cost_plus_margin")}
                          className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                            creditSettings.pricingMode === "cost_plus_margin"
                              ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          Cost + %
                        </button>
                      </div>
                      <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                        +{creditSettings.profitMarginPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={creditSettings.profitMarginPercent}
                      onChange={(e) => handleUpdate("profitMarginPercent", parseInt(e.target.value) || 0)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-black text-emerald-600 dark:text-emerald-400">
                  +{creditSettings.profitMarginPercent}% Markup
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Pricing Engine
                  </span>
                </td>
              </tr>

              {/* Row 6: USD to INR Exchange Rate */}
              <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                      <Icon icon="lucide:refresh-ccw" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                        {isEn ? "USD to INR Exchange Rate" : "డాలర్-రూపాయి మార్పిడి రేటు"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        Real-time forex rate for multi-currency conversion
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-[var(--md-surface-container-high)] text-[var(--md-on-surface-variant)]">
                    Forex Currency
                  </span>
                </td>
                <td className="py-3 px-4 max-w-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={usdToInrRate}
                      onChange={(e) => setUsdToInrRate(parseFloat(e.target.value) || 85)}
                      className="m3-text-field w-24 px-3 py-1.5 text-xs font-mono font-bold"
                    />
                    <div className="flex gap-1">
                      {[94, 95, 96].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setUsdToInrRate(rate)}
                          className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-[var(--md-surface-container)] hover:bg-[var(--md-surface-variant)] cursor-pointer"
                        >
                          ₹{rate}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleFetchLiveRate}
                      disabled={isFetchingRate}
                      className="m3-btn-outlined px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Icon icon="lucide:refresh-cw" className={`w-3 h-3 ${isFetchingRate ? "animate-spin" : ""}`} />
                      <span>{isFetchingRate ? "..." : "Live"}</span>
                    </button>
                  </div>
                  {rateFetchStatus && (
                    <div className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">
                      {rateFetchStatus}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 font-mono font-black text-[var(--md-primary)]">
                  ₹{usdToInrRate} / USD
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-[var(--md-primary)]">
                    Live FX API
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Volume Simulator Table */}
      <div className="m3-card overflow-hidden">
        <div className="p-4 border-b border-[var(--md-outline-variant)] bg-[var(--md-surface-container)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
              <Icon icon="lucide:calculator" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                {isEn ? "Volume Production Simulator Table" : "ఉత్పత్తి పరిమాణాల క్యాలిక్యులేటర్"}
              </h3>
              <p className="text-[10px] text-[var(--md-on-surface-variant)]">
                {isEn ? "Dynamic simulation breakdown for customer volume packages." : "కస్టమర్ ప్యాకేజీల కోసం డైనమిక్ లెక్కల విశ్లేషణ."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--md-on-surface)]">Simulate Volume:</span>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={imageCount}
              onChange={(e) => setImageCount(parseInt(e.target.value) || 50)}
              className="w-32 accent-[var(--md-primary)] cursor-pointer"
            />
            <span className="m3-badge px-3 py-1 font-mono font-black text-xs">
              {imageCount} Images
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--md-surface-container)] border-b border-[var(--md-outline-variant)] text-[10px] font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                <th className="py-3 px-4">{isEn ? "Production Package Tier" : "ప్యాకేజీ స్థాయి"}</th>
                <th className="py-3 px-3">{isEn ? "Image Count" : "చిత్రాలు"}</th>
                <th className="py-3 px-3">{isEn ? "Base Deduction Cost" : "బేస్ క్రెడిట్స్"}</th>
                <th className="py-3 px-3">{isEn ? "Applied Margin" : "వర్తించే మార్జిన్"}</th>
                <th className="py-3 px-3">{isEn ? "Total Credit Value" : "మొత్తం క్రెడిట్స్"}</th>
                <th className="py-3 px-4 text-right">{isEn ? "Currency Value (INR)" : "మొత్తం ఖర్చు (రూపాయలు)"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--md-outline-variant)]">
              {/* Active Simulated Package */}
              <tr className="bg-[var(--md-primary-container)]/15 font-bold">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[var(--md-primary)]" />
                    <span className="font-extrabold text-[var(--md-on-surface)]">
                      {isEn ? "Custom Simulated Volume" : "కస్టమ్ ఎంపిక పరిమాణం"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-black text-[var(--md-on-surface)]">
                  {imageCount} Photos
                </td>
                <td className="py-3 px-3 font-mono text-[var(--md-on-surface-variant)]">
                  {(imageCount * creditSettings.costPerImageGenLow).toFixed(1)} Credits
                </td>
                <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                  +{creditSettings.profitMarginPercent}%
                </td>
                <td className="py-3 px-3 font-mono font-black text-sm text-[var(--md-primary)]">
                  {totalCalculatedCredits.toFixed(1)} Credits
                </td>
                <td className="py-3 px-4 text-right font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                  ₹{(totalCalculatedCredits / creditSettings.creditsPerInr).toFixed(2)}
                </td>
              </tr>

              {/* Preset Volume Benchmarks */}
              {[25, 50, 100, 250, 500].map((presetCount) => {
                const baseCost = presetCount * creditSettings.costPerImageGenLow;
                const withMargin = creditSettings.pricingMode === "cost_plus_margin"
                  ? baseCost * (1 + creditSettings.profitMarginPercent / 100)
                  : baseCost;
                const inrVal = withMargin / creditSettings.creditsPerInr;

                return (
                  <tr key={presetCount} className="hover:bg-[var(--md-surface-variant)] transition-colors">
                    <td className="py-2.5 px-4 text-[var(--md-on-surface-variant)]">
                      Benchmark: {presetCount} Photo Shoot
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--md-on-surface)]">
                      {presetCount} Photos
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--md-on-surface-variant)]">
                      {baseCost.toFixed(1)} Credits
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                      +{creditSettings.profitMarginPercent}%
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--md-primary)]">
                      {withMargin.toFixed(1)} Credits
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{inrVal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
