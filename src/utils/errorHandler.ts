/**
 * Srushti AI — Frontend Error Handling Utility
 * Safely parses, formats, and translates API and runtime errors
 */

export interface ParsedError {
  message: string;
  code?: string;
  status?: number;
  details?: Array<{ field?: string; message: string }>;
  isNetworkError: boolean;
}

/**
 * Normalizes any error object, string, or API response into a consistent ParsedError
 */
export function parseError(error: unknown): ParsedError {
  // 1. Check if user is offline
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      message: "You appear to be offline. Please check your internet connection.",
      code: "OFFLINE",
      isNetworkError: true,
    };
  }

  // 2. Fetch / Network connectivity errors
  if (error instanceof TypeError && error.message.toLowerCase().includes("failed to fetch")) {
    return {
      message: "Unable to reach server. Please check your internet connection or server status.",
      code: "NETWORK_ERROR",
      isNetworkError: true,
    };
  }

  // 3. Native JavaScript Error instances
  if (error instanceof Error) {
    const isAbort = error.name === "AbortError";
    return {
      message: isAbort ? "Request timed out. Please try again." : error.message,
      code: error.name,
      isNetworkError: isAbort,
    };
  }

  // 4. Object error formats (e.g. from backend JSON)
  if (typeof error === "object" && error !== null) {
    const errObj = error as any;
    const msg =
      errObj.error?.message ||
      errObj.error ||
      errObj.message ||
      "An unexpected error occurred.";
    const code = errObj.code || errObj.error?.code;
    const status = errObj.status || errObj.statusCode;
    const details = errObj.details;

    return {
      message: typeof msg === "string" ? msg : "An unexpected error occurred.",
      code: typeof code === "string" ? code : undefined,
      status: typeof status === "number" ? status : undefined,
      details: Array.isArray(details) ? details : undefined,
      isNetworkError: false,
    };
  }

  // 5. String error message
  if (typeof error === "string") {
    return {
      message: error,
      isNetworkError: false,
    };
  }

  return {
    message: "An unknown error occurred. Please try again.",
    isNetworkError: false,
  };
}

/**
 * Returns a user-friendly error message, with optional localization
 */
export function getFriendlyErrorMessage(error: unknown, lang: "en" | "te" = "en"): string {
  const parsed = parseError(error);

  if (lang === "te") {
    if (parsed.isNetworkError || parsed.code === "OFFLINE") {
      return "నెట్‌వర్క్ కనెక్షన్ లోపం. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి.";
    }
    if (parsed.code === "TOKEN_EXPIRED") {
      return "మీ సెషన్ గడువు ముగిసింది. దయచేసి మళ్లీ లాగిన్ అవ్వండి.";
    }
    if (parsed.status === 429) {
      return "చాలా అభ్యర్థనలు పంపబడ్డాయి. దయచేసి కొద్దిసేపు ఆగి మళ్లీ ప్రయత్నించండి.";
    }
    if (parsed.status && parsed.status >= 500) {
      return "సర్వర్ తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.";
    }
  }

  return parsed.message;
}
