import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminBusinessesApi,
  createAdminBusinessApi,
  updateAdminBusinessApi,
  deleteAdminBusinessApi,
  BusinessCategoryRecord,
} from "../../utils/api";

interface BusinessVerticalsTabProps {
  lang: "en" | "te";
}

export const BusinessVerticalsTab: React.FC<BusinessVerticalsTabProps> = ({ lang }) => {
  const [categories, setCategories] = useState<BusinessCategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<BusinessCategoryRecord> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminBusinessesApi();
      setCategories(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load business categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (category: BusinessCategoryRecord) => {
    try {
      const updated = await updateAdminBusinessApi(category.id, {
        isActive: !category.isActive,
      });
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast(isEn ? "Category status updated" : "కేటగిరీ స్థితి నవీకరించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to toggle status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.id || !editingCategory?.nameEn || !editingCategory?.nameTe) {
      setErrorMsg(isEn ? "Please fill in all required fields" : "దయచేసి అవసరమైన ఫీల్డ్‌లను పూరించండి");
      return;
    }

    try {
      const isNew = !categories.some((c) => c.id === editingCategory.id);
      let result: BusinessCategoryRecord;
      if (isNew) {
        result = await createAdminBusinessApi(editingCategory);
        setCategories((prev) => [...prev, result]);
        showToast(isEn ? "Business category created" : "కొత్త కేటగిరీ సృష్టించబడింది");
      } else {
        result = await updateAdminBusinessApi(editingCategory.id, editingCategory);
        setCategories((prev) => prev.map((c) => (c.id === result.id ? result : c)));
        showToast(isEn ? "Business category updated" : "కేటగిరీ నవీకరించబడింది");
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete '${id}'?` : `'${id}' ని తొలగించాలనుకుంటున్నారా?`)) {
      return;
    }
    try {
      await deleteAdminBusinessApi(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast(isEn ? "Category deleted" : "కేటగిరీ తొలగించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete category");
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:briefcase" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Business Verticals & Collections" : "బిజినెస్ కేటగిరీలు & కలెక్షన్స్"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Manage top-level verticals: Garments (Female / Male) and Jewelry (Female / Male)."
              : "బట్టలు (మహిళలు / పురుషులు) మరియు నగలు (మహిళలు / పురుషులు) కేటగిరీలను నిర్వహించండి."}
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
              setEditingCategory({
                id: "",
                workspace: "garment",
                genderTarget: "female",
                nameEn: "",
                nameTe: "",
                icon: "shirt",
                displayOrder: categories.length + 1,
                isActive: true,
              });
              setIsDialogOpen(true);
            }}
            className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>{isEn ? "Add Vertical" : "కొత్తది చేర్చండి"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="p-3 rounded-2xl bg-[var(--md-success-container)] text-[var(--md-on-success-container)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Icon icon="lucide:check-circle" className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-[var(--md-error-container)] text-[var(--md-on-error-container)] text-xs font-bold flex items-center gap-2">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="ml-auto text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of Business Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--md-outline)] flex items-center justify-center gap-2">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[var(--md-primary)]" />
          <span>{isEn ? "Loading business verticals..." : "కేటగిరీలు లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="m3-card p-5 space-y-4 relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] flex items-center justify-center shrink-0">
                    <Icon
                      icon={
                        cat.icon
                          ? cat.icon.startsWith("lucide:")
                            ? cat.icon
                            : `lucide:${cat.icon.toLowerCase()}`
                          : cat.genderTarget === "female"
                          ? "lucide:venus"
                          : cat.genderTarget === "male"
                          ? "lucide:mars"
                          : cat.workspace === "garment"
                          ? "lucide:shirt"
                          : "lucide:gem"
                      }
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--md-on-surface)] leading-tight">
                      {isEn ? cat.nameEn : cat.nameTe}
                    </h3>
                    <p className="text-xs text-[var(--md-on-surface-variant)] font-medium">
                      {isEn ? cat.nameTe : cat.nameEn}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--md-surface-container-high)] text-[var(--md-on-surface-variant)] font-bold">
                        {cat.id}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--md-primary)]">
                        {cat.genderTarget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active switch */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                    cat.isActive ? "bg-[var(--md-primary)] justify-end" : "bg-neutral-300 dark:bg-neutral-700 justify-start"
                  }`}
                  title={cat.isActive ? "Active (Click to deactivate)" : "Inactive (Click to activate)"}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[var(--md-outline-variant)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--md-outline)] font-medium">
                  {isEn ? "Order:" : "క్రమం:"} <strong className="text-[var(--md-on-surface)]">{cat.displayOrder}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsDialogOpen(true);
                    }}
                    className="m3-btn-tonal px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                    <span>{isEn ? "Edit" : "మార్చండి"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-full text-[var(--md-error)] hover:bg-[var(--md-error-container)] transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog Modal */}
      {isDialogOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <h3 className="text-base font-black text-[var(--md-on-surface)]">
                {editingCategory.id ? (isEn ? "Edit Business Vertical" : "కేటగిరీ సవరణ") : (isEn ? "Add Business Vertical" : "కొత్త కేటగిరీ")}
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
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">ID / Slug</label>
                  <input
                    type="text"
                    required
                    disabled={!!categories.find((c) => c.id === editingCategory.id)}
                    value={editingCategory.id || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value })}
                    placeholder="garment_female"
                    className="m3-text-field w-full px-3 py-2 text-xs font-mono disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Workspace</label>
                  <select
                    value={editingCategory.workspace || "garment"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, workspace: e.target.value as any })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  >
                    <option value="garment">Garment (Clothing)</option>
                    <option value="jewelry">Jewelry (Ornaments)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.nameEn || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                    placeholder="Garments Female"
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (Telugu)</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.nameTe || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nameTe: e.target.value })}
                    placeholder="మహిళల వస్త్రాలు"
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Gender Target</label>
                  <select
                    value={editingCategory.genderTarget || "female"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, genderTarget: e.target.value as any })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="unisex">Unisex</option>
                    <option value="all">All Genders</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Display Sort Order</label>
                  <input
                    type="number"
                    value={editingCategory.displayOrder || 1}
                    onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--md-outline-variant)]">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="m3-btn-text px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
                >
                  {isEn ? "Cancel" : "రద్దు చేయండి"}
                </button>
                <button
                  type="submit"
                  className="m3-btn-filled px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer"
                >
                  {isEn ? "Save Category" : "సేవ్ చేయండి"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
