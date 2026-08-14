import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";

const Eye = (props: any) => <Icon icon="lucide:eye" {...props} />;
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const Camera = (props: any) => <Icon icon="lucide:camera" {...props} />;
const Upload = (props: any) => <Icon icon="lucide:upload" {...props} />;
const Trash2 = (props: any) => <Icon icon="lucide:trash-2" {...props} />;
const Download = (props: any) => <Icon icon="lucide:download" {...props} />;
const Share2 = (props: any) => <Icon icon="lucide:share-2" {...props} />;
const AlertTriangle = (props: any) => <Icon icon="lucide:triangle-alert" {...props} />;
const CloseIcon = (props: any) => <Icon icon="lucide:x" {...props} />;
const ZoomIn = (props: any) => <Icon icon="lucide:zoom-in" {...props} />;
const ZoomOut = (props: any) => <Icon icon="lucide:zoom-out" {...props} />;
const RotateCcw = (props: any) => <Icon icon="lucide:rotate-ccw" {...props} />;
const ImageIcon = (props: any) => <Icon icon="lucide:image" {...props} />;
const CopyIcon = (props: any) => <Icon icon="lucide:copy" {...props} />;
const CheckIcon = (props: any) => <Icon icon="lucide:check" {...props} />;
const CropIcon = (props: any) => <Icon icon="lucide:crop" {...props} />;
const MoveIcon = (props: any) => <Icon icon="lucide:move" {...props} />;
const EditIcon = (props: any) => <Icon icon="lucide:pencil" {...props} />;

interface PreviewStageProps {
  originalImage: string | null;
  generatedImage: string | null;
  activePreviewTab: "original" | "generated";
  setActivePreviewTab: (tab: "original" | "generated") => void;
  isGenerating: boolean;
  loadingStep: number;
  lang: "en" | "te";
  t: any;
  onPhotoSelection: (file: File) => void;
  onClearCanvas: () => void;
  onGenerate: () => void;
  onDownload: () => void;
  onShare: () => void;
  onUpdateOriginalImage?: (croppedImage: string) => void;
  generationError: string | null;
  aspectRatio?: string;
  debugPayload?: any;
}

const CROP_RATIOS = [
  { id: "3:2", labelEn: "3:2 Landscape", labelTe: "3:2 ల్యాండ్‌స్కేప్", ratio: 3 / 2 },
  { id: "2:3", labelEn: "2:3 Portrait", labelTe: "2:3 పోర్ట్రెయిట్", ratio: 2 / 3 },
  { id: "16:9", labelEn: "16:9 Wide", labelTe: "16:9 వైడ్", ratio: 16 / 9 },
  { id: "9:16", labelEn: "9:16 Story", labelTe: "9:16 రీల్/స్టోరీ", ratio: 9 / 16 },
  { id: "4:3", labelEn: "4:3 Standard", labelTe: "4:3 స్టాండర్డ్", ratio: 4 / 3 },
  { id: "3:4", labelEn: "3:4 Vertical", labelTe: "3:4 వర్టికల్", ratio: 3 / 4 },
  { id: "1:1", labelEn: "1:1 Square", labelTe: "1:1 స్క్వేర్", ratio: 1.0 }
] as const;

