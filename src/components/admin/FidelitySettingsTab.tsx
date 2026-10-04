import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminSettingsApi,
  updateAdminSettingByKeyApi,
  SystemSettingRecord,
} from "../../utils/api";

interface FidelitySettingsTabProps {
  lang: "en" | "te";
}

export const FidelitySettingsTab: React.FC<FidelitySettingsTabProps> = ({ lang }) => {
  const [settings, setSettings] = useState<SystemSettingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editable settings local state
  const [jewelryFidelity, setJewelryFidelity] = useState("");
  const [garmentFidelity, setGarmentFidelity] = useState("");
  const [negativeExclusions, setNegativeExclusions] = useState("");

  const isEn = lang === "en";

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminSettingsApi();
      setSettings(data);

      const fid = data.find((s) => s.key === "fidelity_directives")?.value || {};
      setJewelryFidelity(fid.jewelry || "");
      setGarmentFidelity(fid.garment || "");

      const neg = data.find((s) => s.key === "negative_exclusions")?.value || {};
      setNegativeExclusions(
        Array.isArray(neg.default) ? neg.default.join(", ") : typeof neg.default === "string" ? neg.default : ""
      );
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load system settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      // 1. Save Fidelity Directives
      await updateAdminSettingByKeyApi(
        "fidelity_directives",
        {
          jewelry: jewelryFidelity.trim(),
          garment: garmentFidelity.trim(),
        },
        "Commercial photo fidelity enhancements for diamonds, gold luster, and garment drape textures"
      );

      // 2. Save Negative Exclusions
      const splitNegatives = negativeExclusions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateAdminSettingByKeyApi(
        "negative_exclusions",
        {
          default: splitNegatives,
        },
        "Default negative prompt exclusions applied to all AI photo generation requests"
      );

      setToastMsg(isEn ? "System fidelity settings saved successfully" : "సిస్టమ్ ఫిడిలిటీ నియమాలు సేవ్ చేయబడ్డాయి");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:sparkles" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "System Directives & Photo Fidelity" : "సిస్టమ్ ప్రాంప్ట్ & ఫిడిలిటీ నియమాలు"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Configure master prompt injection directives for realistic jewelry brilliance, fabric drape, and exclusions."
              : "నగల ప్రకాశం, వస్త్రాల ఆకృతి మరియు అవాంఛిత అంశాల తొలగింపు కోసం మాస్టర్ ప్రాంప్ట్ నియమాలను కాన్ఫిగర్ చేయండి."}
          </p>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={isLoading}
          className="m3-btn-outlined px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Icon icon="lucide:refresh-cw" className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isEn ? "Refresh" : "తాజాకరించు"}</span>
        </button>
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

      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--md-outline)] flex items-center justify-center gap-2">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[var(--md-primary)]" />
          <span>{isEn ? "Loading directives..." : "నియమాలు లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-5">
          {/* Card 1: Jewelry Fidelity Directives */}
          <div className="m3-card p-5 space-y-3">
            <div className="flex items-center gap-3 border-b border-[var(--md-outline-variant)] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Icon icon="lucide:gem" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Jewelry Fidelity Enhancement Directives" : "నగల ఫిడిలిటీ మెరుగుదల ప్రాంప్ట్"}
                </h3>
                <p className="text-[11px] text-[var(--md-on-surface-variant)]">
                  {isEn
                    ? "Injected automatically into jewelry generation requests to enforce gem facets, hallmark clarity, and reflections."
                    : "రత్నాల మెరుపు, హాల్‌మార్క్ స్పష్టత మరియు ప్రతిబింబాలను ఖచ్చితంగా తీసుకురావడానికి ఇది జతచేయబడుతుంది."}
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={jewelryFidelity}
              onChange={(e) => setJewelryFidelity(e.target.value)}
              className="m3-text-field w-full p-3 text-xs font-mono leading-relaxed"
              placeholder="e.g. ultra-crisp gemstone facets, 22K yellow gold hallmark shine, professional studio lighting..."
            />
          </div>

          {/* Card 2: Garment Fidelity Directives */}
          <div className="m3-card p-5 space-y-3">
            <div className="flex items-center gap-3 border-b border-[var(--md-outline-variant)] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Icon icon="lucide:shirt" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Garment Texture & Drape Directives" : "వస్త్రాల అల్లిక & డ్రేప్ ప్రాంప్ట్"}
                </h3>
                <p className="text-[11px] text-[var(--md-on-surface-variant)]">
                  {isEn
                    ? "Injected into clothing shoots to reproduce fabric weave, embroidery zari threads, and natural gravitational drape."
                    : "వస్త్రాల నేత, జరీ దారాల వివరాలు మరియు సహజమైన మడతలను చూపించడానికి ఈ నియమం ఉపయోగపడుతుంది."}
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={garmentFidelity}
              onChange={(e) => setGarmentFidelity(e.target.value)}
              className="m3-text-field w-full p-3 text-xs font-mono leading-relaxed"
              placeholder="e.g. realistic fabric weave microstructure, authentic gravitational drape folds, accurate zari sheen..."
            />
          </div>

          {/* Card 3: Negative Exclusions */}
          <div className="m3-card p-5 space-y-3">
            <div className="flex items-center gap-3 border-b border-[var(--md-outline-variant)] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Icon icon="lucide:shield-ban" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Negative Exclusions (Comma Separated)" : "నెగటివ్ ప్రాంప్ట్ నిషేధాలు"}
                </h3>
                <p className="text-[11px] text-[var(--md-on-surface-variant)]">
                  {isEn
                    ? "Elements strictly excluded across all generations (e.g. plastic skin, extra fingers, cartoon style)."
                    : "చిత్రాలలో రాకూడని అంశాలు (ఉదాహరణకు: ప్లాస్టిక్ చర్మం, అదనపు వేళ్లు, కార్టూన్ లుక్)."}
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={negativeExclusions}
              onChange={(e) => setNegativeExclusions(e.target.value)}
              className="m3-text-field w-full p-3 text-xs font-mono leading-relaxed"
              placeholder="e.g. deformed anatomy, blurry, cartoon, 3d render, extra limbs, watermark, bad lighting..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="m3-btn-filled px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Saving Settings..." : "సేవ్ చేస్తోంది..."}</span>
                </>
              ) : (
                <>
                  <Icon icon="lucide:save" className="w-4 h-4" />
                  <span>{isEn ? "Save System Directives" : "నియమాలను సేవ్ చేయండి"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
