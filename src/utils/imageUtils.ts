/**
 * Reusable utility functions for client-side image processing,
 * compression, chroma key background removal, downloading, and sharing.
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

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
 * Removes the background of an image locally using an anti-aliased Euclidean chroma-keying algorithm.
 * If colorKey is null, it auto-detects background color by averaging the four extreme corners.
 */
export function removeBackgroundPixels(
  imageSrc: string,
  tolerance: number,
  colorKey: ColorRGB | null
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Keep dimensions responsive and extremely fast for local calculation
      const maxDim = 600;
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

      const imgData = ctx.getImageData(0, 0, w, h);
      const pixels = imgData.data;

      // Establish target key color
      let rBg = 240, gBg = 240, bBg = 240;
      if (colorKey) {
        rBg = colorKey.r;
        gBg = colorKey.g;
        bBg = colorKey.b;
      } else {
        // Auto-detect by sampling corner pixels
        const samplePoints = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1]
        ];
        let rSum = 0, gSum = 0, bSum = 0;
        samplePoints.forEach(([sx, sy]) => {
          const index = (sy * w + sx) * 4;
          rSum += pixels[index];
          gSum += pixels[index + 1];
          bSum += pixels[index + 2];
        });
        rBg = Math.round(rSum / 4);
        gBg = Math.round(gSum / 4);
        bBg = Math.round(bSum / 4);
      }

      // Apply Euclidean color distance filter with soft feathered edge boundaries
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const dist = Math.sqrt(
          (r - rBg) * (r - rBg) +
          (g - gBg) * (g - gBg) +
          (b - bBg) * (b - bBg)
        );

        if (dist < tolerance) {
          pixels[i + 3] = 0; // Transparent
        } else if (dist < tolerance + 15) {
          // Linear feathering gradient for smooth edges
          const fraction = (dist - tolerance) / 15;
          pixels[i + 3] = Math.round(fraction * 255);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
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