export const PreviewStage: React.FC<PreviewStageProps> = ({
  originalImage,
  generatedImage,
  activePreviewTab,
  setActivePreviewTab,
  isGenerating,
  lang,
  t,
  onPhotoSelection,
  onClearCanvas,
  onGenerate,
  onDownload,
  onShare,
  onUpdateOriginalImage,
  generationError,
  aspectRatio = "1:1",
  debugPayload,
  ...rest
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement>(null);

  const [copied, setCopied] = React.useState(false);

  // Photo viewer & Lightbox states
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [viewerMode, setViewerMode] = React.useState<"zoom" | "crop">("zoom");

  // Zoom & Pan states
  const [viewerScale, setViewerScale] = React.useState(1);
  const [viewerPosition, setViewerPosition] = React.useState({ x: 0, y: 0 });
  const [isDraggingViewer, setIsDraggingViewer] = React.useState(false);

  // Crop & Frame states
  const [cropAspectRatio, setCropAspectRatio] = React.useState<string>("3:2");
  const [cropScale, setCropScale] = React.useState<number>(85); // % of max fitting container
  const [cropPosition, setCropPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = React.useState(false);
  const [cropToast, setCropToast] = React.useState(false);
  const [croppedResult, setCroppedResult] = React.useState<string | null>(null);

  const cropImgRef = useRef<HTMLImageElement>(null);
  const cropDragStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number }>({
    pointerX: 0,
    pointerY: 0,
    startX: 0,
    startY: 0
  });

  const viewerDragStart = useRef({ x: 0, y: 0 });
  const viewerInitialTouchDistance = useRef<number | null>(null);
  const viewerInitialScale = useRef<number>(1);

  const handleViewerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomIntensity = 0.15;
    let nextScale = viewerScale + (e.deltaY < 0 ? zoomIntensity : -zoomIntensity);
    nextScale = Math.max(1, Math.min(6, nextScale));
    setViewerScale(nextScale);
    if (nextScale === 1) {
      setViewerPosition({ x: 0, y: 0 });
    }
  };

  const getViewerTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleViewerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = getViewerTouchDistance(e.touches);
      viewerInitialTouchDistance.current = dist;
      viewerInitialScale.current = viewerScale;
    } else if (e.touches.length === 1) {
      setIsDraggingViewer(true);
      viewerDragStart.current = {
        x: e.touches[0].clientX - viewerPosition.x,
        y: e.touches[0].clientY - viewerPosition.y
      };
    }
  };

  const handleViewerTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && viewerInitialTouchDistance.current !== null) {
      e.preventDefault();
      const dist = getViewerTouchDistance(e.touches);
      const factor = dist / viewerInitialTouchDistance.current;
      let nextScale = viewerInitialScale.current * factor;
      nextScale = Math.max(1, Math.min(6, nextScale));
      setViewerScale(nextScale);
      if (nextScale === 1) {
        setViewerPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDraggingViewer) {
      e.preventDefault();
      if (viewerScale > 1) {
        const nextX = e.touches[0].clientX - viewerDragStart.current.x;
        const nextY = e.touches[0].clientY - viewerDragStart.current.y;
        const maxDragX = (viewerScale - 1) * 200;
        const maxDragY = (viewerScale - 1) * 250;
        setViewerPosition({
          x: Math.max(-maxDragX, Math.min(maxDragX, nextX)),
          y: Math.max(-maxDragY, Math.min(maxDragY, nextY))
        });
      }
    }
  };

  const handleViewerTouchEnd = () => {
    viewerInitialTouchDistance.current = null;
    setIsDraggingViewer(false);
  };

  const handleViewerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewerScale > 1) {
      setIsDraggingViewer(true);
      viewerDragStart.current = {
        x: e.clientX - viewerPosition.x,
        y: e.clientY - viewerPosition.y
      };
    }
  };

  const handleViewerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingViewer && viewerScale > 1) {
      const nextX = e.clientX - viewerDragStart.current.x;
      const nextY = e.clientY - viewerDragStart.current.y;
      const maxDragX = (viewerScale - 1) * 200;
      const maxDragY = (viewerScale - 1) * 250;
      setViewerPosition({
        x: Math.max(-maxDragX, Math.min(maxDragX, nextX)),
        y: Math.max(-maxDragY, Math.min(maxDragY, nextY))
      });
    }
  };

  const handleViewerMouseUp = () => {
    setIsDraggingViewer(false);
  };

  const handleViewerZoomIn = () => {
    setViewerScale(prev => Math.min(6, prev + 0.5));
  };

  const handleViewerZoomOut = () => {
    setViewerScale(prev => {
      const next = Math.max(1, prev - 0.5);
      if (next === 1) {
        setViewerPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleViewerReset = () => {
    setViewerScale(1);
    setViewerPosition({ x: 0, y: 0 });
  };

  // --- CROP CALCULATION LOGIC ---
  const getRatioValue = (ratioStr: string, imgW: number, imgH: number): number => {
    const item = CROP_RATIOS.find(r => r.id === ratioStr);
    if (item && item.ratio > 0) return item.ratio;
    return imgW > 0 && imgH > 0 ? imgW / imgH : 1.0;
  };

  const getCropBoxDimensions = (
    ratioStr: string,
    scalePercent: number,
    imgW: number,
    imgH: number
  ) => {
    if (imgW <= 0 || imgH <= 0) return { w: 100, h: 100 };
    const targetRatio = getRatioValue(ratioStr, imgW, imgH);
    const scale = Math.max(0.2, Math.min(1.0, scalePercent / 100));

    let maxW = imgW * scale;
    let maxH = maxW / targetRatio;

    if (maxH > imgH * scale) {
      maxH = imgH * scale;
      maxW = maxH * targetRatio;
    }

    if (maxW > imgW) {
      maxW = imgW;
      maxH = maxW / targetRatio;
    }
    if (maxH > imgH) {
      maxH = imgH;
      maxW = maxH * targetRatio;
    }

    return { w: Math.max(30, Math.round(maxW)), h: Math.max(30, Math.round(maxH)) };
  };

  const centerCropBox = (ratioStr: string, scalePct: number) => {
    if (!cropImgRef.current) return;
    const imgW = cropImgRef.current.clientWidth;
    const imgH = cropImgRef.current.clientHeight;
    if (imgW <= 0 || imgH <= 0) return;
    const { w, h } = getCropBoxDimensions(ratioStr, scalePct, imgW, imgH);
    setCropPosition({
      x: Math.max(0, Math.round((imgW - w) / 2)),
      y: Math.max(0, Math.round((imgH - h) / 2))
    });
  };

  const prevIsViewerOpenRef = useRef(false);
  const prevAspectRatioRef = useRef(cropAspectRatio);

  // Center crop frame on initial open or aspect ratio change
  useEffect(() => {
    const justOpened = isViewerOpen && !prevIsViewerOpenRef.current;
    const ratioChanged = isViewerOpen && cropAspectRatio !== prevAspectRatioRef.current;

    prevIsViewerOpenRef.current = isViewerOpen;
    prevAspectRatioRef.current = cropAspectRatio;

    if (justOpened || ratioChanged) {
      setTimeout(() => {
        centerCropBox(cropAspectRatio, cropScale);
      }, 50);
    }
  }, [isViewerOpen, cropAspectRatio]);

  // Handle Dragging Crop Frame Across Canvas
  const handleCropDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setIsDraggingCrop(true);
    cropDragStartRef.current = {
      pointerX: clientX,
      pointerY: clientY,
      startX: cropPosition.x,
      startY: cropPosition.y
    };
  };

  useEffect(() => {
    if (!isDraggingCrop) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!cropImgRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const imgW = cropImgRef.current.clientWidth;
      const imgH = cropImgRef.current.clientHeight;
      const { w, h } = getCropBoxDimensions(cropAspectRatio, cropScale, imgW, imgH);

      const dx = clientX - cropDragStartRef.current.pointerX;
      const dy = clientY - cropDragStartRef.current.pointerY;

      const maxX = Math.max(0, imgW - w);
      const maxY = Math.max(0, imgH - h);

      const newX = Math.max(0, Math.min(maxX, cropDragStartRef.current.startX + dx));
      const newY = Math.max(0, Math.min(maxY, cropDragStartRef.current.startY + dy));

      setCropPosition({ x: newX, y: newY });
    };

    const handlePointerEnd = () => {
      setIsDraggingCrop(false);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerEnd);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerEnd);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerEnd);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerEnd);
    };
  }, [isDraggingCrop, cropAspectRatio, cropScale]);

  // Download Image from Photo Editor
  const handleDownloadEditorImage = (dataUrl: string, fileName = "srushti-photo.jpg") => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Execute Canvas Crop
  const handleApplyCrop = () => {
    const activeSrc = (activePreviewTab === "generated" && generatedImage)
      ? generatedImage
      : originalImage;

    if (!activeSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cropImgRef.current) return;
      const dispW = cropImgRef.current.clientWidth;
      const dispH = cropImgRef.current.clientHeight;
      if (dispW <= 0 || dispH <= 0) return;

      const natW = img.naturalWidth;
      const natH = img.naturalHeight;

      const { w: boxW, h: boxH } = getCropBoxDimensions(cropAspectRatio, cropScale, dispW, dispH);

      const scaleX = natW / dispW;
      const scaleY = natH / dispH;

      const cropX = Math.max(0, Math.round(cropPosition.x * scaleX));
      const cropY = Math.max(0, Math.round(cropPosition.y * scaleY));
      const cropW = Math.min(natW - cropX, Math.round(boxW * scaleX));
      const cropH = Math.min(natH - cropY, Math.round(boxH * scaleY));

      if (cropW <= 0 || cropH <= 0) return;

      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const croppedBase64 = canvas.toDataURL("image/jpeg", 0.95);
        
        // Save cropped result ONLY inside Photo Editor (Do not overwrite main frame)
        setCroppedResult(croppedBase64);

        setCropToast(true);
        setTimeout(() => setCropToast(false), 3000);

        // Switch tab automatically to "Cropped Output"
        setViewerMode("result" as any);
      }
    };
    img.src = activeSrc;
  };

  // Generate stable settings for floating magic particles
  const magicParticles = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 12 + 8, // 8px to 20px
      left: `${Math.random() * 90 + 5}%`,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2.5,
      xOffset: Math.random() * 60 - 30,
    }));
  }, []);

  let aspectClass = "aspect-square";
  if (aspectRatio === "4:3") aspectClass = "aspect-[4/3]";
  else if (aspectRatio === "16:9") aspectClass = "aspect-[16/9]";
  else if (aspectRatio === "3:4") aspectClass = "aspect-[3/4]";
  else if (aspectRatio === "9:16") aspectClass = "aspect-[9/16]";

  // Drag-and-drop drop handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPhotoSelection(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-1/2 min-h-0 lg:col-span-5 xl:col-span-5 landscape:col-span-5 flex flex-col lg:h-full landscape:h-full space-y-2 lg:space-y-4 w-full">
      <section className="flex flex-col h-full lg:h-full landscape:h-full flex-1 space-y-2 lg:space-y-4 min-h-0">
        {/* THE VISUAL STAGE CANVAS */}
        <div 
          id="stage-canvas-card"
          className={`nm-outset rounded-2xl md:rounded-[2.5rem] overflow-hidden p-2.5 relative aspect-auto lg:${aspectClass} landscape:aspect-auto flex-1 min-h-0 lg:flex-1 landscape:flex-1 flex flex-col items-center justify-center transition-all w-full`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          {/* Overlay Tabs Bar (Floating at top) */}
          {originalImage && !isGenerating && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-[var(--bg-secondary)] nm-inset-sm border border-accent/20 z-20">
              <button
                id="tab-preview-original"
                onClick={() => setActivePreviewTab("original")}
                title={t.originalLabel}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  activePreviewTab === "original" 
                    ? "nm-outset-sm text-accent scale-105 font-bold" 
                    : "text-[var(--text-primary)] opacity-65 hover:opacity-100"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
              <button
                id="tab-preview-final"
                onClick={() => setActivePreviewTab("generated")}
                disabled={!generatedImage}
                title={t.finalLabel}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center disabled:opacity-40 cursor-pointer ${
                  activePreviewTab === "generated" 
                    ? "nm-outset-sm text-accent scale-105 font-bold" 
                    : "text-[var(--text-primary)] opacity-65 hover:opacity-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Upload Prompt Zone */}
            {!originalImage ? (
              <motion.div 
                key="stage-upload-prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-[2rem]"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[var(--text-emphasis)]">
                    {t.uploadTitle}
                  </h3>
                  <p className="text-xs opacity-70 px-4">
                    {t.uploadSubtitle}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 mt-3">
                  {/* Select Image from Camera */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                      className="w-14 h-14 rounded-full nm-outset flex items-center justify-center text-[var(--text-emphasis)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      title={lang === "en" ? "Camera" : "కెమెరా"}
                    >
                      <Camera className="w-5 h-5 text-accent" />
                    </button>
                    <span className="text-[10px] font-bold opacity-85">
                      {lang === "en" ? "Camera" : "కెమెరా"}
                    </span>
                  </div>

                  {/* Select Image from Gallery */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        galleryInputRef.current?.click();
                      }}
                      className="w-14 h-14 rounded-full nm-outset flex items-center justify-center text-[var(--text-emphasis)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      title={lang === "en" ? "Gallery" : "గ్యాలరీ"}
                    >
                      <Upload className="w-5 h-5 text-accent" />
                    </button>
                    <span className="text-[10px] font-bold opacity-85">
                      {lang === "en" ? "Gallery" : "గ్యాలరీ"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Active Preview Rendering
              <motion.div
                key="stage-preview-active"
                className="relative w-full h-full flex items-center justify-center rounded-[2rem] overflow-hidden bg-[var(--bg-secondary)]/50"
              >
                {/* Original Image Layer */}
                <motion.div
                  animate={{
                    opacity: isGenerating 
                      ? 0.15 
                      : (activePreviewTab === "original" ? 1 : 0),
                    filter: isGenerating 
                      ? "blur(16px)" 
                      : (activePreviewTab === "original" ? "blur(0px)" : "blur(16px)"),
                    scale: isGenerating 
                      ? 0.95 
                      : (activePreviewTab === "original" ? 1 : 0.95),
                  }}
                  transition={{
                    duration: isGenerating ? 4.0 : 0.6,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center p-2"
                >
                  <img 
                    ref={imagePreviewRef}
                    src={originalImage} 
                    alt="Original product" 
                    className="max-h-full max-w-full object-contain rounded-[2rem]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Generated Image Layer */}
                {generatedImage && (
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
                    animate={{
                      opacity: isGenerating 
                        ? 0 
                        : (activePreviewTab === "generated" ? 1 : 0),
                      filter: isGenerating 
                        ? "blur(12px)" 
                        : (activePreviewTab === "generated" ? "blur(0px)" : "blur(12px)"),
                      scale: isGenerating 
                        ? 0.95 
                        : (activePreviewTab === "generated" ? 1 : 0.95),
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 flex items-center justify-center p-2"
                  >
                    <img 
                      src={generatedImage} 
                      alt="Generated product photography" 
                      className="max-h-full max-w-full object-contain rounded-[2rem] transition-transform hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}

                {/* Optional Sparkle spinner on generated tab if image not loaded yet and not generating */}
                {!isGenerating && activePreviewTab === "generated" && !generatedImage && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center z-10 bg-[var(--bg-secondary)] rounded-[2rem]">
                    <div className="space-y-2">
                      <Sparkles className="w-8 h-8 mx-auto text-accent animate-spin" />
                      <p className="text-xs opacity-60">Generate with choices below to see AI photo</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay Action Buttons (Floating at bottom: Save, Share, Crop, Delete) */}
          {originalImage && !isGenerating && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              {activePreviewTab === "generated" && generatedImage && (
                <>
                  <button
                    id="btn-download-output-overlay"
                    onClick={onDownload}
                    className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-115 active:scale-95 border border-accent/30 text-accent cursor-pointer nm-outset-sm"
                    title={lang === "en" ? "Save to Phone" : "ఫోన్‌లో సేవ్ చేయండి"}
                  >
                    <Download className="w-4 h-4 text-accent" />
                  </button>
                  <button
                    id="btn-share-output-overlay"
                    onClick={onShare}
                    className="md:hidden w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-115 active:scale-95 border border-accent/30 text-accent cursor-pointer nm-outset-sm"
                    title={lang === "en" ? "Share Photo" : "ఫోటో షేర్ చేయండి"}
                  >
                    <Share2 className="w-4 h-4 text-accent" />
                  </button>
                </>
              )}
              {/* Single Edit Icon Button (Photo Editor) */}
              <button
                id="btn-open-photo-editor"
                onClick={() => {
                  setIsViewerOpen(true);
                  setViewerMode("crop");
                }}
                className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-115 active:scale-95 border border-accent/30 text-accent cursor-pointer nm-outset-sm"
                title={lang === "en" ? "Photo Editor & Cropper" : "ఫోటో ఎడిటర్"}
              >
                <EditIcon className="w-4 h-4 text-accent" />
              </button>
              {debugPayload && (
                <button
                  id="btn-copy-payload"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(debugPayload, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-115 active:scale-95 border border-accent/30 text-accent cursor-pointer nm-outset-sm animate-bounce"
                  title={lang === "en" ? "Copy API Payload" : "ఏపిఐ పేలోడ్ కాపీ చేయండి"}
                >
                  {copied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <CopyIcon className="w-4 h-4 text-accent" />}
                </button>
              )}
              <button
                id="btn-clear-canvas"
                onClick={onClearCanvas}
                className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-115 active:scale-95 border border-accent/30 text-accent cursor-pointer nm-outset-sm"
                title={lang === "en" ? "Delete / Clear Photo" : "ఫోటోను తొలగించండి"}
              >
                <Trash2 className="w-4 h-4 text-accent" />
              </button>
            </div>
          )}

          {/* Hidden input elements */}
          <input 
            type="file" 
            ref={cameraInputRef} 
            accept="image/*" 
            capture="environment"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onPhotoSelection(e.target.files[0]);
              }
            }}
            className="hidden" 
          />
          <input 
            type="file" 
            ref={galleryInputRef} 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onPhotoSelection(e.target.files[0]);
              }
            }}
            className="hidden" 
          />
        </div>

        {/* FULLSCREEN PHOTO VIEWER & CROPPER MODAL */}
        <AnimatePresence>
          {isViewerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-[var(--bg-primary)]/95 dark:bg-[var(--bg-primary)]/98 text-[var(--text-primary)] backdrop-blur-lg flex flex-col select-none overflow-hidden touch-none"
            >
              {/* Photo Editor Header Bar with Left Edge Close Button */}
              <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--shadow-dark)]/20 z-10 bg-[var(--bg-secondary)]/90 backdrop-blur-sm gap-3">
                {/* Left: Close Icon (X) + Main Header Title */}
                <div className="flex items-center gap-3">
                  <button
                    id="btn-close-lightbox"
                    onClick={() => {
                      setIsViewerOpen(false);
                      handleViewerReset();
                    }}
                    className="w-8 h-8 rounded-full nm-outset-sm text-[var(--text-emphasis)] hover:text-accent flex items-center justify-center transition-all cursor-pointer border border-[var(--shadow-dark)]/20 shrink-0"
                    title={lang === "en" ? "Close" : "మూసివేయి"}
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                  <div className="space-y-0.5">
                    <h3 className="text-[var(--text-emphasis)] text-sm font-extrabold tracking-wide flex items-center gap-2">
                      <span>{lang === "en" ? "Srushti AI Photo Studio" : "సృష్టి AI ఫోటో స్టూడియో"}</span>
                      {cropToast && (
                        <span className="text-xs bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
                          {lang === "en" ? "Cropped Successfully!" : "క్రాప్ చేయబడింది!"}
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-80">
                      {viewerMode === "zoom"
                        ? (lang === "en" ? "Pinch / Scroll to Zoom • Drag to Move" : "జూమ్ చేయడానికి పించ్ లేదా స్క్రోల్ చేయండి")
                        : viewerMode === "crop"
                        ? (lang === "en" ? "Select Ratio • Drag Frame to Crop Photo" : "క్రాప్ నిష్పత్తి ఎంచుకోండి • ఫ్రేమ్‌ను జరపండి")
                        : (lang === "en" ? "Cropped Photo Output Preview" : "క్రాప్ చేసిన ఫోటో అవుట్‌పుట్")}
                    </p>
                  </div>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="flex items-center gap-1 bg-[var(--bg-secondary)] nm-inset-sm p-1 rounded-xl border border-[var(--shadow-dark)]/20">
                  <button
                    id="btn-mode-zoom"
                    onClick={() => setViewerMode("zoom")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewerMode === "zoom"
                        ? "bg-accent text-white shadow-lg scale-105"
                        : "text-[var(--text-primary)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Zoom View" : "జూమ్ వ్యూ"}</span>
                  </button>
                  <button
                    id="btn-mode-crop"
                    onClick={() => {
                      setViewerMode("crop");
                      setTimeout(() => centerCropBox(cropAspectRatio, cropScale), 50);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewerMode === "crop"
                        ? "bg-accent text-white shadow-lg scale-105"
                        : "text-[var(--text-primary)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <CropIcon className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Crop Frame" : "క్రాప్ ఫ్రేమ్"}</span>
                  </button>
                  {croppedResult && (
                    <button
                      id="btn-mode-result"
                      onClick={() => setViewerMode("result" as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        (viewerMode as string) === "result"
                          ? "bg-accent text-white shadow-lg scale-105"
                          : "text-accent bg-accent/10 hover:bg-accent/20"
                      }`}
                    >
                      <CheckIcon className={`w-3.5 h-3.5 ${(viewerMode as string) === "result" ? "text-white" : "text-accent"}`} />
                      <span>{lang === "en" ? "Cropped Output" : "క్రాప్ ఫోటో"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* MODE 1: ZOOM & PAN LIGHTBOX VIEW */}
              {viewerMode === "zoom" ? (
                <>
                  <div
                    className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden p-4"
                    onWheel={handleViewerWheel}
                    onTouchStart={handleViewerTouchStart}
                    onTouchMove={handleViewerTouchMove}
                    onTouchEnd={handleViewerTouchEnd}
                    onMouseDown={handleViewerMouseDown}
                    onMouseMove={handleViewerMouseMove}
                    onMouseUp={handleViewerMouseUp}
                    onMouseLeave={handleViewerMouseUp}
                  >
                    <div 
                      className="relative max-w-full max-h-[75vh] flex items-center justify-center transition-transform duration-75 ease-out"
                      style={{
                        transform: `translate(${viewerPosition.x}px, ${viewerPosition.y}px) scale(${viewerScale})`,
                        cursor: viewerScale > 1 ? (isDraggingViewer ? "grabbing" : "grab") : "zoom-in",
                      }}
                    >
                      <img
                        src={(activePreviewTab === "generated" && generatedImage) ? generatedImage : (originalImage || "")}
                        alt="Product Zoom View"
                        className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl pointer-events-none border border-[var(--shadow-dark)]/30"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Footer Bar for Zoom Controls */}
                  <div className="p-4 border-t border-[var(--shadow-dark)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 bg-[var(--bg-secondary)]/90 backdrop-blur-sm">
                    <div className="text-center sm:text-left space-y-0.5">
                      <p className="text-xs font-medium text-[var(--text-primary)]">
                        {lang === "en" 
                          ? "Pinch / Scroll to Zoom • Drag to Move Photo" 
                          : "జూమ్ చేయడానికి పించ్ లేదా స్క్రోల్ చేయండి • జరపడానికి లాగండి"}
                      </p>
                      <p className="text-[11px] text-accent font-mono font-bold tracking-wider">
                        {viewerScale.toFixed(2)}x {lang === "en" ? "Magnification" : "మాగ్నిఫికేషన్"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="btn-lightbox-zoom-out"
                        onClick={handleViewerZoomOut}
                        disabled={viewerScale <= 1}
                        className="w-10 h-10 rounded-xl nm-outset-sm text-[var(--text-primary)] disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer border border-[var(--shadow-dark)]/20"
                        title={lang === "en" ? "Zoom Out" : "జూమ్ తగ్గించండి"}
                      >
                        <ZoomOut className="w-5 h-5" />
                      </button>
                      <button
                        id="btn-lightbox-zoom-in"
                        onClick={handleViewerZoomIn}
                        disabled={viewerScale >= 6}
                        className="w-10 h-10 rounded-xl nm-outset-sm text-[var(--text-primary)] disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer border border-[var(--shadow-dark)]/20"
                        title={lang === "en" ? "Zoom In" : "జూమ్ పెంచండి"}
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button
                        id="btn-lightbox-reset"
                        onClick={handleViewerReset}
                        className="w-10 h-10 rounded-xl nm-outset-sm text-[var(--text-primary)] flex items-center justify-center transition-all cursor-pointer border border-[var(--shadow-dark)]/20"
                        title={lang === "en" ? "Reset View" : "రీసెట్"}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (viewerMode as string) === "result" && croppedResult ? (
                /* MODE 3: CROPPED RESULT PREVIEW VIEW */
                <div className="flex-1 w-full h-full flex flex-col justify-between overflow-hidden p-4">
                  <div className="flex-1 w-full h-full flex items-center justify-center p-4">
                    <img
                      src={croppedResult}
                      alt="Cropped Output"
                      className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border-2 border-accent/50"
                    />
                  </div>
                  <div className="p-4 border-t border-[var(--shadow-dark)]/20 flex items-center justify-end bg-[var(--bg-secondary)]/90 backdrop-blur-sm rounded-2xl">
                    <button
                      id="btn-download-cropped-output-view"
                      onClick={() => handleDownloadEditorImage(croppedResult, "srushti-cropped-photo.jpg")}
                      className="px-6 py-2.5 rounded-xl nm-outset text-accent hover:text-accent font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer border border-accent/40 hover:scale-105 active:scale-95"
                    >
                      <Download className="w-4 h-4 text-accent" />
                      <span>{lang === "en" ? "Download Cropped Image" : "క్రాప్ ఫోటో డౌన్‌లోడ్"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* MODE 2: CROP & FRAME TOOL */
                <div className="flex-1 w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4">
                  {/* Aspect Ratio Selector Pills */}
                  <div className="w-full flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 py-2 px-1 z-10 border-b border-[var(--shadow-dark)]/20 pb-3 max-h-32 overflow-y-auto shrink-0">
                    {CROP_RATIOS.map((ratioObj) => {
                      const isActive = cropAspectRatio === ratioObj.id;
                      return (
                        <button
                          key={ratioObj.id}
                          id={`btn-crop-ratio-${ratioObj.id.replace(":", "-")}`}
                          onClick={() => {
                            setCropAspectRatio(ratioObj.id);
                            setTimeout(() => centerCropBox(ratioObj.id, cropScale), 30);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold text-center leading-tight break-words transition-all cursor-pointer border ${
                            isActive
                              ? "bg-accent text-white border-accent shadow-lg scale-105"
                              : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--shadow-dark)]/20 hover:border-accent/40 nm-outset-sm"
                          }`}
                        >
                          {lang === "en" ? ratioObj.labelEn : ratioObj.labelTe}
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Crop Frame Canvas */}
                  <div className="flex-1 w-full h-full flex items-center justify-center relative my-2 overflow-hidden select-none">
                    <div className="relative max-w-full max-h-[60vh] flex items-center justify-center border border-[var(--shadow-dark)]/30 rounded-xl overflow-hidden shadow-2xl bg-[var(--bg-secondary)]">
                      <img
                        ref={cropImgRef}
                        src={(activePreviewTab === "generated" && generatedImage) ? generatedImage : (originalImage || "")}
                        alt="Crop Source"
                        onLoad={() => centerCropBox(cropAspectRatio, cropScale)}
                        className="max-w-full max-h-[60vh] object-contain pointer-events-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark Overlay Outside Crop Rectangle */}
                      {cropImgRef.current && (() => {
                        const imgW = cropImgRef.current.clientWidth;
                        const imgH = cropImgRef.current.clientHeight;
                        const { w: boxW, h: boxH } = getCropBoxDimensions(cropAspectRatio, cropScale, imgW, imgH);
                        const posX = Math.max(0, Math.min(imgW - boxW, cropPosition.x));
                        const posY = Math.max(0, Math.min(imgH - boxH, cropPosition.y));

                        return (
                          <>
                            {/* Top Dark Mask */}
                            <div 
                              className="absolute left-0 top-0 w-full bg-black/55 pointer-events-none" 
                              style={{ height: `${posY}px` }} 
                            />
                            {/* Bottom Dark Mask */}
                            <div 
                              className="absolute left-0 w-full bg-black/55 pointer-events-none" 
                              style={{ top: `${posY + boxH}px`, bottom: 0 }} 
                            />
                            {/* Left Dark Mask */}
                            <div 
                              className="absolute left-0 bg-black/55 pointer-events-none" 
                              style={{ top: `${posY}px`, height: `${boxH}px`, width: `${posX}px` }} 
                            />
                            {/* Right Dark Mask */}
                            <div 
                              className="absolute bg-black/55 pointer-events-none" 
                              style={{ top: `${posY}px`, height: `${boxH}px`, left: `${posX + boxW}px`, right: 0 }} 
                            />

                            {/* CROP RECTANGLE OVERLAY WITH DRAG HANDLE */}
                            <div
                              className={`absolute border-2 border-accent shadow-2xl rounded-sm cursor-move transition-shadow ${
                                isDraggingCrop ? "ring-4 ring-accent/40 shadow-accent/50 scale-[1.01]" : ""
                              }`}
                              style={{
                                left: `${posX}px`,
                                top: `${posY}px`,
                                width: `${boxW}px`,
                                height: `${boxH}px`
                              }}
                              onMouseDown={handleCropDragStart}
                              onTouchStart={handleCropDragStart}
                            >
                              {/* 3x3 Rule-of-Thirds Grid Lines */}
                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                                <div className="border-r border-b border-white/60" />
                                <div className="border-r border-b border-white/60" />
                                <div className="border-b border-white/60" />
                                <div className="border-r border-b border-white/60" />
                                <div className="border-r border-b border-white/60" />
                                <div className="border-b border-white/60" />
                                <div className="border-r border-white/60" />
                                <div className="border-r border-white/60" />
                                <div className="" />
                              </div>

                              {/* Center Drag Badge */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-slate-900/80 dark:bg-black/70 backdrop-blur-md text-white border border-accent/40 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-xl">
                                  <MoveIcon className="w-3.5 h-3.5 text-accent animate-pulse" />
                                  <span>{lang === "en" ? "Drag Move Frame" : "ఫ్రేమ్‌ను జరపండి"}</span>
                                </div>
                              </div>

                              {/* Corner Handles */}
                              <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-accent rounded-full shadow-md" />
                              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-accent rounded-full shadow-md" />
                              <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-accent rounded-full shadow-md" />
                              <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-accent rounded-full shadow-md" />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Crop Toolbar Controls */}
                  <div className="p-3 border-t border-[var(--shadow-dark)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-secondary)]/90 backdrop-blur-sm z-10 rounded-2xl">
                    {/* Scale Slider */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-xs font-bold text-[var(--text-primary)] leading-tight break-words">
                        {lang === "en" ? "Frame Size:" : "ఫ్రేమ్ సైజ్:"}
                      </span>
                      <input
                        type="range"
                        min="25"
                        max="100"
                        value={cropScale}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCropScale(val);
                          if (cropImgRef.current) {
                            const imgW = cropImgRef.current.clientWidth;
                            const imgH = cropImgRef.current.clientHeight;
                            const { w, h } = getCropBoxDimensions(cropAspectRatio, val, imgW, imgH);
                            setCropPosition(prev => ({
                              x: Math.max(0, Math.min(imgW - w, prev.x)),
                              y: Math.max(0, Math.min(imgH - h, prev.y))
                            }));
                          }
                        }}
                        className="w-32 sm:w-40 accent-accent cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-accent">
                        {cropScale}%
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        id="btn-crop-reset"
                        onClick={() => {
                          setCropScale(85);
                          setCroppedResult(null);
                          if ((viewerMode as string) === "result") {
                            setViewerMode("crop");
                          }
                          setTimeout(() => centerCropBox(cropAspectRatio, 85), 30);
                        }}
                        className="px-3.5 py-2 rounded-xl nm-outset-sm text-[var(--text-primary)] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-[var(--shadow-dark)]/20"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === "en" ? "Reset" : "రీసెట్"}</span>
                      </button>

                      <button
                        id="btn-apply-crop"
                        onClick={handleApplyCrop}
                        className="px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent/30 hover:scale-105 active:scale-95"
                      >
                        <CheckIcon className="w-4 h-4 text-white" />
                        <span>{lang === "en" ? "Apply Crop" : "క్రాప్ చేయండి"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </div>
  );
};
