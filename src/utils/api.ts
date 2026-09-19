/**
 * Srushti AI — Frontend API & Authentication Client
 * Connects frontend to the Supabase Express Serverless Backend
 */
import { parseError } from "./errorHandler";

export interface AuthUser {
  id: string;
  phone: string;
  role: "user" | "admin" | "superadmin";
  walletBalance: number;
  avatarUrl?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  tokens?: AuthTokens;
  data?: {
    user: AuthUser;
    tokens: AuthTokens;
  };
  error?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  data?: {
    success: boolean;
    identifier: string;
    expiresInMinutes: number;
  };
  error?: string;
}

/**
 * Returns the root server base URL (e.g. http://localhost:4000)
 */
export function getServerBaseUrl(): string {
  const envUrl =
    import.meta.env.VITE_SERVER_BASE_URL ||
    import.meta.env.VITE_API_URL;

  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    return trimmed.replace(/\/api$/, "");
  }
  return "http://localhost:4000";
}

/**
 * Returns the API endpoint base URL (e.g. http://localhost:4000/api or /api)
 */
export function getApiBaseUrl(): string {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_SERVER_BASE_URL;

  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Default to relative '/api' which Vite proxies to http://localhost:4000 in dev
  return "/api";
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("srushti_auth_token");
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("srushti_auth_token", token);
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("srushti_auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("srushti_auth_user", JSON.stringify(user));
  if (user.phone) {
    localStorage.setItem("srushti_user_phone", user.phone);
  }
  if (user.walletBalance !== undefined) {
    localStorage.setItem("srushti_wallet_credits", String(user.walletBalance));
  }
  localStorage.setItem("srushti_is_signed_out", "false");
}

export function removeAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("srushti_auth_token");
  localStorage.removeItem("srushti_auth_user");
  localStorage.removeItem("srushti_user_phone");
  localStorage.removeItem("srushti_user_fullname");
  localStorage.setItem("srushti_is_signed_out", "true");
}

/**
 * Dispatches an OTP via the backend SMS gateway (Colourmoon)
 */
export async function sendOtpApi(phone: string): Promise<SendOtpResponse> {
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedIdentifier = cleanPhone.length === 10 ? cleanPhone : phone.trim();
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/auth/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: formattedIdentifier,
        purpose: "login",
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errorMsg =
        data?.details && Array.isArray(data.details) && data.details.length > 0
          ? data.details.map((d: any) => d.message).join(". ")
          : data?.error || data?.message || `Failed to send OTP (Status ${res.status})`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err: any) {
    const parsed = parseError(err);
    console.error("sendOtpApi error:", parsed);
    throw new Error(parsed.message);
  }
}

/**
 * Verifies an OTP code, logs in or creates user, and saves auth tokens
 */
export async function verifyOtpApi(
  phone: string,
  code: string
): Promise<AuthResponse> {
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedIdentifier = cleanPhone.length === 10 ? cleanPhone : phone.trim();
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/auth/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: formattedIdentifier,
        code: code.trim(),
        purpose: "login",
      }),
    });

    const data: AuthResponse = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      const errorMsg =
        (data as any)?.details && Array.isArray((data as any).details) && (data as any).details.length > 0
          ? (data as any).details.map((d: any) => d.message).join(". ")
          : data?.error || data?.message || `Invalid OTP (Status ${res.status})`;
      throw new Error(errorMsg);
    }

    const user: AuthUser | undefined = (data as any)?.user || data?.data?.user;
    const tokens: AuthTokens | undefined = (data as any)?.tokens || data?.data?.tokens;

    if (tokens?.accessToken) {
      setAuthToken(tokens.accessToken);
    }
    if (user) {
      setStoredAuthUser(user);
    }

    return data;
  } catch (err: any) {
    const parsed = parseError(err);
    console.error("verifyOtpApi error:", parsed);
    throw new Error(parsed.message);
  }
}

/**
 * Fetches the current logged in user's profile and wallet balance from the backend
 */
