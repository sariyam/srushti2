import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminSettingsApi,
  updateAdminSettingByKeyApi,
  SystemSettingRecord,
} from "../../utils/api";
import { IMAGE_MODELS, formatPrice } from "../../data";

interface AiGatewaysTabProps {
  lang: "en" | "te";
}

export const AiGatewaysTab: React.FC<AiGatewaysTabProps> = ({ lang }) => {
  const [settings, setSettings] = useState<SystemSettingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gateway form state
  const [gatewayConfig, setGatewayConfig] = useState({
    defaultProvider: "openai",
    defaultModel: "gpt-image-2.5-sunburst",
    defaultQuality: "low",
    fallbackModel: "gptimage_2",
    timeoutSeconds: 60,
    maxRetryAttempts: 3,
  });

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminSettingsApi();
      setSettings(data);
      const gw = data.find((s) => s.key === "ai_gateway")?.value;
      if (gw) {
        setGatewayConfig({
          defaultProvider: gw.defaultProvider || "openai",
          defaultModel: gw.defaultModel || "gpt-image-2.5-sunburst",
          defaultQuality: gw.defaultQuality || "low",
          fallbackModel: gw.fallbackModel || "gptimage_2",
          timeoutSeconds: gw.timeoutSeconds || 60,
          maxRetryAttempts: gw.maxRetryAttempts || 3,
        });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load AI gateway configuration");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      await updateAdminSettingByKeyApi(
        "ai_gateway",
        gatewayConfig,
        "Production AI model gateway routes, fallback strategies, and default parameters"
      );
      setToastMsg(isEn ? "AI Gateway settings saved successfully" : "ఏఐ గేట్‌వే సెట్టింగ్‌లు సేవ్ చేయబడ్డాయి");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save AI gateway settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:cpu" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "AI Gateway & Model Orchestration" : "ఏఐ గేట్‌వే & మోడల్స్"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Manage server-side image generation engines, fallback triggers, and quality presets."
              : "సర్వర్-సైడ్ ఫోటో జనరేషన్ ఇంజిన్లు, ఫాల్‌బ్యాక్ మోడల్స్ మరియు క్వాలిటీ ప్రీసెట్లను కాన్ఫిగర్ చేయండి."}
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
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
          <span>{isEn ? "Loading gateway configuration..." : "కాన్ఫిగరేషన్ లోడ్ అవుతోంది..."}</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Main Gateway Card */}
          <div className="m3-card p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-[var(--md-outline-variant)] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                <Icon icon="lucide:sparkles" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[var(--md-on-surface)]">
                  {isEn ? "Active Production Model Configuration" : "ప్రొడక్షన్ మోడల్ కాన్ఫిగరేషన్"}
                </h3>
                <p className="text-[11px] text-[var(--md-on-surface-variant)]">
                  {isEn
                    ? "OpenAI API keys are isolated securely on the backend server. Configure routing parameters here."
                    : "ఓపెన్ AI కీలు సర్వర్‌లో భద్రంగా ఉంటాయి. రౌటింగ్ వివరాలను ఇక్కడ మార్చండి."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Default Provider */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Primary Provider" : "ప్రధాన ప్రొవైడర్"}
                </label>
                <select
                  value={gatewayConfig.defaultProvider}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, defaultProvider: e.target.value })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                >
                  <option value="openai">OpenAI (GPTImage-2 / Sunburst)</option>
                  <option value="google">Google Gemini (Imagen 3)</option>
                </select>
              </div>

              {/* Default Model */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Default AI Model" : "డిఫాల్ట్ ఏఐ మోడల్"}
                </label>
                <select
                  value={gatewayConfig.defaultModel}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, defaultModel: e.target.value })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
                >
                  <option value="gpt-image-2.5-sunburst">gpt-image-2.5-sunburst (Recommended)</option>
                  <option value="gptimage_2">gptimage_2 (Classic)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                </select>
              </div>

              {/* Default Quality Payload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Quality Level" : "నాణ్యత స్థాయి"}
                </label>
                <select
                  value={gatewayConfig.defaultQuality}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, defaultQuality: e.target.value })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  <option value="low">low (Fast & Cost-Efficient - Recommended)</option>
                  <option value="medium">medium (Standard Studio)</option>
                  <option value="high">high (Maximum Detail HD)</option>
                </select>
              </div>

              {/* Fallback Model */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Automatic Fallback Model" : "ఆటోమేటిక్ ఫాల్‌బ్యాక్ మోడల్"}
                </label>
                <select
                  value={gatewayConfig.fallbackModel}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, fallbackModel: e.target.value })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
                >
                  <option value="gptimage_2">gptimage_2</option>
                  <option value="gpt-image-2.5-sunburst">gpt-image-2.5-sunburst</option>
                </select>
              </div>

              {/* Timeout Seconds */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Request Timeout (Seconds)" : "రిక్వెస్ట్ గడువు (సెకన్లు)"}
                </label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={gatewayConfig.timeoutSeconds}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, timeoutSeconds: parseInt(e.target.value) || 60 })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              {/* Max Retries */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Max Retry Attempts" : "గరిష్ట రీట్రైలు"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={gatewayConfig.maxRetryAttempts}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, maxRetryAttempts: parseInt(e.target.value) || 3 })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Model Matrix Table from Codebase */}
          <div className="m3-card p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--md-outline)] flex items-center gap-1.5">
              <Icon icon="lucide:table" className="w-4 h-4 text-[var(--md-primary)]" />
              <span>{isEn ? "Supported Production AI Models" : "మద్దతు గల మోడల్స్"}</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-[var(--md-outline-variant)]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--md-surface-container)] border-b border-[var(--md-outline-variant)] text-[10px] font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Base Cost (USD)</th>
                    <th className="py-2.5 px-3">Focus Capability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--md-outline-variant)]">
                  {IMAGE_MODELS.map((m) => (
                    <tr key={m.id} className="hover:bg-[var(--md-surface-variant)] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[var(--md-on-surface)]">
                        {m.name}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="m3-badge text-[9px] uppercase px-2 py-0.5">
                          {m.provider}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[var(--md-primary)]">
                        ${m.price.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-[var(--md-on-surface-variant)]">
                        {m.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  <span>{isEn ? "Saving Gateway..." : "సేవ్ చేస్తోంది..."}</span>
                </>
              ) : (
                <>
                  <Icon icon="lucide:save" className="w-4 h-4" />
                  <span>{isEn ? "Save Gateway Settings" : "గేట్‌వేని సేవ్ చేయండి"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
