import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminCatalogApi,
  createAdminCatalogItemApi,
  updateAdminCatalogItemApi,
  deleteAdminCatalogItemApi,
  toggleAdminCatalogItemStatusApi,
  CatalogItemRecord,
  PresentationRecord,
  BackgroundRecord,
  PoseRecord,
} from "../../utils/api";
import { useStudioConfig } from "../../context/StudioConfigContext";

interface CatalogItemsTabProps {
  lang: "en" | "te";
}

export const CatalogItemsTab: React.FC<CatalogItemsTabProps> = ({ lang }) => {
  const {
    businesses,
    workspacesList,
    genderDemographics,
    wearTypes,
    getWearTypesByWorkspace,
    presentationModes,
    backgrounds,
    poses,
  } = useStudioConfig();

  const [items, setItems] = useState<CatalogItemRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [businessCategoryFilter, setBusinessCategoryFilter] = useState<string>("all");
  const [wearTypeFilter, setWearTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Partial<CatalogItemRecord> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminCatalogApi({
        workspace: workspaceFilter !== "all" ? workspaceFilter : undefined,
        genderTarget: genderFilter !== "all" ? genderFilter : undefined,
        businessCategoryId: businessCategoryFilter !== "all" ? businessCategoryFilter : undefined,
        wearType: wearTypeFilter !== "all" ? wearTypeFilter : undefined,
        wearTypeId: wearTypeFilter !== "all" ? wearTypeFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      setItems(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load catalog items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [workspaceFilter, genderFilter, businessCategoryFilter, wearTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleStatus = async (item: CatalogItemRecord) => {
    try {
      const updated = await toggleAdminCatalogItemStatusApi(item.id);
      setItems((prev) => prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)));
      showToast(isEn ? "Item status updated" : "వస్తువు స్థితి నవీకరించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete '${id}'?` : `'${id}' ని తొలగించాలనుకుంటున్నారా?`)) {
      return;
    }
    try {
      await deleteAdminCatalogItemApi(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(isEn ? "Catalog item deleted" : "వస్తువు తొలగించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete item");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.id || !editingItem?.nameEn || !editingItem?.nameTe) {
      setErrorMsg(isEn ? "Please fill in all required fields" : "దయచేసి అవసరమైన ఫీల్డ్‌లను పూరించండి");
      return;
    }

    try {
      const isNew = !items.some((i) => i.id === editingItem.id);
      let result: CatalogItemRecord;
      if (isNew) {
        result = await createAdminCatalogItemApi(editingItem);
        setItems((prev) => [...prev, result]);
        showToast(isEn ? "Item created successfully with linked presets" : "కొత్త వస్తువు విజయవంతంగా సృష్టించబడింది");
      } else {
        result = await updateAdminCatalogItemApi(editingItem.id, editingItem);
        setItems((prev) => prev.map((i) => (i.id === result.id ? { ...i, ...result } : i)));
        showToast(isEn ? "Item and linked presets updated successfully" : "వస్తువు మరియు సంబంధిత ప్రీసెట్లు నవీకరించబడ్డాయి");
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save catalog item");
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Helper to handle Business Category selection and auto-sync workspace & wear type
  const handleBusinessCategoryChange = (bizId: string) => {
    if (!bizId) {
      setEditingItem((prev) => ({
        ...prev,
        businessCategoryId: null,
      }));
      return;
    }

    const selectedBiz = businesses.find((b) => b.id === bizId);
    if (selectedBiz) {
      setEditingItem((prev) => {
        let newWearTypeId = prev?.wearTypeId;
        if (newWearTypeId) {
          const curWt = wearTypes.find((w) => w.id === newWearTypeId);
          if (curWt && curWt.workspace !== selectedBiz.workspace) {
            const compatibleWt = wearTypes.find((w) => w.workspace === selectedBiz.workspace);
            newWearTypeId = compatibleWt ? compatibleWt.id : null;
          }
        } else {
          const compatibleWt = wearTypes.find((w) => w.workspace === selectedBiz.workspace);
          newWearTypeId = compatibleWt ? compatibleWt.id : null;
        }

        const newWearType = newWearTypeId || (selectedBiz.workspace === "garment" ? "full_wear" : "neck_wear");

        return {
          ...prev,
          businessCategoryId: selectedBiz.id,
          workspace: selectedBiz.workspace,
          genderTarget: selectedBiz.genderTarget || prev?.genderTarget || "unisex",
          wearType: newWearType,
          wearTypeId: newWearType,
        };
      });
    } else {
      setEditingItem((prev) => ({
        ...prev,
        businessCategoryId: bizId,
      }));
    }
  };

  // Helper to handle Workspace change and ensure Business Category & Wear Type compatibility
  const handleWorkspaceChange = (newWorkspace: string) => {
    setEditingItem((prev) => {
      if (!prev) return null;
      let newBizId = prev.businessCategoryId;

      if (newBizId) {
        const curBiz = businesses.find((b) => b.id === newBizId);
        if (curBiz && curBiz.workspace !== newWorkspace) {
          const compatibleBiz = businesses.find((b) => b.workspace === newWorkspace);
          newBizId = compatibleBiz ? compatibleBiz.id : null;
        }
      }

      let newWearTypeId = prev.wearTypeId;
      if (newWearTypeId) {
        const curWt = wearTypes.find((w) => w.id === newWearTypeId);
        if (curWt && curWt.workspace !== newWorkspace) {
          const compatibleWt = wearTypes.find((w) => w.workspace === newWorkspace);
          newWearTypeId = compatibleWt ? compatibleWt.id : null;
        }
      } else {
        const compatibleWt = wearTypes.find((w) => w.workspace === newWorkspace);
        newWearTypeId = compatibleWt ? compatibleWt.id : null;
      }

      const newWearType = newWearTypeId || (newWorkspace === "garment" ? "full_wear" : "neck_wear");

      // Auto-filter existing selected presentations, backgrounds, and poses to new workspace
      const validPres = (presentationModes || [])
        .filter((pr) => pr.workspace === "all" || pr.workspace === newWorkspace)
        .map((pr) => pr.id);
      const validBgs = (backgrounds || [])
        .filter((bg) => bg.workspace === "all" || bg.workspace === newWorkspace)
        .map((bg) => bg.id);
      const validPoses = (poses || [])
        .filter((po) => po.workspace === "all" || po.workspace === newWorkspace)
        .map((po) => po.id);

      return {
        ...prev,
        workspace: newWorkspace,
        businessCategoryId: newBizId,
        wearType: newWearType,
        wearTypeId: newWearType,
        presentationIds: (prev.presentationIds || []).filter((id) => validPres.includes(id)),
        backgroundIds: (prev.backgroundIds || []).filter((id) => validBgs.includes(id)),
        poseIds: (prev.poseIds || []).filter((id) => validPoses.includes(id)),
      };
    });
  };

  // Background categorization helper: Indoor vs Outdoor
  const isOutdoorBg = (bg: BackgroundRecord) =>
    bg.subCategory === "outdoor" || ["traditional", "royal", "beach", "urban"].includes(bg.id);

  // Available Presets for the item currently being edited
  const availablePresentations = useMemo(() => {
    const ws = editingItem?.workspace || "garment";
    return (presentationModes || []).filter((pr) => pr.workspace === "all" || pr.workspace === ws);
  }, [presentationModes, editingItem?.workspace]);

  const availableBackgrounds = useMemo(() => {
    const ws = editingItem?.workspace || "garment";
    return (backgrounds || []).filter((bg) => bg.workspace === "all" || bg.workspace === ws);
  }, [backgrounds, editingItem?.workspace]);

  const availableIndoorBgs = useMemo(() => {
    return availableBackgrounds.filter((bg) => !isOutdoorBg(bg));
  }, [availableBackgrounds]);

  const availableOutdoorBgs = useMemo(() => {
    return availableBackgrounds.filter((bg) => isOutdoorBg(bg));
  }, [availableBackgrounds]);

  const availablePoses = useMemo(() => {
    const ws = editingItem?.workspace || "garment";
    const curWt = editingItem?.wearType || editingItem?.wearTypeId;
    const allMatchingWs = (poses || []).filter((po) => po.workspace === "all" || po.workspace === ws);
    return allMatchingWs.sort((a, b) => {
      // Prioritize poses matching the item's specific wearType
      const aMatches = curWt && a.wearTypeId === curWt ? -1 : 1;
      const bMatches = curWt && b.wearTypeId === curWt ? -1 : 1;
      return aMatches - bMatches;
    });
  }, [poses, editingItem?.workspace, editingItem?.wearType, editingItem?.wearTypeId]);

  // Quick selection handlers for Presentations
  const togglePresentation = (presId: string) => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const current = prev.presentationIds || [];
      const exists = current.includes(presId);
      const next = exists ? current.filter((id) => id !== presId) : [...current, presId];
      return { ...prev, presentationIds: next };
    });
  };

  const selectAllPresentations = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      return { ...prev, presentationIds: availablePresentations.map((p) => p.id) };
    });
  };

  const clearAllPresentations = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      return { ...prev, presentationIds: [] };
    });
  };

  // Quick selection handlers for Backgrounds (Indoor + Outdoor)
  const toggleBackground = (bgId: string) => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const current = prev.backgroundIds || [];
      const exists = current.includes(bgId);
      const next = exists ? current.filter((id) => id !== bgId) : [...current, bgId];
      return { ...prev, backgroundIds: next };
    });
  };

  const selectAllBackgrounds = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      return { ...prev, backgroundIds: availableBackgrounds.map((b) => b.id) };
    });
  };

  const clearAllBackgrounds = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      return { ...prev, backgroundIds: [] };
    });
  };

  const selectAllIndoorBackgrounds = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const current = new Set(prev.backgroundIds || []);
      availableIndoorBgs.forEach((b) => current.add(b.id));
      return { ...prev, backgroundIds: Array.from(current) };
    });
  };

  const clearIndoorBackgrounds = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const indoorIds = new Set(availableIndoorBgs.map((b) => b.id));
      const next = (prev.backgroundIds || []).filter((id) => !indoorIds.has(id));
      return { ...prev, backgroundIds: next };
    });
  };

  const selectAllOutdoorBackgrounds = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const current = new Set(prev.backgroundIds || []);
      availableOutdoorBgs.forEach((b) => current.add(b.id));
      return { ...prev, backgroundIds: Array.from(current) };
    });
  };

  const clearOutdoorBackgrounds = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const outdoorIds = new Set(availableOutdoorBgs.map((b) => b.id));
      const next = (prev.backgroundIds || []).filter((id) => !outdoorIds.has(id));
      return { ...prev, backgroundIds: next };
    });
  };

  // Quick selection handlers for Poses
  const togglePose = (poseId: string) => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const current = prev.poseIds || [];
      const exists = current.includes(poseId);
      const next = exists ? current.filter((id) => id !== poseId) : [...current, poseId];
      return { ...prev, poseIds: next };
    });
  };

  const selectAllPoses = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      return { ...prev, poseIds: availablePoses.map((p) => p.id) };
    });
  };

  const clearAllPoses = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      return { ...prev, poseIds: [] };
    });
  };

  const selectMatchingWearTypePoses = () => {
    setEditingItem((prev) => {
      if (!prev) return null;
      const curWt = prev.wearType || prev.wearTypeId;
      const matching = availablePoses.filter((p) => p.wearTypeId === curWt).map((p) => p.id);
      return { ...prev, poseIds: matching.length > 0 ? matching : availablePoses.map((p) => p.id) };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:shirt" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Catalog Items & Commercial Directives" : "వస్తువుల కేటలాగ్ & ప్రాంప్ట్ నియమాలు"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Manage garments and jewelry catalog items linked to multiple Presentations, Backgrounds (Indoor + Outdoor), and Poses."
              : "ప్రెజెంటేషన్లు, బ్యాక్‌గ్రౌండ్లు (ఇండోర్ + అవుట్‌డోర్) మరియు పోజులతో అనుసంధానించబడిన కేటలాగ్ వస్తువులను నిర్వహించండి."}
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
              const defaultWorkspace = businesses[0]?.workspace || "garment";
              const matchingWt = wearTypes.find((wt) => wt.workspace === defaultWorkspace) || wearTypes[0];
              const defaultWearType = matchingWt?.id || (defaultWorkspace === "garment" ? "full_wear" : "neck_wear");

              const defPres = (presentationModes || [])
                .filter((pr) => pr.workspace === "all" || pr.workspace === defaultWorkspace)
                .map((pr) => pr.id);
              const defBgs = (backgrounds || [])
                .filter((bg) => bg.workspace === "all" || bg.workspace === defaultWorkspace)
                .map((bg) => bg.id);
              const defPoses = (poses || [])
                .filter((po) => (po.workspace === "all" || po.workspace === defaultWorkspace) && (!po.wearTypeId || po.wearTypeId === defaultWearType))
                .map((po) => po.id);

              setEditingItem({
                id: "",
                businessCategoryId: businesses[0]?.id || "garment_female",
                workspace: defaultWorkspace,
                wearType: defaultWearType,
                wearTypeId: defaultWearType,
                genderTarget: businesses[0]?.genderTarget || "female",
                nameEn: "",
                nameTe: "",
                promptDirective: "photorealistic commercial catalog shoot, true-to-life fabric texture and authentic folds",
                placementDirective: "",
                displayOrder: items.length + 1,
                isActive: true,
                presentationIds: defPres,
                backgroundIds: defBgs,
                poseIds: defPoses,
              });
              setIsDialogOpen(true);
            }}
            className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>{isEn ? "Add Item" : "కొత్త వస్తువు"}</span>
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

      {/* Filter and Search Bar */}
      <div className="m3-card p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Workspace Filter Chips */}
          <div className="flex p-0.5 rounded-full bg-[var(--md-surface-container)] text-xs font-bold">
            <button
              type="button"
              onClick={() => setWorkspaceFilter("all")}
              className={`px-3 py-1 rounded-full capitalize cursor-pointer transition-all ${
                workspaceFilter === "all"
                  ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                  : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
              }`}
            >
              All Workspaces
            </button>
            {workspacesList.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setWorkspaceFilter(ws.id)}
                className={`px-3 py-1 rounded-full capitalize cursor-pointer transition-all ${
                  workspaceFilter === ws.id
                    ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                    : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
                }`}
              >
                {isEn ? ws.nameEn : ws.nameTe}
              </button>
            ))}
          </div>

          {/* Business Category Filter Dropdown */}
          <select
            value={businessCategoryFilter}
            onChange={(e) => setBusinessCategoryFilter(e.target.value)}
            className="m3-text-field text-xs py-1 px-3 rounded-full font-bold cursor-pointer"
          >
            <option value="all">{isEn ? "All Business Categories" : "అన్ని విభాగాలు"}</option>
            {businesses.map((biz) => (
              <option key={biz.id} value={biz.id}>
                {isEn ? biz.nameEn : biz.nameTe} ({biz.workspace})
              </option>
            ))}
          </select>

          {/* Wear Type Filter Dropdown */}
          <select
            value={wearTypeFilter}
            onChange={(e) => setWearTypeFilter(e.target.value)}
            className="m3-text-field text-xs py-1 px-3 rounded-full font-bold cursor-pointer"
          >
            <option value="all">{isEn ? "All Wear Types" : "అన్ని వేర్ రకాలు"}</option>
            {getWearTypesByWorkspace(workspaceFilter).map((wt) => (
              <option key={wt.id} value={wt.id}>
                {isEn ? wt.nameEn : wt.nameTe} ({wt.workspace})
              </option>
            ))}
          </select>

          {/* Gender Filter Chips */}
          <div className="flex p-0.5 rounded-full bg-[var(--md-surface-container)] text-xs font-bold">
            <button
              type="button"
              onClick={() => setGenderFilter("all")}
              className={`px-3 py-1 rounded-full capitalize cursor-pointer transition-all ${
                genderFilter === "all"
                  ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                  : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
              }`}
            >
              All Genders
            </button>
            {genderDemographics.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGenderFilter(g.id)}
                className={`px-3 py-1 rounded-full capitalize cursor-pointer transition-all ${
                  genderFilter === g.id
                    ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                    : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
                }`}
              >
                {isEn ? g.nameEn : g.nameTe}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:max-w-xs">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-[var(--md-outline)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search items (e.g. saree, ring)..." : "వెతకండి..."}
            className="m3-text-field w-full pl-9 pr-3 py-1.5 text-xs font-bold"
          />
        </form>
      </div>

      {/* Items List Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--md-outline)] flex items-center justify-center gap-2">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[var(--md-primary)]" />
          <span>{isEn ? "Loading catalog items..." : "వస్తువులు లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : (
        <div className="m3-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--md-surface-container)] border-b border-[var(--md-outline-variant)] text-[10px] font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                  <th className="py-3 px-3">Item Details</th>
                  <th className="py-3 px-3">Wear Type (FK)</th>
                  <th className="py-3 px-3">Business (FK)</th>
                  <th className="py-3 px-3">Workspace</th>
                  <th className="py-3 px-3">Linked Presets</th>
                  <th className="py-3 px-3">Prompt Directive</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--md-outline-variant)]">
                {items.map((item) => {
                  const parentBiz = businesses.find((b) => b.id === item.businessCategoryId);
                  const wtKey = item.wearType || item.wearTypeId;
                  const matchingWearType = wearTypes.find((wt) => wt.id === wtKey);

                  const presCount = (item.presentationIds || []).length;
                  const bgCount = (item.backgroundIds || []).length;
                  const poseCount = (item.poseIds || []).length;

                  // Calculate indoor and outdoor count
                  const linkedBgs = (backgrounds || []).filter((b) => (item.backgroundIds || []).includes(b.id));
                  const indoorCount = linkedBgs.filter((b) => !isOutdoorBg(b)).length;
                  const outdoorCount = linkedBgs.filter((b) => isOutdoorBg(b)).length;

                  return (
                    <tr key={item.id} className="hover:bg-[var(--md-surface-variant)] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-[var(--md-on-surface)] text-xs">
                          {isEn ? item.nameEn : item.nameTe}
                        </div>
                        <div className="text-[10px] text-[var(--md-on-surface-variant)] font-medium">
                          {isEn ? item.nameTe : item.nameEn}
                        </div>
                        <span className="font-mono text-[9px] text-[var(--md-outline)]">
                          id: {item.id}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {wtKey ? (
                          <div className="space-y-0.5">
                            <span className="m3-badge bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] text-[9px] font-mono font-bold">
                              {wtKey}
                            </span>
                            {matchingWearType && (
                              <div className="text-[10px] text-[var(--md-on-surface-variant)] font-semibold flex items-center gap-1">
                                {matchingWearType.icon && (
                                  <Icon icon={matchingWearType.icon} className="w-3 h-3 text-[var(--md-primary)]" />
                                )}
                                <span>{isEn ? matchingWearType.nameEn : matchingWearType.nameTe}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[var(--md-outline)] italic">None</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {item.businessCategoryId ? (
                          <div className="space-y-0.5">
                            <span className="m3-badge bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)] text-[9px] font-mono font-bold">
                              {item.businessCategoryId}
                            </span>
                            {parentBiz && (
                              <div className="text-[10px] text-[var(--md-on-surface-variant)] font-semibold">
                                {isEn ? parentBiz.nameEn : parentBiz.nameTe}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[var(--md-outline)] italic">None</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span className="m3-badge text-[9px] uppercase font-bold">
                            {item.workspace}
                          </span>
                          <div>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider ${
                                item.genderTarget === "female"
                                  ? "text-rose-500"
                                  : item.genderTarget === "male"
                                  ? "text-blue-500"
                                  : item.genderTarget === "all"
                                  ? "text-purple-500"
                                  : "text-amber-500"
                              }`}
                            >
                              {item.genderTarget}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Linked Presets Badges */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 text-[10px]">
                          {/* Presentations Badge */}
                          <div
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[var(--md-primary-container)]/70 text-[var(--md-on-primary-container)] font-bold text-[9px] w-fit"
                            title={isEn ? "Linked Presentation Modes" : "ప్రెజెంటేషన్ మోడ్‌లు"}
                          >
                            <Icon icon="lucide:presentation" className="w-3 h-3 text-[var(--md-primary)]" />
                            <span>{presCount} Pres</span>
                          </div>

                          {/* Backgrounds (Indoor + Outdoor) Badge */}
                          <div className="flex items-center gap-1 flex-wrap">
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]"
                              title={isEn ? "Linked Indoor Backgrounds" : "ఇండోర్ బ్యాక్‌గ్రౌండ్లు"}
                            >
                              <Icon icon="lucide:home" className="w-3 h-3 text-emerald-600" />
                              <span>{indoorCount} In</span>
                            </span>
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[9px]"
                              title={isEn ? "Linked Outdoor Backgrounds" : "అవుట్‌డోర్ బ్యాక్‌గ్రౌండ్లు"}
                            >
                              <Icon icon="lucide:trees" className="w-3 h-3 text-amber-600" />
                              <span>{outdoorCount} Out</span>
                            </span>
                          </div>

                          {/* Poses Badge */}
                          <div
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-[9px] w-fit"
                            title={isEn ? "Linked Poses & Angles" : "పోజులు"}
                          >
                            <Icon icon="lucide:accessibility" className="w-3 h-3 text-indigo-600" />
                            <span>{poseCount} Poses</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-[11px] text-[var(--md-on-surface-variant)] line-clamp-2 leading-relaxed">
                          {item.promptDirective}
                        </p>
                        {item.placementDirective && (
                          <p className="text-[9px] text-[var(--md-outline)] italic line-clamp-1 mt-0.5">
                            Placement: {item.placementDirective}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center ${
                            item.isActive ? "bg-[var(--md-primary)] justify-end" : "bg-neutral-300 dark:bg-neutral-700 justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({
                                ...item,
                                presentationIds: item.presentationIds || [],
                                backgroundIds: item.backgroundIds || [],
                                poseIds: item.poseIds || [],
                              });
                              setIsDialogOpen(true);
                            }}
                            className="m3-btn-tonal p-1.5 rounded-full cursor-pointer"
                            title="Edit Item"
                          >
                            <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-full text-[var(--md-error)] hover:bg-[var(--md-error-container)] transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Item Dialog */}
      {isDialogOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <div>
                <h3 className="text-base font-black text-[var(--md-on-surface)] flex items-center gap-2">
                  <Icon icon="lucide:shirt" className="w-5 h-5 text-[var(--md-primary)]" />
                  <span>
                    {editingItem.id ? (isEn ? `Edit Item: ${editingItem.nameEn || editingItem.id}` : `వస్తువు సవరణ: ${editingItem.nameTe || editingItem.id}`) : (isEn ? "Add New Catalog Item" : "కొత్త కేటలాగ్ వస్తువు")}
                  </span>
                </h3>
                <p className="text-[11px] text-[var(--md-on-surface-variant)] mt-0.5">
                  {isEn
                    ? "Configure item identity, prompts, and link to multiple presentation modes, backgrounds (indoor/outdoor), and poses."
                    : "వస్తువు వివరాలు మరియు బహుళ ప్రెజెంటేషన్లు, బ్యాక్‌గ్రౌండ్లు, పోజులను ఎంచుకోండి."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[var(--md-surface-variant)] flex items-center justify-center text-[var(--md-outline)] cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* SECTION 1: Basic Information & Relations */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--md-surface-container)]/50 border border-[var(--md-outline-variant)]">
                <div className="text-[11px] font-black uppercase tracking-wider text-[var(--md-primary)] flex items-center gap-1.5">
                  <Icon icon="lucide:info" className="w-3.5 h-3.5" />
                  <span>{isEn ? "1. Item Identity & Database Keys" : "1. వస్తువు గుర్తింపు & కీలు"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">Unique Key / ID (Slug)</label>
                    <input
                      type="text"
                      required
                      disabled={!!items.find((i) => i.id === editingItem.id)}
                      value={editingItem.id || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                      placeholder="saree / necklace"
                      className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">
                      Parent Business Category <span className="text-[var(--md-primary)] font-mono text-[10px]">(FK)</span>
                    </label>
                    <select
                      value={editingItem.businessCategoryId || ""}
                      onChange={(e) => handleBusinessCategoryChange(e.target.value)}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    >
                      <option value="">{isEn ? "(None / Direct Workspace)" : "(ప్రత్యేక విభాగం లేదు)"}</option>
                      {businesses.map((biz) => (
                        <option key={biz.id} value={biz.id}>
                          {isEn ? biz.nameEn : biz.nameTe} [{biz.workspace}]
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">
                      Workspace <span className="text-[var(--md-primary)] font-mono text-[10px]">(FK)</span>
                    </label>
                    <select
                      value={editingItem.workspace || "garment"}
                      onChange={(e) => handleWorkspaceChange(e.target.value)}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    >
                      {workspacesList.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {isEn ? ws.nameEn : ws.nameTe} ({ws.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">
                      Wear Type <span className="text-[var(--md-primary)] font-mono text-[10px]">(FK)</span>
                    </label>
                    <select
                      required
                      value={editingItem.wearType || editingItem.wearTypeId || ""}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const foundWt = wearTypes.find((wt) => wt.id === selectedId);
                        setEditingItem({
                          ...editingItem,
                          wearType: selectedId,
                          wearTypeId: selectedId,
                          workspace: foundWt?.workspace || editingItem.workspace,
                        });
                      }}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    >
                      <option value="">{isEn ? "-- Select Wear Type --" : "-- వేర్ రకాన్ని ఎంచుకోండి --"}</option>
                      {getWearTypesByWorkspace(editingItem.workspace).map((wt) => (
                        <option key={wt.id} value={wt.id}>
                          {isEn ? wt.nameEn : wt.nameTe} ({wt.code}) [{wt.workspace}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">
                      Gender Target <span className="text-[var(--md-primary)] font-mono text-[10px]">(FK)</span>
                    </label>
                    <select
                      value={editingItem.genderTarget || "female"}
                      onChange={(e) => setEditingItem({ ...editingItem, genderTarget: e.target.value as any })}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    >
                      {genderDemographics.map((g) => (
                        <option key={g.id} value={g.id}>
                          {isEn ? g.nameEn : g.nameTe} ({g.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (English)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.nameEn || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (Telugu)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.nameTe || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, nameTe: e.target.value })}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--md-on-surface)]">Display Order</label>
                    <input
                      type="number"
                      value={editingItem.displayOrder ?? 0}
                      onChange={(e) => setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value) || 0 })}
                      className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: LINKED PRESENTATION MODES */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--md-surface-container)]/50 border border-[var(--md-outline-variant)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--md-outline-variant)] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]">
                      <Icon icon="lucide:presentation" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[var(--md-on-surface)]">
                        {isEn ? "Linked Presentation Modes" : "సంబంధిత ప్రెజెంటేషన్ మోడ్‌లు"}
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        {isEn
                          ? `Selected ${(editingItem.presentationIds || []).length} of ${availablePresentations.length} available presentation modes`
                          : `${(editingItem.presentationIds || []).length} ఎంచుకోబడ్డాయి`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={selectAllPresentations}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--md-surface-variant)] text-[var(--md-primary)] hover:bg-[var(--md-primary-container)] transition-colors cursor-pointer"
                    >
                      {isEn ? "Select All" : "అన్నీ ఎంచుకోండి"}
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPresentations}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--md-surface-variant)] text-[var(--md-outline)] hover:text-[var(--md-error)] transition-colors cursor-pointer"
                    >
                      {isEn ? "Clear" : "రద్దు చేయండి"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                  {availablePresentations.map((pres) => {
                    const isSelected = (editingItem.presentationIds || []).includes(pres.id);
                    return (
                      <button
                        key={pres.id}
                        type="button"
                        onClick={() => togglePresentation(pres.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] border-[var(--md-primary)] shadow-xs"
                            : "bg-[var(--md-surface)] text-[var(--md-on-surface)] border-[var(--md-outline-variant)] hover:border-[var(--md-primary)]"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon
                            icon={
                              pres.id === "model"
                                ? "lucide:user"
                                : pres.id === "partial_face"
                                ? "lucide:scan-face"
                                : pres.id === "no_face"
                                ? "lucide:user-x"
                                : pres.id === "mannequin"
                                ? "lucide:user-round"
                                : pres.id === "hanger"
                                ? "ph:coat-hanger-bold"
                                : pres.id === "flat_lay"
                                ? "ph:layout-bold"
                                : pres.id === "folded"
                                ? "ph:stack-bold"
                                : pres.id === "bust"
                                ? "lucide:shield"
                                : "lucide:presentation"
                            }
                            className={`w-4 h-4 ${isSelected ? "text-[var(--md-on-primary)]" : "text-[var(--md-primary)]"}`}
                          />
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] font-black ${
                              isSelected
                                ? "bg-white text-[var(--md-primary)] border-white"
                                : "border-[var(--md-outline)] text-transparent"
                            }`}
                          >
                            <Icon icon="lucide:check" className="w-2.5 h-2.5" />
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold leading-tight">
                            {isEn ? pres.nameEn : pres.nameTe}
                          </div>
                          <div className={`text-[9px] font-mono mt-0.5 ${isSelected ? "text-[var(--md-on-primary)]/80" : "text-[var(--md-outline)]"}`}>
                            {pres.id}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: LINKED BACKGROUNDS [INDOOR + OUTDOOR] */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--md-surface-container)]/50 border border-[var(--md-outline-variant)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--md-outline-variant)] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200">
                      <Icon icon="lucide:image" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[var(--md-on-surface)] flex items-center gap-2">
                        <span>{isEn ? "Linked Backgrounds [Indoor + Outdoor]" : "సంబంధిత బ్యాక్‌గ్రౌండ్లు [ఇండోర్ + అవుట్‌డోర్]"}</span>
                        <span className="m3-badge bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] text-[9px]">
                          {(editingItem.backgroundIds || []).length} / {availableBackgrounds.length}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        {isEn
                          ? "Select permitted studio environments (solid colors, indoor marble/lofts, outdoor heritage courtyards/balconies)."
                          : "ఈ వస్తువుకు అనువైన ఇండోర్ మరియు అవుట్‌డోర్ బ్యాక్‌గ్రౌండ్లను ఎంచుకోండి."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                    <button
                      type="button"
                      onClick={selectAllBackgrounds}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--md-surface-variant)] text-[var(--md-primary)] hover:bg-[var(--md-primary-container)] transition-colors cursor-pointer"
                    >
                      {isEn ? "All" : "అన్నీ"}
                    </button>
                    <button
                      type="button"
                      onClick={selectAllIndoorBackgrounds}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 transition-colors cursor-pointer"
                    >
                      + {isEn ? "All Indoor" : "ఇండోర్"}
                    </button>
                    <button
                      type="button"
                      onClick={selectAllOutdoorBackgrounds}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300 transition-colors cursor-pointer"
                    >
                      + {isEn ? "All Outdoor" : "అవుట్‌డోర్"}
                    </button>
                    <button
                      type="button"
                      onClick={clearAllBackgrounds}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--md-surface-variant)] text-[var(--md-outline)] hover:text-[var(--md-error)] transition-colors cursor-pointer"
                    >
                      {isEn ? "Clear" : "రద్దు"}
                    </button>
                  </div>
                </div>

                {/* Sub-Group 1: Indoor Backgrounds */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:home" className="w-3.5 h-3.5" />
                      <span>{isEn ? "Indoor & Studio Backdrops" : "ఇండోర్ & స్టూడియో బ్యాక్‌గ్రౌండ్లు"}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        ({availableIndoorBgs.filter((b) => (editingItem.backgroundIds || []).includes(b.id)).length} / {availableIndoorBgs.length})
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={selectAllIndoorBackgrounds}
                        className="text-[9px] font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        {isEn ? "Select all" : "అన్నీ"}
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={clearIndoorBackgrounds}
                        className="text-[9px] font-bold text-[var(--md-outline)] hover:text-[var(--md-error)] cursor-pointer"
                      >
                        {isEn ? "Clear" : "రద్దు"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableIndoorBgs.map((bg) => {
                      const isSelected = (editingItem.backgroundIds || []).includes(bg.id);
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => toggleBackground(bg.id)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-[var(--md-surface)] text-[var(--md-on-surface)] border-[var(--md-outline-variant)] hover:border-emerald-500"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-3.5 h-3.5 rounded-full shrink-0 border ${
                                bg.colorHex ? "" : isSelected ? "bg-white/80" : "bg-emerald-100"
                              }`}
                              style={{ backgroundColor: bg.colorHex || undefined }}
                            />
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold truncate">
                                {isEn ? bg.nameEn : bg.nameTe}
                              </div>
                              <div className={`text-[8px] font-mono truncate ${isSelected ? "text-emerald-100" : "text-[var(--md-outline)]"}`}>
                                {bg.id}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border text-[8px] ${
                              isSelected ? "bg-white text-emerald-700 border-white" : "border-[var(--md-outline)] text-transparent"
                            }`}
                          >
                            <Icon icon="lucide:check" className="w-2 h-2" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Group 2: Outdoor Backgrounds */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--md-outline-variant)]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:trees" className="w-3.5 h-3.5" />
                      <span>{isEn ? "Outdoor Heritage & Nature Scenes" : "అవుట్‌డోర్ & సహజ దృశ్యాలు"}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        ({availableOutdoorBgs.filter((b) => (editingItem.backgroundIds || []).includes(b.id)).length} / {availableOutdoorBgs.length})
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={selectAllOutdoorBackgrounds}
                        className="text-[9px] font-bold text-amber-700 hover:underline cursor-pointer"
                      >
                        {isEn ? "Select all" : "అన్నీ"}
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={clearOutdoorBackgrounds}
                        className="text-[9px] font-bold text-[var(--md-outline)] hover:text-[var(--md-error)] cursor-pointer"
                      >
                        {isEn ? "Clear" : "రద్దు"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableOutdoorBgs.map((bg) => {
                      const isSelected = (editingItem.backgroundIds || []).includes(bg.id);
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => toggleBackground(bg.id)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                              : "bg-[var(--md-surface)] text-[var(--md-on-surface)] border-[var(--md-outline-variant)] hover:border-amber-500"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon
                              icon="lucide:sun"
                              className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-amber-600"}`}
                            />
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold truncate">
                                {isEn ? bg.nameEn : bg.nameTe}
                              </div>
                              <div className={`text-[8px] font-mono truncate ${isSelected ? "text-amber-100" : "text-[var(--md-outline)]"}`}>
                                {bg.id}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border text-[8px] ${
                              isSelected ? "bg-white text-amber-700 border-white" : "border-[var(--md-outline)] text-transparent"
                            }`}
                          >
                            <Icon icon="lucide:check" className="w-2 h-2" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 4: LINKED POSES & ANGLES */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--md-surface-container)]/50 border border-[var(--md-outline-variant)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--md-outline-variant)] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200">
                      <Icon icon="lucide:accessibility" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[var(--md-on-surface)] flex items-center gap-2">
                        <span>{isEn ? "Linked Model Poses & Framing Angles" : "సంబంధిత మోడల్ పోజులు & కెమెరా యాంగిల్స్"}</span>
                        <span className="m3-badge bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] text-[9px]">
                          {(editingItem.poseIds || []).length} / {availablePoses.length}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--md-on-surface-variant)]">
                        {isEn
                          ? "Select permitted poses suitable for this wear type (standing, sitting, walking, or macro close-ups)."
                          : "ఈ వస్తువుకు సరిపోయే కెమెరా యాంగిల్స్ మరియు పోజులను ఎంచుకోండి."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                    <button
                      type="button"
                      onClick={selectMatchingWearTypePoses}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 transition-colors cursor-pointer"
                    >
                      🎯 {isEn ? "Match Wear Type" : "వేర్ టైప్ సరిపోల్చు"}
                    </button>
                    <button
                      type="button"
                      onClick={selectAllPoses}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--md-surface-variant)] text-[var(--md-primary)] hover:bg-[var(--md-primary-container)] transition-colors cursor-pointer"
                    >
                      {isEn ? "All" : "అన్నీ"}
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPoses}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--md-surface-variant)] text-[var(--md-outline)] hover:text-[var(--md-error)] transition-colors cursor-pointer"
                    >
                      {isEn ? "Clear" : "రద్దు"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {availablePoses.map((pose) => {
                    const isSelected = (editingItem.poseIds || []).includes(pose.id);
                    const curWt = editingItem.wearType || editingItem.wearTypeId;
                    const matchesWearType = curWt && pose.wearTypeId === curWt;

                    return (
                      <button
                        key={pose.id}
                        type="button"
                        onClick={() => togglePose(pose.id)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : matchesWearType
                            ? "bg-indigo-50/60 dark:bg-indigo-950/20 text-[var(--md-on-surface)] border-indigo-200 dark:border-indigo-800 hover:border-indigo-400"
                            : "bg-[var(--md-surface)] text-[var(--md-on-surface)] border-[var(--md-outline-variant)] hover:border-indigo-400"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold truncate flex items-center gap-1">
                            <span>{isEn ? pose.nameEn : pose.nameTe}</span>
                            {matchesWearType && !isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" title="Recommended for this wear type" />
                            )}
                          </div>
                          <div className={`text-[8px] font-mono truncate ${isSelected ? "text-indigo-100" : "text-[var(--md-outline)]"}`}>
                            {pose.id} {pose.wearTypeId ? `(${pose.wearTypeId})` : ""}
                          </div>
                        </div>

                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border text-[8px] ${
                            isSelected ? "bg-white text-indigo-700 border-white" : "border-[var(--md-outline)] text-transparent"
                          }`}
                        >
                          <Icon icon="lucide:check" className="w-2 h-2" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: COMMERCIAL PROMPT DIRECTIVES */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--md-surface-container)]/50 border border-[var(--md-outline-variant)]">
                <div className="text-[11px] font-black uppercase tracking-wider text-[var(--md-primary)] flex items-center gap-1.5">
                  <Icon icon="lucide:sparkles" className="w-3.5 h-3.5" />
                  <span>{isEn ? "3. Commercial AI Prompt Directives" : "3. ప్రాంప్ట్ నియమాలు"}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Commercial Prompt Directive</label>
                  <textarea
                    rows={3}
                    required
                    value={editingItem.promptDirective || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, promptDirective: e.target.value })}
                    placeholder="Detailed prompt description injected into AI generation requests..."
                    className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Placement Directive (Optional)</label>
                  <textarea
                    rows={2}
                    value={editingItem.placementDirective || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, placementDirective: e.target.value })}
                    placeholder="e.g. Drapes from the shoulder to the ankles with authentic pleats..."
                    className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer / Actions */}
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
                  className="m3-btn-filled px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer flex items-center gap-1.5"
                >
                  <Icon icon="lucide:check" className="w-4 h-4" />
                  <span>{isEn ? "Save Item & Links" : "సేవ్ చేయండి"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
