import { env, getEnv, db } from "../config";
import { users } from "../config/schema";
import { eq } from "drizzle-orm";
import { UsageService } from "./usage.service";
import { BadRequestError, PaymentRequiredError, NotFoundError } from "../utils/errors";

export interface GenerateImageServiceParams {
  userId: string;
  workspace: "garment" | "jewelry" | "face" | "general";
  itemType: string;
  requiredCredits: number;
  prompt: string;
  size?: string;
  quality?: string;
  model?: string;
  productImage: string;
  presentationMode?: string;
  faceImage?: string;
  metadata?: Record<string, any>;
}

function parseDataUrlOrBase64ToBlob(input: string, defaultMime = "image/png"): Blob {
  if (input.startsWith("data:")) {
    const match = input.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mime = match[1];
      const base64Data = match[2];
      if (typeof Buffer !== "undefined") {
        return new Blob([Buffer.from(base64Data, "base64")], { type: mime });
      }
      const bin = atob(base64Data);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        u8[i] = bin.charCodeAt(i);
      }
      return new Blob([u8], { type: mime });
    }
  }

  // Raw base64 string
  if (typeof Buffer !== "undefined") {
    return new Blob([Buffer.from(input, "base64")], { type: defaultMime });
  }
  const bin = atob(input);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    u8[i] = bin.charCodeAt(i);
  }
  return new Blob([u8], { type: defaultMime });
}

async function convertImageInputToBlob(input: string, defaultFilename: string): Promise<Blob> {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    const res = await fetch(input);
    if (!res.ok) {
      throw new BadRequestError(`Failed to fetch image reference from URL for ${defaultFilename}`);
    }
    return await res.blob();
  }
  return parseDataUrlOrBase64ToBlob(input);
}

export class AiService {
  /**
   * Secure server-side AI Image Generation using OpenAI Images Edits API.
   * Atomically checks wallet balance, calls OpenAI, records audit log, and deducts credits.
   */
  static async generateImage({
    userId,
    workspace,
    itemType,
    requiredCredits,
    prompt,
    size = "1024x1024",
    quality = "low",
    model = "gpt-image-2.5-sunburst",
    productImage,
    presentationMode,
    faceImage,
    metadata,
  }: GenerateImageServiceParams) {
    // 1. Pre-check user existence and sufficient balance before calling OpenAI
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError(`User with ID '${userId}' not found.`);
    }

    if (user.walletBalance < requiredCredits) {
      throw new PaymentRequiredError(
        `Insufficient wallet credits. You have ${user.walletBalance} credits, but ${requiredCredits} are required to generate this photoshoot.`,
        {
          availableCredits: user.walletBalance,
          requiredCredits,
          workspace,
          itemType,
        }
      );
    }

    // 2. Check OpenAI API Key on server
    const openAiApiKey = (env.OPENAI_API_KEY || getEnv("OPENAI_API_KEY") || "").trim();
    if (!openAiApiKey) {
      throw new BadRequestError(
        "OpenAI API Key is not configured on the server. Please contact administrator."
      );
    }

    // 3. Face Reference and 100% Face Identity Replication Mandate
    // Only attach face reference when in human model or partial face presentation mode
    const isModelPresentation = !presentationMode || ["model", "partial_face"].includes(presentationMode);
    const shouldAttachFace = Boolean(faceImage && faceImage.trim() && isModelPresentation);

    let activePrompt = prompt;
    if (shouldAttachFace) {
      const faceFidelityPrefix =
        `[CRITICAL MANDATE: 100% IDENTICAL FACE FIDELITY REQUIRED]\n` +
        `The second attached image ('face_reference.png') is the authoritative face reference of the human model. ` +
        `You MUST replicate the exact same person's face with 100% photographic fidelity (identical facial bone structure, eyes, iris, eyebrows, nose, lips, jawline, skin tone, and ethnic identity). ` +
        `Strictly ZERO facial morphing, ZERO generic AI face replacement, and ZERO facial altering. ` +
        `The output model MUST be unmistakably the EXACT same person as in the reference image.\n\n`;

      if (!activePrompt.includes("100% IDENTICAL FACE FIDELITY")) {
        activePrompt = faceFidelityPrefix + activePrompt;
      }
    }

    // 4. Prepare Form Data with images
    const formData = new FormData();
    formData.append("model", model || "gpt-image-2.5-sunburst");
    formData.append("prompt", activePrompt);
    formData.append("size", size || "1024x1024");
    formData.append("quality", quality || "low");
    formData.append("n", "1");

    try {
      const productBlob = await convertImageInputToBlob(productImage, "product_image.png");
      formData.append("image[]", productBlob, "product_image.png");
    } catch (err: any) {
      throw new BadRequestError(`Invalid product image payload: ${err?.message || err}`);
    }

    if (shouldAttachFace && faceImage) {
      try {
        const faceBlob = await convertImageInputToBlob(faceImage, "face_reference.png");
        formData.append("image[]", faceBlob, "face_reference.png");
      } catch (err: any) {
        console.warn("Could not process face reference image:", err);
      }
    }

    // 4. Call OpenAI API securely from server
    const openAiEndpoint = "https://api.openai.com/v1/images/edits";
    const startTime = Date.now();

    let openAiRes: Response;
    try {
      openAiRes = await fetch(openAiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: formData,
      });
    } catch (fetchErr: any) {
      throw new BadRequestError(
        `Failed to reach OpenAI service: ${fetchErr?.message || "Network error"}`
      );
    }

    const latencyMs = Date.now() - startTime;

    if (!openAiRes.ok) {
      const errJson: any = await openAiRes.json().catch(() => ({}));
      const errMsg =
        errJson?.error?.message ||
        `OpenAI API Error (${openAiRes.status}): ${openAiRes.statusText}`;

      // Record failed usage attempt without deducting credits
      await UsageService.recordUsage({
        userId,
        workspace,
        itemType,
        creditsDeducted: 0,
        prompt,
        status: "failed",
        errorMessage: errMsg,
        latencyMs,
        metadata: {
          ...metadata,
          model,
          size,
          quality,
        },
      }).catch((e) => console.warn("Failed to log failed generation audit:", e));

      throw new BadRequestError(errMsg);
    }

    const data: any = await openAiRes.json();
    let generatedImageUrl: string | null = null;
    if (data.data?.[0]?.b64_json) {
      generatedImageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
    } else if (data.data?.[0]?.url) {
      generatedImageUrl = data.data[0].url;
    }

    if (!generatedImageUrl) {
      throw new BadRequestError("OpenAI did not return valid image data.");
    }

    // 5. Atomically deduct credits and record success audit log
    const usageResult = await UsageService.recordUsage({
      userId,
      workspace,
      itemType,
      creditsDeducted: requiredCredits,
      prompt,
      status: "success",
      latencyMs,
      metadata: {
        ...metadata,
        model,
        size,
        quality,
      },
    });

    return {
      imageUrl: generatedImageUrl,
      remainingCredits: usageResult.remainingCredits,
      usageLog: usageResult.usageLog,
      latencyMs,
    };
  }
}
