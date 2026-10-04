import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminPresetsApi,
  uploadAdminFaceApi,
  replaceAdminFacePhotoApi,
  deleteAdminFaceApi,
  updateAdminPresetApi,
  StudioPresetRecord,
} from "../../utils/api";

interface ModelFacesTabProps {
  lang: "en" | "te";
}

export const ModelFacesTab: React.FC<ModelFacesTabProps> = ({ lang }) => {
  const [faces, setFaces] = useState<StudioPresetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<"all" | "female" | "male">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    id: "",
    nameEn: "",
    nameTe: "",
    genderTarget: "female" as "female" | "male",
    promptDirective: "",
    ageGroup: "20s",
  });

  // Replace Photo State
  const [replacingFaceId, setReplacingFaceId] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Directive State
  const [editingFace, setEditingFace] = useState<StudioPresetRecord | null>(null);

  const isEn = lang === "en";

  const loadFaces = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminPresetsApi({ type: "face" });
      setFaces(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load model faces");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaces();
  }, []);

  const handleFileSelect = (file: File) => {
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Auto-fill ID from filename if blank
    if (!uploadForm.id) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9_-]/g, "_");
      setUploadForm((prev) => ({
        ...prev,
        id: cleanName,
        nameEn: prev.nameEn || cleanName.replace(/_/g, " "),
      }));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setErrorMsg(isEn ? "Please select a photo file" : "దయచేసి ఫోటో ఫైల్‌ను ఎంచుకోండి");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("id", uploadForm.id || `face_${Date.now()}`);
      formData.append("nameEn", uploadForm.nameEn || "Indian Model Face");
      formData.append("nameTe", uploadForm.nameTe || "భారతీయ మోడల్ ముఖం");
      formData.append("genderTarget", uploadForm.genderTarget);
      formData.append(
        "promptDirective",
        uploadForm.promptDirective ||
          `authentic ${uploadForm.genderTarget === "female" ? "South Indian female" : "Indian male"} model face, clear features, friendly expression, natural skin tone`
      );
      formData.append("metadata", JSON.stringify({ ageGroup: uploadForm.ageGroup, source: "supabase_storage" }));

      const newFace = await uploadAdminFaceApi(formData);
      setFaces((prev) => [...prev, newFace]);
      setIsUploadOpen(false);
      setUploadFile(null);
      setUploadPreview(null);
      showToast(isEn ? "Model face uploaded to Supabase Storage!" : "మోడల్ ముఖం స్టోరేజ్‌కి అప్‌లోడ్ చేయబడింది!");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to upload model face");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerReplacePhoto = (faceId: string) => {
    setReplacingFaceId(faceId);
    replaceFileInputRef.current?.click();
  };

  const handleReplacePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingFaceId) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const updated = await replaceAdminFacePhotoApi(replacingFaceId, formData);
      setFaces((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      showToast(isEn ? "Photo replaced in Supabase Storage" : "ఫోటో విజయవంతంగా మార్చబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to replace photo");
    } finally {
      setReplacingFaceId(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";
    }
  };

  const handleDeleteFace = async (id: string) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete face '${id}'?` : `'${id}' ని తొలగించాలనుకుంటున్నారా?`)) {
      return;
    }

    try {
      await deleteAdminFaceApi(id);
      setFaces((prev) => prev.filter((f) => f.id !== id));
      showToast(isEn ? "Model face deleted" : "మోడల్ ముఖం తొలగించబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete face");
    }
  };

  const handleSaveDirectiveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFace) return;

    try {
      const updated = await updateAdminPresetApi(editingFace.id, {
        nameEn: editingFace.nameEn,
        nameTe: editingFace.nameTe,
        promptDirective: editingFace.promptDirective,
      });
      setFaces((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      setEditingFace(null);
      showToast(isEn ? "Prompt directive saved" : "ప్రాంప్ట్ సూచన సేవ్ చేయబడింది");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update face");
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredFaces = faces.filter((f) => {
    const faceGender = f.genderTarget || (f.metadata as any)?.gender;
    if (genderFilter !== "all" && faceGender !== genderFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.id.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.nameTe.toLowerCase().includes(q) ||
        f.promptDirective.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input for Replace Photo */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplacePhotoFile}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:smile" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Human Model Faces & Supabase Storage" : "మోడల్ ముఖాలు & స్టోరేజ్ మేనేజర్"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "All model faces are stored in the Supabase Storage 'model-faces' bucket with public CDN URLs."
              : "అన్ని మోడల్ ముఖాలు సుపాబేస్ స్టోరేజ్ 'model-faces' బకెట్‌లో భద్రపరచబడి పబ్లిక్ CDN తో పనిచేస్తాయి."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadFaces}
            disabled={isLoading}
            className="m3-btn-outlined px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:refresh-cw" className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isEn ? "Refresh" : "తాజాకరించు"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadFile(null);
              setUploadPreview(null);
              setUploadForm({
                id: "",
                nameEn: "",
                nameTe: "",
                genderTarget: "female",
                promptDirective: "authentic Indian female model face, expressive smile, clear facial contours, glowing skin",
                ageGroup: "20s",
              });
              setIsUploadOpen(true);
            }}
            className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:upload" className="w-4 h-4" />
            <span>{isEn ? "Upload Face" : "ఫోటో అప్‌లోడ్"}</span>
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
      <div className="m3-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Gender Filter Chips */}
        <div className="flex p-0.5 rounded-full bg-[var(--md-surface-container)] text-xs font-bold">
          {(["all", "female", "male"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenderFilter(g)}
              className={`px-4 py-1 rounded-full capitalize cursor-pointer transition-all ${
                genderFilter === g
                  ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                  : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
              }`}
            >
              {g === "all" ? (isEn ? "All Faces" : "అన్నీ") : g}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-[var(--md-outline)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search faces by name or id..." : "ముఖాలను వెతకండి..."}
            className="m3-text-field w-full pl-9 pr-3 py-1.5 text-xs font-bold"
          />
        </div>
      </div>

      {/* Faces Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-[var(--md-outline)] flex items-center justify-center gap-2">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[var(--md-primary)]" />
          <span>{isEn ? "Loading faces from storage..." : "ముఖాలు లోడ్ అవుతున్నాయి..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredFaces.map((face) => (
            <div
              key={face.id}
              className="m3-card overflow-hidden group flex flex-col justify-between hover:shadow-md transition-all"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-[3/4] w-full bg-[var(--md-surface-container)] overflow-hidden">
                <img
                  src={face.thumbnailUrl || `/faces/${face.id}.jpg`}
                  alt={face.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to local public/faces
                    (e.target as HTMLImageElement).src = `/faces/${face.id}.jpg`;
                  }}
                />

                {/* Gender Badge */}
                <span
                  className={`absolute top-2 left-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    face.genderTarget === "female"
                      ? "bg-rose-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {face.genderTarget}
                </span>

                {/* Quick Replace Overlay Button */}
                <button
                  type="button"
                  onClick={() => triggerReplacePhoto(face.id)}
                  title="Replace Photo File"
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Face Info */}
              <div className="p-2.5 space-y-1.5">
                <div>
                  <h4 className="text-xs font-black text-[var(--md-on-surface)] truncate">
                    {isEn ? face.nameEn : face.nameTe}
                  </h4>
                  <span className="font-mono text-[9px] text-[var(--md-outline)] truncate block">
                    {face.id}
                  </span>
                </div>

                <p className="text-[10px] text-[var(--md-on-surface-variant)] line-clamp-2 leading-tight opacity-80">
                  {face.promptDirective}
                </p>

                {/* Actions */}
                <div className="pt-2 border-t border-[var(--md-outline-variant)] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingFace(face)}
                    className="text-[10px] text-[var(--md-primary)] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="lucide:pencil" className="w-3 h-3" />
                    <span>{isEn ? "Edit" : "సవరణ"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFace(face.id)}
                    className="p-1 rounded-full text-[var(--md-error)] hover:bg-[var(--md-error-container)] transition-colors cursor-pointer"
                    title="Delete Face"
                  >
                    <Icon icon="lucide:trash-2" className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Face to Supabase Storage Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <h3 className="text-base font-black text-[var(--md-on-surface)] flex items-center gap-2">
                <Icon icon="lucide:upload-cloud" className="w-5 h-5 text-[var(--md-primary)]" />
                <span>{isEn ? "Upload Model Face to Supabase Bucket" : "సుపాబేస్ బకెట్‌కి ముఖాన్ని అప్‌లోడ్ చేయండి"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[var(--md-surface-variant)] flex items-center justify-center text-[var(--md-outline)] cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => document.getElementById("face-upload-input")?.click()}
                className="border-2 border-dashed border-[var(--md-outline-variant)] rounded-2xl p-6 text-center hover:border-[var(--md-primary)] transition-colors cursor-pointer bg-[var(--md-surface-container)]"
              >
                <input
                  id="face-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                  className="hidden"
                />

                {uploadPreview ? (
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-20 h-24 object-cover rounded-xl shadow-md border border-[var(--md-outline-variant)]"
                    />
                    <div className="text-left text-xs">
                      <span className="font-bold text-[var(--md-on-surface)] block truncate max-w-xs">
                        {uploadFile?.name}
                      </span>
                      <span className="text-[10px] text-[var(--md-outline)] block">
                        {(uploadFile?.size || 0) / 1024 > 1024
                          ? `${((uploadFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB`
                          : `${Math.round((uploadFile?.size || 0) / 1024)} KB`}
                      </span>
                      <span className="text-[10px] text-[var(--md-primary)] font-bold mt-1 inline-block">
                        Click to change photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Icon icon="lucide:image-plus" className="w-8 h-8 mx-auto text-[var(--md-primary)]" />
                    <span className="text-xs font-bold text-[var(--md-on-surface)] block">
                      {isEn ? "Drag & drop or click to upload photo" : "ఫోటోను ఇక్కడ వేయండి లేదా క్లిక్ చేయండి"}
                    </span>
                    <span className="text-[10px] text-[var(--md-outline)] block">
                      JPG, PNG or WebP up to 10MB
                    </span>
                  </div>
                )}
              </div>

              {/* Form Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Unique Identifier ID</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.id}
                    onChange={(e) => setUploadForm({ ...uploadForm, id: e.target.value })}
                    placeholder="female_face_73"
                    className="m3-text-field w-full px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Gender Target</label>
                  <select
                    value={uploadForm.genderTarget}
                    onChange={(e) => setUploadForm({ ...uploadForm, genderTarget: e.target.value as any })}
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Label (English)</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.nameEn}
                    onChange={(e) => setUploadForm({ ...uploadForm, nameEn: e.target.value })}
                    placeholder="Ananya - South Indian"
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--md-on-surface)]">Label (Telugu)</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.nameTe}
                    onChange={(e) => setUploadForm({ ...uploadForm, nameTe: e.target.value })}
                    placeholder="అనన్య - దక్షిణాది ముఖం"
                    className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">Face Prompt Directive</label>
                <textarea
                  rows={3}
                  required
                  value={uploadForm.promptDirective}
                  onChange={(e) => setUploadForm({ ...uploadForm, promptDirective: e.target.value })}
                  placeholder="e.g. authentic South Indian female model face, radiant smile, high cheekbones, clear skin..."
                  className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--md-outline-variant)]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="m3-btn-text px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
                >
                  {isEn ? "Cancel" : "రద్దు"}
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="m3-btn-filled px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? "Uploading to Bucket..." : isEn ? "Upload Face" : "అప్‌లోడ్ చేయండి"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Face Directive Modal */}
      {editingFace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <h3 className="text-sm font-black text-[var(--md-on-surface)]">
                {isEn ? `Edit Prompt Directive: ${editingFace.id}` : `ప్రాంప్ట్ సూచన సవరణ`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFace(null)}
                className="w-7 h-7 rounded-full hover:bg-[var(--md-surface-variant)] flex items-center justify-center text-[var(--md-outline)] cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDirectiveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (English)</label>
                <input
                  type="text"
                  required
                  value={editingFace.nameEn}
                  onChange={(e) => setEditingFace({ ...editingFace, nameEn: e.target.value })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">Name (Telugu)</label>
                <input
                  type="text"
                  required
                  value={editingFace.nameTe}
                  onChange={(e) => setEditingFace({ ...editingFace, nameTe: e.target.value })}
                  className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">Prompt Directive</label>
                <textarea
                  rows={4}
                  required
                  value={editingFace.promptDirective}
                  onChange={(e) => setEditingFace({ ...editingFace, promptDirective: e.target.value })}
                  className="m3-text-field w-full p-2.5 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--md-outline-variant)]">
                <button
                  type="button"
                  onClick={() => setEditingFace(null)}
                  className="m3-btn-text px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
                >
                  {isEn ? "Cancel" : "రద్దు"}
                </button>
                <button
                  type="submit"
                  className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer"
                >
                  {isEn ? "Save Changes" : "సేవ్ చేయండి"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
