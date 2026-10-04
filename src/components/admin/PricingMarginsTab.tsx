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

      {/* Grid of Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Razorpay Recharge Conversion */}
        <div className="m3-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                <Icon icon="lucide:credit-card" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Recharge Conversion Rates" : "రీఛార్జ్ మార్పిడి రేట్లు"}
                </h3>
                <span className="text-[10px] text-[var(--md-primary)] font-bold">Razorpay Integration</span>
              </div>
            </div>
            <span className="m3-badge text-[9px] px-2 py-0.5 uppercase">Live</span>
          </div>

          <div className="space-y-3">
            {/* 1 INR to Credits */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[var(--md-on-surface)]">
                <span>{isEn ? "1 INR (₹) grants:" : "1 రూపాయితో క్రెడిట్స్:"}</span>
                <span className="font-mono text-[var(--md-primary)] font-extrabold">
                  {creditSettings.creditsPerInr} Credits
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={creditSettings.creditsPerInr}
                onChange={(e) => handleUpdate("creditsPerInr", Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
              />
            </div>

            {/* 1 USD to Credits */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[var(--md-on-surface)]">
                <span>{isEn ? "1 USD ($) grants:" : "1 డాలర్‌తో క్రెడిట్స్:"}</span>
                <span className="font-mono text-[var(--md-primary)] font-extrabold">
                  {creditSettings.creditsPerUsd} Credits
                </span>
              </div>
              <input
                type="number"
                step="1"
                min="1"
                value={creditSettings.creditsPerUsd}
                onChange={(e) => handleUpdate("creditsPerUsd", Math.max(1, parseFloat(e.target.value) || 85))}
                className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Shoot Deduction Costs */}
        <div className="m3-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Icon icon="lucide:zap" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Shoot Deduction Rate" : "షూట్ క్రెడిట్ ఛార్జీ"}
                </h3>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Per Image Generated</span>
              </div>
            </div>
            <span className="m3-badge text-[9px] px-2 py-0.5 uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Default Payload
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[var(--md-on-surface)]">
                <span>{isEn ? "Cost Per AI Photo (Low Quality):" : "ఒక్కో చిత్రానికి ఖర్చు (Low):"}</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-black">
                  {creditSettings.costPerImageGenLow} Credits
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={creditSettings.costPerImageGenLow}
                onChange={(e) => handleUpdate("costPerImageGenLow", Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-xl bg-[var(--md-surface-container)]">
                <span className="opacity-70 block text-[9.5px]">Medium Quality</span>
                <strong className="font-mono text-xs">{creditSettings.costPerImageGenMed || 4} Credits</strong>
              </div>
              <div className="p-2 rounded-xl bg-[var(--md-surface-container)]">
                <span className="opacity-70 block text-[9.5px]">High Quality HD</span>
                <strong className="font-mono text-xs">{creditSettings.costPerImageGenHigh || 8} Credits</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Profit Margin & Strategy */}
        <div className="m3-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Icon icon="lucide:trending-up" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Profit Margin & Strategy" : "లాభాల వ్యూహం & మార్జిన్"}
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {creditSettings.pricingMode === "cost_plus_margin" ? `+${creditSettings.profitMarginPercent}% Markup` : "Flat Rate"}
                </span>
              </div>
            </div>

            {/* Mode Switch Buttons */}
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
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>{isEn ? "Studio Profit Margin:" : "స్టూడియో మార్జిన్:"}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
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
            <div className="flex justify-between text-[9px] opacity-60 font-mono">
              <span>0% (At Cost)</span>
              <span>25%</span>
              <span>50%</span>
              <span>100%+</span>
            </div>
          </div>
        </div>

        {/* Card 4: Currency Exchange & Live USD Rate */}
        <div className="m3-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                <Icon icon="lucide:refresh-ccw" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Currency & Live Conversion" : "కరెన్సీ & రేటు"}
                </h3>
                <span className="text-[10px] text-[var(--md-primary)] font-bold">₹{usdToInrRate} / USD</span>
              </div>
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

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--md-on-surface)] block">
                {isEn ? "USD to INR Exchange Rate:" : "డాలర్-రూపాయి మార్పిడి రేటు:"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={usdToInrRate}
                  onChange={(e) => setUsdToInrRate(parseFloat(e.target.value) || 85)}
                  className="m3-text-field flex-1 px-3 py-2 text-xs font-mono font-bold"
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
              </div>
            </div>

            {rateFetchStatus && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {rateFetchStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Production Volume Calculator Simulator */}
      <div className="m3-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
              <Icon icon="lucide:calculator" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--md-on-surface)]">
                {isEn ? "Volume Production Simulator" : "ఉత్పత్తి పరిమాణాల క్యాలిక్యులేటర్"}
              </h3>
              <p className="text-[11px] text-[var(--md-on-surface-variant)]">
                {isEn ? "Simulate customer shoot volumes and dynamic revenue generation." : "వినియోగదారుల షూట్ పరిమాణాలు మరియు రాబడిని లెక్కించండి."}
              </p>
            </div>
          </div>
          <span className="m3-badge px-3 py-1 font-mono font-black text-xs">
            {imageCount} Images
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Simulate Monthly Production Volume:</span>
            <span className="font-mono text-[var(--md-primary)] font-black text-sm">
              {imageCount} Images
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={imageCount}
            onChange={(e) => setImageCount(parseInt(e.target.value) || 50)}
            className="w-full accent-[var(--md-primary)] cursor-pointer"
          />

          <div className="p-4 rounded-2xl bg-[var(--md-surface-container-high)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-70 block">
                Total Credit Value
              </span>
              <span className="text-lg font-black font-mono text-[var(--md-primary)]">
                {totalCalculatedCredits.toFixed(1)} Credits
              </span>
            </div>
            <div className="text-right sm:border-l border-[var(--md-outline-variant)] sm:pl-4">
              <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-70 block">
                Currency Equivalent (INR)
              </span>
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                ₹{(totalCalculatedCredits / creditSettings.creditsPerInr).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