export async function fetchCurrentUserApi(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      // Token expired, revoked, or invalid
      removeAuthData();
      return null;
    }

    const data = await res.json();
    const user: AuthUser | undefined = (data as any)?.user || data?.data?.user;
    if (res.ok && user) {
      setStoredAuthUser(user);
      return user;
    }
    return null;
  } catch (err) {
    console.warn("fetchCurrentUserApi error:", err);
    return null;
  }
}

export interface CreateOrderParams {
  amount: number; // in INR (e.g. 500)
  credits: number;
  packName?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderData {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  configId?: string;
  credits: number;
  paymentId: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: RazorpayOrderData;
  error?: string;
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  walletBalance?: number;
  creditsAdded?: number;
  orderId?: string;
  paymentId?: string;
  alreadyProcessed?: boolean;
  error?: string;
}

/**
 * Ensures the Razorpay checkout script is loaded in the browser
 */
export function loadRazorpayCheckoutScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Creates a server-side Razorpay Order via the backend
 */
export async function createPaymentOrderApi(params: CreateOrderParams): Promise<CreateOrderResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Please sign in with your mobile number before recharging credits.");
  }

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const errorMsg = data?.error || data?.message || `Failed to create payment order (Status ${res.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Verifies Razorpay payment signature on the backend and credits wallet atomically
 */
export async function verifyPaymentApi(params: VerifyPaymentParams): Promise<VerifyPaymentResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication session expired. Please sign in again.");
  }

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const errorMsg = data?.error || data?.message || `Payment verification failed (Status ${res.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

export interface RecordUsageApiParams {
  workspace: "garment" | "jewelry" | "face" | "general";
  itemType: string;
  creditsDeducted: number;
  prompt?: string;
  status?: "pending" | "success" | "failed";
  errorMessage?: string;
  latencyMs?: number;
  metadata?: Record<string, any>;
}

export interface UsageLogItem {
  id: string;
  userId?: string;
  userPhone?: string;
  workspace: "garment" | "jewelry" | "face" | "general";
  itemType: string;
  creditsDeducted: number;
  prompt?: string | null;
  status: "pending" | "success" | "failed";
  errorMessage?: string | null;
  latencyMs?: number | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface RecordUsageResponse {
  success: boolean;
  usageLog: UsageLogItem;
  remainingCredits: number;
  error?: string;
}

export interface UsageHistoryResponse {
  success: boolean;
  history: UsageLogItem[];
  error?: string;
}

export interface UsageBalanceResponse {
  success: boolean;
  balance: {
    id: string;
    phone: string;
    walletBalance: number;
    role: string;
  };
  error?: string;
}

/**
 * Records AI photo shoot usage on the backend, deducting credits atomically
 */
export async function recordUsageApi(params: RecordUsageApiParams): Promise<RecordUsageResponse | null> {
  const token = getAuthToken();
  if (!token) {
    // Unauthenticated guest user - usage tracked locally
    return null;
  }

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/usage/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      if (typeof data.remainingCredits === "number") {
        localStorage.setItem("srushti_wallet_credits", String(data.remainingCredits));
      }
      return data;
    }
    console.warn("recordUsageApi response not ok:", data);
    return null;
  } catch (err) {
    console.warn("recordUsageApi network error:", err);
    return null;
  }
}

/**
 * Fetches the user's AI generation usage history from the backend
 */
export async function fetchUsageHistoryApi(limit = 50, offset = 0): Promise<UsageLogItem[]> {
  const token = getAuthToken();
  if (!token) return [];

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/usage/history?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data: UsageHistoryResponse = await res.json().catch(() => ({ success: false, history: [] }));
      return data.history || [];
    }
    return [];
  } catch (err) {
    console.warn("fetchUsageHistoryApi error:", err);
    return [];
  }
}

/**
 * Fetches user wallet balance directly from backend usage balance endpoint
 */
