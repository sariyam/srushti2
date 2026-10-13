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
        <form onSubmit={handleSaveAll} className="space-y-4">
          <div className="m3-card overflow-hidden">
            <div className="p-4 border-b border-[var(--md-outline-variant)] bg-[var(--md-surface-container)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                  <Icon icon="lucide:sparkles" className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                    {isEn ? "Master System Directives Matrix" : "మాస్టర్ సిస్టమ్ డైరెక్టివ్స్ పట్టిక"}
                  </h3>
                  <p className="text-[10px] text-[var(--md-on-surface-variant)]">
                    {isEn
                      ? "Fine-tune realistic rendering prompts injected across jewelry shoots, garment textures, and negative exclusions."
                      : "నగల ప్రకాశం, వస్త్రాల నేత మరియు అవాంఛిత అంశాల తొలగింపు ప్రాంప్ట్ నియమాలు."}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Icon icon="lucide:loader-2" className="w-3.5 h-3.5 animate-spin" />
                    <span>{isEn ? "Saving..." : "సేవ్ చేస్తోంది..."}</span>
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:save" className="w-3.5 h-3.5" />
                    <span>{isEn ? "Save Directives" : "సేవ్ చేయండి"}</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--md-surface-container)] border-b border-[var(--md-outline-variant)] text-[10px] font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                    <th className="py-3 px-4 w-72">{isEn ? "Directive Parameter" : "డైరెక్టివ్ పరామితి"}</th>
                    <th className="py-3 px-3 w-36">{isEn ? "Domain Scope" : "పరిధి"}</th>
                    <th className="py-3 px-4">{isEn ? "Prompt Directives & Exclusions" : "ప్రాంప్ట్ సూచనలు"}</th>
                    <th className="py-3 px-3 text-right w-28">{isEn ? "Status" : "స్థితి"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--md-outline-variant)]">
                  {/* Row 1: Jewelry */}
                  <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon icon="lucide:gem" className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                            {isEn ? "Jewelry Fidelity Enhancement" : "నగల ఫిడిలిటీ మెరుగుదల"}
                          </div>
                          <p className="text-[10px] text-[var(--md-on-surface-variant)] mt-0.5 leading-relaxed">
                            {isEn
                              ? "Injected automatically into jewelry generation requests to enforce gem facets, hallmark clarity, and reflections."
                              : "రత్నాల మెరుపు, హాల్‌మార్క్ స్పష్టత మరియు ప్రతిబింబాలను ఖచ్చితంగా తీసుకురావడానికి జతచేయబడుతుంది."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 align-top">
                      <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        Jewelry
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <textarea
                        rows={3}
                        value={jewelryFidelity}
                        onChange={(e) => setJewelryFidelity(e.target.value)}
                        className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                        placeholder="e.g. ultra-crisp gemstone facets, 22K yellow gold hallmark shine, professional studio lighting..."
                      />
                    </td>
                    <td className="py-4 px-3 align-top text-right">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: Garment */}
                  <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon icon="lucide:shirt" className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                            {isEn ? "Garment Texture & Drape" : "వస్త్రాల అల్లిక & డ్రేప్"}
                          </div>
                          <p className="text-[10px] text-[var(--md-on-surface-variant)] mt-0.5 leading-relaxed">
                            {isEn
                              ? "Injected into clothing shoots to reproduce fabric weave, embroidery zari threads, and natural gravitational drape."
                              : "వస్త్రాల నేత, జరీ దారాల వివరాలు మరియు సహజమైన మడతలను చూపించడానికి ఈ నియమం ఉపయోగపడుతుంది."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 align-top">
                      <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        Garments
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <textarea
                        rows={3}
                        value={garmentFidelity}
                        onChange={(e) => setGarmentFidelity(e.target.value)}
                        className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                        placeholder="e.g. realistic fabric weave microstructure, authentic gravitational drape folds, accurate zari sheen..."
                      />
                    </td>
                    <td className="py-4 px-3 align-top text-right">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Row 3: Negative Exclusions */}
                  <tr className="hover:bg-[var(--md-surface-variant)] transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon icon="lucide:shield-ban" className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                            {isEn ? "Negative Exclusions" : "నెగటివ్ ప్రాంప్ట్ నిషేధాలు"}
                          </div>
                          <p className="text-[10px] text-[var(--md-on-surface-variant)] mt-0.5 leading-relaxed">
                            {isEn
                              ? "Elements strictly excluded across all generations (comma-separated list)."
                              : "చిత్రాలలో రాకూడని అంశాలు (కామాలతో విభజించిన జాబితా)."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 align-top">
                      <span className="m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold bg-rose-500/10 text-rose-700 dark:text-rose-300">
                        Global Filter
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <textarea
                        rows={3}
                        value={negativeExclusions}
                        onChange={(e) => setNegativeExclusions(e.target.value)}
                        className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                        placeholder="e.g. deformed anatomy, blurry, cartoon, 3d render, extra limbs, watermark, bad lighting..."
                      />
                    </td>
                    <td className="py-4 px-3 align-top text-right">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                        Enforced
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
