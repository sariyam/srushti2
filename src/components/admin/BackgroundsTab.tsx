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

interface BackgroundsTabProps {
  lang: "en" | "te";
}

export const BackgroundsTab: React.FC<BackgroundsTabProps> = ({ lang }) => {
  const [backgrounds, setBackgrounds] = useState<StudioPresetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBg, setEditingBg] = useState<Partial<StudioPresetRecord> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminPresetsApi({ type: "background" });
      setBackgrounds(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load studio backgrounds");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (bg: StudioPresetRecord) => {
    try {
      const updated = await toggleAdminPresetStatusApi(bg.id);
      setBackgrounds((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      showToast(isEn ? "Background status updated" : "బ్యాక్‌గ్రౌండ్ స్థితి నవీకరించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete background '${id}'?` : `'${id}' ని తొలగించాలనుకుంటున్నారా?`)) {
      return;
    }
    try {
      await deleteAdminPresetApi(id);
      setBackgrounds((prev) => prev.filter((b) => b.id !== id));
      showToast(isEn ? "Background deleted" : "బ్యాక్‌గ్రౌండ్ తొలగించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete background");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBg?.id || !editingBg?.nameEn || !editingBg?.nameTe) {
      setErrorMsg(isEn ? "Please fill in all required fields" : "దయచేసి అవసరమైన ఫీల్డ్‌లను పూరించండి");
      return;
    }

    try {
      const isNew = !backgrounds.some((b) => b.id === editingBg.id);
      let result: StudioPresetRecord;
      if (isNew) {
        result = await createAdminPresetApi({
          ...editingBg,
          type: "background",
        });
        setBackgrounds((prev) => [...prev, result]);
        showToast(isEn ? "Background created" : "కొత్త బ్యాక్‌గ్రౌండ్ సృష్టించబడింది");
      } else {
        result = await updateAdminPresetApi(editingBg.id, editingBg);
        setBackgrounds((prev) => prev.map((b) => (b.id === result.id ? result : b)));
        showToast(isEn ? "Background updated" : "బ్యాక్‌గ్రౌండ్ నవీకరించబడింది");
      }
      setIsDialogOpen(false);
      setEditingBg(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save background");
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
            <Icon icon="lucide:image" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Studio Backgrounds & Lighting Environments" : "బ్యాక్‌గ్రౌండ్లు & లైటింగ్ పరిసరాలు"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Configure indoor and outdoor atmospheres, ambient lighting moods, and scenic architectural environments."
              : "ఇండోర్ మరియు అవుట్‌డోర్ వాతావరణాలు, కాంతి మరియు ఆర్కిటెక్చరల్ పరిసరాలను నిర్వహించండి."}
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
              setEditingBg({
                id: "",
                type: "background",
                workspace: "all",
                genderTarget: "all",
                nameEn: "",
                nameTe: "",
                promptDirective: "luxurious interior palace hall with warm ambient chandeliers and marble archways",
                displayOrder: backgrounds.length + 1,
                isActive: true,
              });
              setIsDialogOpen(true);
            }}
            className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>{isEn ? "Add Background" : "కొత్త బ్యాక్‌గ్రౌండ్"}</span>
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

      {/* Backgrounds Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--md-outline)] flex items-center justify-center gap-2">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[var(--md-primary)]" />
          <span>{isEn ? "Loading backgrounds..." : "బ్యాక్‌గ్రౌండ్లు లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backgrounds.map((bg) => (
            <div key={bg.id} className="m3-card p-4 space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Icon icon="lucide:image" className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[var(--md-on-surface)] leading-tight">
                        {isEn ? bg.nameEn : bg.nameTe}
                      </h4>
                      <span className="font-mono text-[9px] text-[var(--md-outline)] block">
                        {bg.id}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(bg)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center ${
                      bg.isActive ? "bg-[var(--md-primary)] justify-end" : "bg-neutral-300 dark:bg-neutral-700 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <p className="text-[11px] text-[var(--md-on-surface-variant)] leading-relaxed">
                  {bg.promptDirective}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--md-outline-variant)] flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[var(--md-primary)]">
                  {bg.workspace}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBg(bg);
                      setIsDialogOpen(true);
                    }}
                    className="m3-btn-tonal p-1.5 rounded-full cursor-pointer"
                    title="Edit Background"
                  >
                    <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(bg.id)}
                    className="p-1.5 rounded-full text-[var(--md-error)] hover:bg-[var(--md-error-container)] transition-colors cursor-pointer"
                    title="Delete Background"
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
      {isDialogOpen && editingBg && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <h3 className="text-base font-black text-[var(--md-on-surface)]">
                {editingBg.id ? (isEn ? "Edit Background" : "బ్యాక్‌గ్రౌండ్ సవరణ") : (isEn ? "Add Background" : "కొత్త బ్యాక్‌గ్రౌండ్")}
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
                    disabled={!!backgrounds.find((b) => b.id === editingBg.id)}
                    value={editingBg.id || ""}
                    onChange={(e) => setEditingBg({ ...editingBg, id: e.target.value })}
                    placeholder="palace_hall"
                    className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Workspace</label>
                  <select
                    value={editingBg.workspace || "all"}
                    onChange={(e) => setEditingBg({ ...editingBg, workspace: e.target.value as any })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  >
                    <option value="all">All</option>
                    <option value="garment">Garment</option>
                    <option value="jewelry">Jewelry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingBg.nameEn || ""}
                    onChange={(e) => setEditingBg({ ...editingBg, nameEn: e.target.value })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (Telugu)</label>
                  <input
                    type="text"
                    required
                    value={editingBg.nameTe || ""}
                    onChange={(e) => setEditingBg({ ...editingBg, nameTe: e.target.value })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">Background Lighting Directive</label>
                <textarea
                  rows={3}
                  required
                  value={editingBg.promptDirective || ""}
                  onChange={(e) => setEditingBg({ ...editingBg, promptDirective: e.target.value })}
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
                  {isEn ? "Save Background" : "సేవ్ చేయండి"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