export async function fetchUsageBalanceApi(): Promise<number | null> {
  const token = getAuthToken();
  if (!token) return null;

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/usage/balance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data: UsageBalanceResponse = await res.json().catch(() => null);
      if (data?.success && data.balance && typeof data.balance.walletBalance === "number") {
        localStorage.setItem("srushti_wallet_credits", String(data.balance.walletBalance));
        return data.balance.walletBalance;
      }
    }
    return null;
  } catch (err) {
    console.warn("fetchUsageBalanceApi error:", err);
    return null;
  }
}

/**
 * Fetches platform-wide AI generation usage logs for Admin workspace
 */
export async function fetchAdminUsageLogsApi(limit = 50, offset = 0): Promise<UsageLogItem[]> {
  const token = getAuthToken();
  if (!token) return [];

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/admin/usage?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.success && Array.isArray(data.logs)) {
        return data.logs;
      }
    }
    return [];
  } catch (err) {
    console.warn("fetchAdminUsageLogsApi error:", err);
    return [];
  }
}

export interface TimelineItem {
  id: string;
  type: "payment" | "usage";
  timestamp: number;
  createdAt: string;
  status: string;
  creditsChange: number; // positive for payment, negative for usage
  title: string;
  titleTe?: string;
  description?: string;
  descriptionTe?: string;
  // Payment specific fields
  amountPaise?: number;
  amountFiat?: number;
  currency?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string | null;
  packName?: string;
  // Usage specific fields
  workspace?: "garment" | "jewelry" | "face" | "general";
  itemType?: string;
  prompt?: string | null;
  errorMessage?: string | null;
  latencyMs?: number | null;
  metadata?: Record<string, any> | null;
}

export interface CombinedTimelineResponse {
  success: boolean;
  timeline: TimelineItem[];
  summary: {
    totalGenerations: number;
    totalPayments: number;
    totalCreditsSpent: number;
    totalCreditsPurchased: number;
  };
  error?: string;
}

/**
 * Fetches unified timeline combining both payments and usage logs from backend
 */
export async function fetchCombinedTimelineApi(
  limit = 50,
  offset = 0,
  type?: "payment" | "usage",
  period?: string
): Promise<CombinedTimelineResponse | null> {
  const token = getAuthToken();
  if (!token) return null;

  const baseUrl = getApiBaseUrl();
  try {
    let url = `${baseUrl}/usage/timeline?limit=${limit}&offset=${offset}`;
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    if (period && period !== "all") {
      url += `&period=${encodeURIComponent(period)}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data: CombinedTimelineResponse = await res.json().catch(() => null);
      if (data?.success && Array.isArray(data.timeline)) {
        return data;
      }
    }
    return null;
  } catch (err) {
    console.warn("fetchCombinedTimelineApi error:", err);
    return null;
  }
}

export interface GenerateAiImageParams {
  workspace: "garment" | "jewelry" | "face" | "general";
  itemType: string;
  requiredCredits: number;
  prompt: string;
  size?: string;
  quality?: string;
  model?: string;
  productImage: string;
  faceImage?: string;
  metadata?: Record<string, any>;
}

export interface GenerateAiImageResponse {
  success: boolean;
  imageUrl?: string;
  remainingCredits?: number;
  usageLog?: any;
  latencyMs?: number;
  error?: string;
}

/**
 * Calls the secure server-side AI generation proxy endpoint (/api/ai/generate).
 * The OpenAI API key is stored exclusively on the server, safely isolated from client browsers.
 */
export async function generateAiImageApi(params: GenerateAiImageParams): Promise<GenerateAiImageResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Please sign in with your phone number before generating AI photos.");
  }

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/ai/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const errorMsg =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.details) && data.details.map((d: any) => d.message).join(". ")) ||
      `AI Generation failed (Status ${res.status})`;
    throw new Error(errorMsg);
  }

  if (typeof data.remainingCredits === "number") {
    localStorage.setItem("srushti_wallet_credits", String(data.remainingCredits));
  }

  return data;
}
