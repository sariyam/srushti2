/**
 * Reusable utility functions for client-side image processing,
 * compression, downloading, and sharing.
 */

/**
 * Compresses an uploaded image file to a maximum dimension while maintaining aspect ratio.
 * Returns a Promise resolving to a base64 encoded JPEG string.
 */
export function compressImage(file: File, maxDim: number = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.9)); // 90% quality JPEG compression
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an image download filename matching the pattern:
 * srtushtiAi_[SelectedBusinessType]_[datetimeampm].png
 * 
 * Example:
 * srtushtiAi_Garment_2026-09-10_01-45-20pm.png or srtushtiAi_Garment_Saree_2026-09-10_01-45-20pm.png
 */
export function generateSrushtiFileName(
  businessType: string = "Garment",
  subType?: string,
  ext: string = "png"
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  let hours = now.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(now.getMinutes()).padStart(2, "0");
  const secondsStr = String(now.getSeconds()).padStart(2, "0");

  const datetimeampm = `${year}-${month}-${day}_${hoursStr}-${minutesStr}-${secondsStr}${ampm}`;

  // Format business type e.g. "Garment" or "Jewelry"
  let cleanBusiness = businessType
    ? businessType.charAt(0).toUpperCase() + businessType.slice(1)
    : "Garment";

  if (subType) {
    const cleanSub = subType.charAt(0).toUpperCase() + subType.slice(1);
    cleanBusiness = `${cleanBusiness}_${cleanSub}`;
  }

  // Remove any spaces or unsupported characters
  cleanBusiness = cleanBusiness.replace(/[^a-zA-Z0-9_]/g, "_");

  return `srtushtiAi_${cleanBusiness}_${datetimeampm}.${ext}`;
}

/**
 * Triggers a native system image file download in the browser.
 */
export async function downloadImage(src: string, filename: string): Promise<void> {
  try {
    // If it's already a base64 data URL or a blob URL, we can download it directly.
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      const link = document.createElement("a");
      link.href = src;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For cross-origin/external HTTP URLs, fetch as a blob first to bypass CORS restrictions on download attribute
    const response = await fetch(src, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL after a short timeout to make sure browser completes action
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (err) {
    console.error("Blob download failed, falling back to direct link in new tab", err);
    // Fallback: direct download link, but open in a new tab so we don't navigate away from the current app state!
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Shares an image via Web Share API if supported, or falls back to custom handler.
 */
export async function shareImage(
  src: string,
  title: string,
  text: string,
  onFallback: () => void
): Promise<void> {
  if (navigator.share) {
    try {
      let fileToShare: File | null = null;
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const extension = blob.type.split("/")[1] || "png";
        fileToShare = new File([blob], `generated-photo.${extension}`, { type: blob.type });
      } catch (e) {
        console.error("Could not fetch blob to share file", e);
      }

      if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        await navigator.share({
          files: [fileToShare],
          title,
          text,
        });
        return;
      } else {
        await navigator.share({
          title,
          text,
          url: src.startsWith("data:") ? window.location.href : src,
        });
        return;
      }
    } catch (err) {
      console.error("Web share failed", err);
      onFallback();
    }
  } else {
    onFallback();
  }
}
