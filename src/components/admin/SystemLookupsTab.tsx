import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminLookupsApi,
  createAdminLookupApi,
  updateAdminLookupApi,
  deleteAdminLookupApi,
  fetchAdminGendersApi,
  createAdminGenderApi,
  updateAdminGenderApi,
  deleteAdminGenderApi,
  fetchAdminWearTypesApi,
  createAdminWearTypeApi,
  updateAdminWearTypeApi,
  deleteAdminWearTypeApi,
  SystemLookupRecord,
  GenderRecord,
  WearTypeRecord,
} from "../../utils/api";

interface SystemLookupsTabProps {
  lang: "en" | "te";
}

type LookupTypeFilter = "all" | "background_type" | "gender" | "garment_category" | "jewelry_category";

export const SystemLookupsTab: React.FC<SystemLookupsTabProps> = ({ lang }) => {
  const [lookups, setLookups] = useState<SystemLookupRecord[]>([]);
  const [wearTypes, setWearTypes] = useState<WearTypeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<LookupTypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLookup, setEditingLookup] = useState<Partial<SystemLookupRecord> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [lookupData, wearTypeData] = await Promise.all([
        fetchAdminLookupsApi(),
        fetchAdminWearTypesApi(),
      ]);
      setLookups(lookupData);
      setWearTypes(wearTypeData);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load system lookups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map detached wear types into lookup shape for unified display
  const wearTypeLookups: SystemLookupRecord[] = useMemo(
    () =>
      wearTypes.map((wt) => ({
        id: wt.id,
        type: (wt.workspace === "garment" ? "garment_category" : "jewelry_category") as any,
        code: wt.code,
        nameEn: wt.nameEn,
        nameTe: wt.nameTe,
        description: wt.description,
        icon: wt.icon,
        displayOrder: wt.displayOrder,
        isActive: wt.isActive,
        createdAt: wt.createdAt,
        updatedAt: wt.updatedAt,
      })),
    [wearTypes]
  );

  const combinedLookups = useMemo(() => {
    return [...lookups, ...wearTypeLookups];
  }, [lookups, wearTypeLookups]);

  const handleToggleActive = async (lookup: SystemLookupRecord) => {
    try {
      if (lookup.type === "garment_category" || lookup.type === "jewelry_category") {
        const updated = await updateAdminWearTypeApi(lookup.id, {
          isActive: !lookup.isActive,
        });
        setWearTypes((prev) => prev.map((wt) => (wt.id === updated.id ? updated : wt)));
      } else {
        const updated = await updateAdminLookupApi(lookup.id, {
          isActive: !lookup.isActive,
        });
        if (lookup.type === "gender") {
          const genderId = lookup.code || lookup.id;
          await updateAdminGenderApi(genderId, { isActive: !lookup.isActive }).catch(() => {});
        }
        setLookups((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      }
      showToast(isEn ? "Status updated" : "స్థితి నవీకరించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to toggle status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLookup?.id || !editingLookup?.code || !editingLookup?.nameEn || !editingLookup?.nameTe) {
      setErrorMsg(isEn ? "Please fill in all required fields (ID, Code, Names)" : "దయచేసి అవసరమైన ఫీల్డ్‌లను పూరించండి");
      return;
    }

    try {
      if (editingLookup.type === "garment_category" || editingLookup.type === "jewelry_category") {
        const workspace = editingLookup.type === "garment_category" ? "garment" : "jewelry";
        const payload: Partial<WearTypeRecord> = {
          id: editingLookup.id,
          workspace,
          code: editingLookup.code,
          nameEn: editingLookup.nameEn,
          nameTe: editingLookup.nameTe,
          description: editingLookup.description,
          icon: editingLookup.icon,
          displayOrder: editingLookup.displayOrder ?? 0,
          isActive: editingLookup.isActive ?? true,
        };

        const isNew = !wearTypes.some((wt) => wt.id === editingLookup.id);
        if (isNew) {
          const result = await createAdminWearTypeApi(payload);
          setWearTypes((prev) => [...prev, result]);
          showToast(isEn ? "Wear type created" : "వేర్ రకం సృష్టించబడింది");
        } else {
          const result = await updateAdminWearTypeApi(editingLookup.id, payload);
          setWearTypes((prev) => prev.map((wt) => (wt.id === result.id ? result : wt)));
          showToast(isEn ? "Wear type updated" : "వేర్ రకం నవీకరించబడింది");
        }
      } else {
        const isNew = !lookups.some((l) => l.id === editingLookup.id);
        let result: SystemLookupRecord;
        if (isNew) {
          result = await createAdminLookupApi(editingLookup);
          setLookups((prev) => [...prev, result]);
          showToast(isEn ? "System lookup created" : "కొత్త లక్అప్ సృష్టించబడింది");
        } else {
          result = await updateAdminLookupApi(editingLookup.id, editingLookup);
          setLookups((prev) => prev.map((l) => (l.id === result.id ? result : l)));
          showToast(isEn ? "System lookup updated" : "లక్అప్ నవీకరించబడింది");
        }

        if (editingLookup.type === "gender") {
          const genderId = editingLookup.code || editingLookup.id;
          try {
            await createAdminGenderApi({
              id: genderId,
              code: editingLookup.code,
              nameEn: editingLookup.nameEn,
              nameTe: editingLookup.nameTe,
              description: editingLookup.description,
              icon: editingLookup.icon,
              displayOrder: editingLookup.displayOrder,
              isActive: editingLookup.isActive,
            });
          } catch {
            await updateAdminGenderApi(genderId, {
              nameEn: editingLookup.nameEn,
              nameTe: editingLookup.nameTe,
              description: editingLookup.description,
              icon: editingLookup.icon,
              displayOrder: editingLookup.displayOrder,
              isActive: editingLookup.isActive,
            }).catch(() => {});
          }
        }
      }

      setIsDialogOpen(false);
      setEditingLookup(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save lookup");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete lookup '${id}'?` : `'${id}' ని తొలగించాలనుకుంటున్నారా?`)) {
      return;
    }
    try {
      const toDelete = combinedLookups.find((l) => l.id === id);
      if (toDelete && (toDelete.type === "garment_category" || toDelete.type === "jewelry_category")) {
        await deleteAdminWearTypeApi(id);
        setWearTypes((prev) => prev.filter((wt) => wt.id !== id));
        showToast(isEn ? "Wear type deleted" : "వేర్ రకం తొలగించబడింది");
      } else {
        await deleteAdminLookupApi(id);
        if (toDelete && toDelete.type === "gender") {
          const genderId = toDelete.code || toDelete.id;
          await deleteAdminGenderApi(genderId).catch(() => {});
        }
        setLookups((prev) => prev.filter((l) => l.id !== id));
        showToast(isEn ? "Lookup deleted" : "లక్అప్ తొలగించబడింది");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete lookup");
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredLookups = combinedLookups.filter((l) => {
    if (selectedType !== "all" && l.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.id.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.nameEn.toLowerCase().includes(q) ||
        l.nameTe.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const typePills: { key: LookupTypeFilter; labelEn: string; labelTe: string; count: number }[] = [
    { key: "all", labelEn: "All Items", labelTe: "అన్ని అంశాలు", count: combinedLookups.length },
    {
      key: "background_type",
      labelEn: "Backgrounds (Indoor / Outdoor)",
      labelTe: "బ్యాక్‌గ్రౌండ్స్ (ఇండోర్ / అవుట్‌డోర్)",
      count: combinedLookups.filter((l) => l.type === "background_type").length,
    },
    {
      key: "gender",
      labelEn: "Genders (Female / Male)",
      labelTe: "జెండర్స్ (మహిళ / పురుషుడు)",
      count: combinedLookups.filter((l) => l.type === "gender").length,
    },
    {
      key: "garment_category",
      labelEn: "Garment Wear Types (wear_types)",
      labelTe: "దుస్తుల వేర్ రకాలు",
      count: combinedLookups.filter((l) => l.type === "garment_category").length,
    },
    {
      key: "jewelry_category",
      labelEn: "Jewelry Wear Types (wear_types)",
      labelTe: "నగల వేర్ రకాలు",
      count: combinedLookups.filter((l) => l.type === "jewelry_category").length,
    },
  ];

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "background_type":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "gender":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
      case "garment_category":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "jewelry_category":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Icon icon="lucide:layers" className="w-6 h-6 text-accent" />
            <span>{isEn ? "System Lookups" : "సిస్టమ్ లక్అప్ టేబుల్స్"}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            {isEn
              ? "Dynamic enumerations for Background Types [indoor, outdoor], Genders [female, male], Garment Categories [top, bottom, full], and Jewelry Categories [neck, ear, wrist, hip, nose, leg, forehead wear]."
              : "బ్యాక్‌గ్రౌండ్ రకాలు, జెండర్లు, దుస్తులు మరియు నగల వర్గీకరణల డైనమిక్ డేటాబేస్ పట్టికలు."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingLookup({
              id: "",
              type: selectedType !== "all" ? selectedType : "background_type",
              code: "",
              nameEn: "",
              nameTe: "",
              description: "",
              icon: "lucide:tag",
              displayOrder: lookups.length + 1,
              isActive: true,
            });
            setIsDialogOpen(true);
          }}
          className="m3-btn-filled px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          <span>{isEn ? "Add Lookup Code" : "కొత్త లక్అప్ జోడించు"}</span>
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Icon icon="lucide:check-circle" className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:alert-triangle" className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg(null)} className="cursor-pointer">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Type filter tabs & search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[var(--surface-variant)]/40 border border-black/5 dark:border-white/5">
          {typePills.map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setSelectedType(pill.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === pill.key
                  ? "bg-accent text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>{isEn ? pill.labelEn : pill.labelTe}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedType === pill.key ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10"
              }`}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Icon icon="lucide:search" className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search lookups..." : "లక్అప్స్ వెతకండి..."}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/5 dark:border-white/5 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Lookups Grid / Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--text-secondary)] flex flex-col items-center gap-2">
          <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-accent" />
          <span>{isEn ? "Loading system lookups..." : "లక్అప్స్ లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : filteredLookups.length === 0 ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--text-secondary)] bg-[var(--surface-variant)]/20 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
          <Icon icon="lucide:inbox" className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <span>{isEn ? "No matching lookups found" : "ఎలాంటి లక్అప్స్ కనుగొనబడలేదు"}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredLookups.map((lookup) => (
            <div
              key={lookup.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                lookup.isActive
                  ? "bg-[var(--surface)] border-black/5 dark:border-white/5 shadow-sm"
                  : "bg-[var(--surface)]/50 border-black/5 dark:border-white/5 opacity-60"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                      <Icon icon={lookup.icon || "lucide:tag"} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-[var(--text-primary)]">{lookup.nameEn}</h4>
                        <span className="text-xs font-bold text-accent font-telugu opacity-90">{lookup.nameTe}</span>
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                        code: <span className="font-bold text-[var(--text-primary)]">{lookup.code}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${getTypeBadgeColor(lookup.type)}`}>
                    {lookup.type.replace(/_/g, " ")}
                  </span>
                </div>

                {lookup.description && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {lookup.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                  <span>Order: <strong className="text-[var(--text-primary)]">{lookup.displayOrder}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-[10px] opacity-70">ID: {lookup.id}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(lookup)}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      lookup.isActive
                        ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        : "text-gray-400 hover:bg-gray-500/10"
                    }`}
                    title={lookup.isActive ? "Deactivate" : "Activate"}
                  >
                    <Icon icon={lookup.isActive ? "lucide:toggle-right" : "lucide:toggle-left"} className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingLookup(lookup);
                      setIsDialogOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
                    title="Edit Lookup"
                  >
                    <Icon icon="lucide:pencil" className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(lookup.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete Lookup"
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog Modal */}
      {isDialogOpen && editingLookup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[var(--surface)] rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                <Icon icon="lucide:layers" className="w-5 h-5 text-accent" />
                <span>
                  {editingLookup.id && combinedLookups.some((l) => l.id === editingLookup.id)
                    ? isEn ? "Edit System Lookup / Wear Type" : "లక్అప్ / వేర్ రకం సవరించండి"
                    : isEn ? "Create New System Lookup / Wear Type" : "కొత్త లక్అప్ / వేర్ రకం సృష్టించండి"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingLookup(null);
                }}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Lookup Type *</label>
                  <select
                    value={editingLookup.type || "background_type"}
                    onChange={(e) => setEditingLookup({ ...editingLookup, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-bold focus:outline-none focus:border-accent"
                  >
                    <option value="background_type">background_type (indoor/outdoor)</option>
                    <option value="gender">gender (male/female)</option>
                    <option value="garment_category">garment_category (wear_types: top/bottom/full wear)</option>
                    <option value="jewelry_category">jewelry_category (wear_types: neck/ear/wrist wear)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Unique ID *</label>
                  <input
                    type="text"
                    value={editingLookup.id || ""}
                    onChange={(e) => setEditingLookup({ ...editingLookup, id: e.target.value })}
                    placeholder="e.g. bg_indoor, gen_male, gar_top_wear"
                    disabled={!!combinedLookups.some((l) => l.id === editingLookup.id)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-mono focus:outline-none focus:border-accent disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Code (Internal Key) *</label>
                  <input
                    type="text"
                    value={editingLookup.code || ""}
                    onChange={(e) => setEditingLookup({ ...editingLookup, code: e.target.value })}
                    placeholder="e.g. indoor, outdoor, top_wear"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-mono font-bold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Iconify String</label>
                  <input
                    type="text"
                    value={editingLookup.icon || ""}
                    onChange={(e) => setEditingLookup({ ...editingLookup, icon: e.target.value })}
                    placeholder="e.g. lucide:home, lucide:shirt"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Name (English) *</label>
                  <input
                    type="text"
                    value={editingLookup.nameEn || ""}
                    onChange={(e) => setEditingLookup({ ...editingLookup, nameEn: e.target.value })}
                    placeholder="e.g. Indoor Studio"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-bold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Name (Telugu) *</label>
                  <input
                    type="text"
                    value={editingLookup.nameTe || ""}
                    onChange={(e) => setEditingLookup({ ...editingLookup, nameTe: e.target.value })}
                    placeholder="e.g. ఇండోర్ స్టూడియో"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-bold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-secondary)]">Description</label>
                <textarea
                  rows={2}
                  value={editingLookup.description || ""}
                  onChange={(e) => setEditingLookup({ ...editingLookup, description: e.target.value })}
                  placeholder="Optional explanatory notes for developers and prompts"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Display Order</label>
                  <input
                    type="number"
                    value={editingLookup.displayOrder ?? 0}
                    onChange={(e) => setEditingLookup({ ...editingLookup, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-variant)]/30 border border-black/10 dark:border-white/10 font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="lookup-active-check"
                    checked={editingLookup.isActive ?? true}
                    onChange={(e) => setEditingLookup({ ...editingLookup, isActive: e.target.checked })}
                    className="w-4 h-4 accent-accent rounded"
                  />
                  <label htmlFor="lookup-active-check" className="text-xs font-bold text-[var(--text-primary)] cursor-pointer">
                    Active & Available in Studio
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingLookup(null);
                  }}
                  className="m3-btn-text px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="m3-btn-filled px-5 py-2 rounded-full text-xs font-bold cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Save Lookup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
