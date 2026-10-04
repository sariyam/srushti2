import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminPresetsApi,
  createAdminPresetApi,
  updateAdminPresetApi,
  deleteAdminPresetApi,
  toggleAdminPresetStatusApi,
  StudioPresetRecord,
} from "../../utils/api";

interface PresentationModesTabProps {
  lang: "en" | "te";
}

export const PresentationModesTab: React.FC<PresentationModesTabProps> = ({ lang }) => {
  const [modes, setModes] = useState<StudioPresetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMode, setEditingMode] = useState<Partial<StudioPresetRecord> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminPresetsApi({ type: "presentation" });
      setModes(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load presentation modes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (mode: StudioPresetRecord) => {
    try {
      const updated = await toggleAdminPresetStatusApi(mode.id);
      setModes((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showToast(isEn ? "Mode status updated" : "మోడ్ స్థితి నవీకరించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete '${id}'?` : `'${id}' ని తొలగించాలనుకుంటున్నారా?`)) {
      return;
    }
    try {
      await deleteAdminPresetApi(id);
      setModes((prev) => prev.filter((m) => m.id !== id));
      showToast(isEn ? "Presentation mode deleted" : "ప్రెజెంటేషన్ మోడ్ తొలగించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete presentation mode");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMode?.id || !editingMode?.nameEn || !editingMode?.nameTe) {
      setErrorMsg(isEn ? "Please fill in all required fields" : "దయచేసి అవసరమైన ఫీల్డ్‌లను పూరించండి");
      return;
    }

    try {
      const isNew = !modes.some((m) => m.id === editingMode.id);
      let result: StudioPresetRecord;
      if (isNew) {
        result = await createAdminPresetApi({
          ...editingMode,
          type: "presentation",
        });
        setModes((prev) => [...prev, result]);
        showToast(isEn ? "Presentation mode created" : "కొత్త మోడ్ సృష్టించబడింది");
      } else {
        result = await updateAdminPresetApi(editingMode.id, editingMode);
        setModes((prev) => prev.map((m) => (m.id === result.id ? result : m)));
        showToast(isEn ? "Presentation mode updated" : "మోడ్ నవీకరించబడింది");
      }
      setIsDialogOpen(false);
      setEditingMode(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save presentation mode");
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:layout-grid" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Product Presentation Modes" : "ఉత్పత్తి ప్రెజెంటేషన్ మోడ్‌లు"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Configure how products are showcased: Live Model, Mannequin, Flat Lay, Ghost Mannequin, or Wooden Hanger."
              : "ఉత్పత్తులను ప్రదర్శించే విధానాన్ని ఎంచుకోండి: లైవ్ మోడల్, బొమ్మ, ఫ్లాట్ లే, ఘోస్ట్ లేదా హ్యాంగర్."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="m3-btn-outlined px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:refresh-cw" className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isEn ? "Refresh" : "తాజాకరించు"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingMode({
                id: "",
                type: "presentation",
                workspace: "garment",
                genderTarget: "all",
                nameEn: "",
                nameTe: "",
                promptDirective: "professionally styled on premium display mannequin",
                displayOrder: modes.length + 1,
                isActive: true,
              });
              setIsDialogOpen(true);
            }}
            className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>{isEn ? "Add Mode" : "కొత్త మోడ్"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Modes Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--md-outline)] flex items-center justify-center gap-2">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[var(--md-primary)]" />
          <span>{isEn ? "Loading presentation modes..." : "మోడ్‌లు లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <div key={mode.id} className="m3-card p-4 space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                      <Icon icon="lucide:layers" className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[var(--md-on-surface)] leading-tight">
                        {isEn ? mode.nameEn : mode.nameTe}
                      </h4>
                      <span className="font-mono text-[9px] text-[var(--md-outline)] block">
                        {mode.id}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(mode)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center ${
                      mode.isActive ? "bg-[var(--md-primary)] justify-end" : "bg-neutral-300 dark:bg-neutral-700 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <p className="text-[11px] text-[var(--md-on-surface-variant)] leading-relaxed">
                  {mode.promptDirective}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--md-outline-variant)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[var(--md-primary)]">
                    {mode.workspace}
                  </span>
                  {mode.faceVisibilityRule === "full_face" ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Icon icon="lucide:user" className="w-3 h-3" />
                      {isEn ? "Full Face UI" : "పూర్తి ముఖం UI"}
                    </span>
                  ) : mode.faceVisibilityRule === "partial_face" ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <Icon icon="lucide:scan-face" className="w-3 h-3" />
                      {isEn ? "Partial Face UI" : "పాక్షిక ముఖం UI"}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-neutral-500/10 text-neutral-500 border border-neutral-500/20 flex items-center gap-1">
                      <Icon icon="lucide:user-x" className="w-3 h-3" />
                      {isEn ? "No Face UI" : "ముఖం లేదు"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMode(mode);
                      setIsDialogOpen(true);
                    }}
                    className="m3-btn-tonal p-1.5 rounded-full cursor-pointer"
                    title="Edit Mode"
                  >
                    <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(mode.id)}
                    className="p-1.5 rounded-full text-[var(--md-error)] hover:bg-[var(--md-error-container)] transition-colors cursor-pointer"
                    title="Delete Mode"
                  >
                    <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Dialog */}
      {isDialogOpen && editingMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <h3 className="text-base font-black text-[var(--md-on-surface)]">
                {editingMode.id ? (isEn ? "Edit Presentation Mode" : "మోడ్ సవరణ") : (isEn ? "Add Presentation Mode" : "కొత్త మోడ్")}
              </h3>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[var(--md-surface-variant)] flex items-center justify-center text-[var(--md-outline)] cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Unique Key / ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!modes.find((m) => m.id === editingMode.id)}
                    value={editingMode.id || ""}
                    onChange={(e) => setEditingMode({ ...editingMode, id: e.target.value })}
                    placeholder="mannequin"
                    className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Workspace</label>
                  <select
                    value={editingMode.workspace || "garment"}
                    onChange={(e) => setEditingMode({ ...editingMode, workspace: e.target.value as any })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  >
                    <option value="garment">Garment</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)] flex items-center justify-between">
                  <span>Face Visibility Rule</span>
                  <span className="text-[10px] text-[var(--md-outline)] font-normal">
                    Controls [Select Human Model Face] UI
                  </span>
                </label>
                <select
                  value={editingMode.faceVisibilityRule || (editingMode.id === "model" ? "full_face" : editingMode.id === "partial_face" ? "partial_face" : "no_face")}
                  onChange={(e) => setEditingMode({ ...editingMode, faceVisibilityRule: e.target.value as any })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                >
                  <option value="full_face">Full Face (Shows [Select Human Model Face] UI)</option>
                  <option value="partial_face">Partial Face (Shows [Select Human Model Face] UI)</option>
                  <option value="no_face">No Face / Headless / Mount / Flat Lay (Hides Face Selector)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingMode.nameEn || ""}
                    onChange={(e) => setEditingMode({ ...editingMode, nameEn: e.target.value })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (Telugu)</label>
                  <input
                    type="text"
                    required
                    value={editingMode.nameTe || ""}
                    onChange={(e) => setEditingMode({ ...editingMode, nameTe: e.target.value })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">Prompt Directive</label>
                <textarea
                  rows={3}
                  required
                  value={editingMode.promptDirective || ""}
                  onChange={(e) => setEditingMode({ ...editingMode, promptDirective: e.target.value })}
                  className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--md-outline-variant)]">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="m3-btn-text px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
                >
                  {isEn ? "Cancel" : "రద్దు"}
                </button>
                <button
                  type="submit"
                  className="m3-btn-filled px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer"
                >
                  {isEn ? "Save Mode" : "సేవ్ చేయండి"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
