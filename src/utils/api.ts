/**
 * Srushti AI — Frontend API & Authentication Client
 * Connects frontend to the Supabase Express Serverless Backend
 */
import { parseError } from "./errorHandler";

export interface AuthUser {
  id: string;
  phone: string;
  role: "user" | "admin";
  gender?: string | null;
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
  window.dispatchEvent(new Event("srushti:auth-changed"));
}

export function removeAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("srushti_auth_token");
  localStorage.removeItem("srushti_auth_user");
  localStorage.removeItem("srushti_user_phone");
  localStorage.removeItem("srushti_user_fullname");
  localStorage.setItem("srushti_is_signed_out", "true");
  window.dispatchEvent(new Event("srushti:auth-changed"));
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
  presentationMode?: string;
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

// =============================================================================
// ADMIN DASHBOARD & STUDIO CONFIG API CLIENTS
// =============================================================================

export interface WearTypeRecord {
  id: string;
  workspace: "garment" | "jewelry" | string;
  code: string;
  nameEn: string;
  nameTe: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessCategoryRecord {
  id: string;
  workspace: "garment" | "jewelry";
  genderTarget: "female" | "male" | "all" | string;
  nameEn: string;
  nameTe: string;
  icon?: string | null;
  bannerUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogItemRecord {
  id: string;
  wearType: string;
  wearTypeId?: string | null;
  businessCategoryId?: string | null;
  workspace: "garment" | "jewelry" | string;
  genderTarget: "female" | "male" | "unisex" | "all" | string;
  categoryLabel?: string;
  nameEn: string;
  nameTe: string;
  icon?: string | null;
  sampleImageUrl?: string | null;
  thumbnailUrl?: string | null;
  promptDirective: string;
  placementDirective?: string | null;
  negativePrompt?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  presentationIds?: string[];
  backgroundIds?: string[];
  poseIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceRecord {
  id: string;
  code: string;
  nameEn: string;
  nameTe: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaceRecord {
  id: string;
  workspace: "garment" | "jewelry" | "all";
  genderTarget?: "female" | "male" | "unisex" | "all" | string;
  wearTypeId?: string | null;
  subCategory?: string | null;
  nameEn: string;
  nameTe: string;
  promptDirective: string;
  cameraFraming?: string | null;
  faceVisibilityRule?: "full_face" | "partial_face" | "no_face" | null;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  storagePath?: string | null;
  colorHex?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PoseRecord {
  id: string;
  workspace: "garment" | "jewelry" | "all";
  genderTarget?: "female" | "male" | "unisex" | "all" | string;
  wearTypeId?: string | null;
  subCategory?: string | null;
  nameEn: string;
  nameTe: string;
  promptDirective: string;
  cameraFraming?: string | null;
  faceVisibilityRule?: "full_face" | "partial_face" | "no_face" | null;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  storagePath?: string | null;
  colorHex?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PresentationRecord {
  id: string;
  workspace: "garment" | "jewelry" | "all";
  genderTarget?: "female" | "male" | "unisex" | "all" | string;
  wearTypeId?: string | null;
  subCategory?: string | null;
  nameEn: string;
  nameTe: string;
  promptDirective: string;
  cameraFraming?: string | null;
  faceVisibilityRule?: "full_face" | "partial_face" | "no_face" | null;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  storagePath?: string | null;
  colorHex?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackgroundRecord {
  id: string;
  workspace: "garment" | "jewelry" | "all";
  genderTarget?: "female" | "male" | "unisex" | "all" | string;
  wearTypeId?: string | null;
  subCategory?: string | null;
  nameEn: string;
  nameTe: string;
  promptDirective: string;
  cameraFraming?: string | null;
  faceVisibilityRule?: "full_face" | "partial_face" | "no_face" | null;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  storagePath?: string | null;
  colorHex?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudioPresetRecord {
  id: string;
  wearTypeId?: string | null;
  type?: "pose" | "background" | "face" | "presentation" | "style";
  workspace: "garment" | "jewelry" | "all";
  genderTarget?: "female" | "male" | "unisex" | "all" | string;
  subCategory?: string | null;
  nameEn: string;
  nameTe: string;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  previewUrl?: string | null;
  storagePath?: string | null;
  promptDirective: string;
  cameraFraming?: string | null;
  faceVisibilityRule?: "full_face" | "partial_face" | "no_face" | null;
  colorHex?: string | null;
  negativePrompt?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemSettingRecord {
  id?: string;
  key: string;
  value: any;
  description?: string | null;
  updatedAt?: string;
}

export interface AdminUserRecord {
  id: string;
  phone: string;
  role: "user" | "admin";
  gender?: string | null;
  walletBalance: number;
  isActive: boolean;
  createdAt: string;
}

export interface GenderRecord {
  id: string;
  code: string;
  nameEn: string;
  nameTe: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemLookupRecord {
  id: string;
  type: "background_type" | "gender" | "garment_category" | "jewelry_category" | string;
  code: string;
  nameEn: string;
  nameTe: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupedLookups {
  backgroundTypes: SystemLookupRecord[];
  genders: SystemLookupRecord[];
  garmentCategories: SystemLookupRecord[];
  jewelryCategories: SystemLookupRecord[];
  all?: SystemLookupRecord[];
}

export interface StudioConfigResponse {
  success: boolean;
  categories: BusinessCategoryRecord[];
  businesses?: BusinessCategoryRecord[];
  catalogItems: CatalogItemRecord[];
  presets: {
    poses: StudioPresetRecord[];
    backgrounds: StudioPresetRecord[];
    presentations: StudioPresetRecord[];
    presentationModes?: StudioPresetRecord[];
    faces: StudioPresetRecord[];
    styles: StudioPresetRecord[];
  };
  poses?: StudioPresetRecord[];
  backgrounds?: StudioPresetRecord[];
  presentations?: StudioPresetRecord[];
  presentationModes?: StudioPresetRecord[];
  faces?: StudioPresetRecord[];
  lookups?: GroupedLookups;
  wearTypes?: WearTypeRecord[];
  genders?: GenderRecord[];
  workspaces?: WorkspaceRecord[];
  settings: Record<string, any>;
  optionMappings?: any;
  heroSlides?: any[];
  presetColors?: any[];
  pricingMatrix?: any;
  imageModels?: any[];
  imageResolutions?: any;
  translations?: {
    en?: any;
    te?: any;
  };
  systemSettings?: {
    pricing?: any;
    fidelityRules?: string[];
    negativeExclusions?: string[];
  };
}

/**
 * Fetch unified studio configuration (100% backend driven)
 */
export async function fetchStudioConfigApi(forceFresh = false): Promise<StudioConfigResponse> {
  const baseUrl = getApiBaseUrl();
  const url = forceFresh ? `${baseUrl}/studio/config?_t=${Date.now()}` : `${baseUrl}/studio/config`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || `Failed to fetch studio config (${res.status})`);
  }
  return data;
}

/**
 * Common auth fetch wrapper for Admin API endpoints
 */
async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Admin session required. Please sign in as admin.");
  }
  const baseUrl = getApiBaseUrl();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string> || {}),
  };

  // If body is NOT FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${baseUrl}/admin${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.message || data?.error || `Admin API Error (${res.status})`);
  }

  // If this was a modifying operation, broadcast event so /studio auto-refreshes immediately
  const method = (options.method || "GET").toUpperCase();
  if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("srushti:studio-config-updated"));
    }
  }

  return data;
}

// 1. Business Verticals
export async function fetchAdminBusinessesApi(): Promise<BusinessCategoryRecord[]> {
  const data = await adminFetch("/businesses");
  return data.categories || [];
}

export async function createAdminBusinessApi(payload: Partial<BusinessCategoryRecord>): Promise<BusinessCategoryRecord> {
  const data = await adminFetch("/businesses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.category;
}

export async function updateAdminBusinessApi(id: string, payload: Partial<BusinessCategoryRecord>): Promise<BusinessCategoryRecord> {
  const data = await adminFetch(`/businesses/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.category;
}

export async function deleteAdminBusinessApi(id: string): Promise<void> {
  await adminFetch(`/businesses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// 2. Catalog Items
export async function fetchAdminCatalogApi(filters?: {
  wearType?: string;
  wearTypeId?: string;
  workspace?: string;
  genderTarget?: string;
  businessCategoryId?: string;
  categoryLabel?: string;
  search?: string;
  isActive?: boolean;
}): Promise<CatalogItemRecord[]> {
  const query = new URLSearchParams();
  if (filters?.wearType) query.set("wearType", filters.wearType);
  if (filters?.wearTypeId) query.set("wearTypeId", filters.wearTypeId);
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.genderTarget) query.set("genderTarget", filters.genderTarget);
  if (filters?.businessCategoryId) query.set("businessCategoryId", filters.businessCategoryId);
  if (filters?.categoryLabel) query.set("categoryLabel", filters.categoryLabel);
  if (filters?.search) query.set("search", filters.search);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  query.set("limit", "200");

  const data = await adminFetch(`/catalog?${query.toString()}`);
  return data.items || [];
}

export async function createAdminCatalogItemApi(payload: Partial<CatalogItemRecord>): Promise<CatalogItemRecord> {
  const data = await adminFetch("/catalog", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.item;
}

export async function updateAdminCatalogItemApi(id: string, payload: Partial<CatalogItemRecord>): Promise<CatalogItemRecord> {
  const data = await adminFetch(`/catalog/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.item;
}

export async function deleteAdminCatalogItemApi(id: string): Promise<void> {
  await adminFetch(`/catalog/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleAdminCatalogItemStatusApi(id: string): Promise<CatalogItemRecord> {
  const data = await adminFetch(`/catalog/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
  });
  return data.item;
}

// 3. Studio Presets
export async function fetchAdminPresetsApi(filters?: {
  type?: string;
  workspace?: string;
  isActive?: boolean;
}): Promise<StudioPresetRecord[]> {
  const query = new URLSearchParams();
  if (filters?.type) query.set("type", filters.type);
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  query.set("limit", "200");

  const data = await adminFetch(`/presets?${query.toString()}`);
  return data.presets || [];
}

export async function createAdminPresetApi(payload: Partial<StudioPresetRecord>): Promise<StudioPresetRecord> {
  const data = await adminFetch("/presets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.preset;
}

export async function updateAdminPresetApi(id: string, payload: Partial<StudioPresetRecord>): Promise<StudioPresetRecord> {
  const data = await adminFetch(`/presets/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.preset;
}

export async function deleteAdminPresetApi(id: string): Promise<void> {
  await adminFetch(`/presets/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleAdminPresetStatusApi(id: string): Promise<StudioPresetRecord> {
  const data = await adminFetch(`/presets/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
  });
  return data.preset;
}

// 4. Model Faces & Supabase Storage Management
export async function fetchAdminFacesApi(filters?: {
  workspace?: string;
  genderTarget?: string;
  wearTypeId?: string;
  isActive?: boolean;
}): Promise<FaceRecord[]> {
  const query = new URLSearchParams();
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.genderTarget) query.set("genderTarget", filters.genderTarget);
  if (filters?.wearTypeId) query.set("wearTypeId", filters.wearTypeId);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  query.set("limit", "200");

  const data = await adminFetch(`/faces?${query.toString()}`);
  return data.faces || [];
}

export async function createAdminFaceApi(payload: Partial<FaceRecord>): Promise<FaceRecord> {
  const data = await adminFetch("/faces", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.face;
}

export async function updateAdminFaceApi(id: string, payload: Partial<FaceRecord>): Promise<FaceRecord> {
  const data = await adminFetch(`/faces/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.face;
}

export async function toggleAdminFaceStatusApi(id: string): Promise<FaceRecord> {
  const data = await adminFetch(`/faces/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
  });
  return data.face;
}

export async function uploadAdminFaceApi(formData: FormData): Promise<StudioPresetRecord> {
  const data = await adminFetch("/faces/upload", {
    method: "POST",
    body: formData,
  });
  return data.preset || data.face;
}

export async function replaceAdminFacePhotoApi(id: string, formData: FormData): Promise<StudioPresetRecord> {
  const data = await adminFetch(`/faces/${encodeURIComponent(id)}/replace`, {
    method: "PUT",
    body: formData,
  });
  return data.preset || data.face;
}

export async function deleteAdminFaceApi(id: string): Promise<void> {
  await adminFetch(`/faces/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// 5. Poses API
export async function fetchAdminPosesApi(filters?: {
  workspace?: string;
  genderTarget?: string;
  wearTypeId?: string;
  isActive?: boolean;
}): Promise<PoseRecord[]> {
  const query = new URLSearchParams();
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.genderTarget) query.set("genderTarget", filters.genderTarget);
  if (filters?.wearTypeId) query.set("wearTypeId", filters.wearTypeId);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  query.set("limit", "200");

  const data = await adminFetch(`/poses?${query.toString()}`);
  return data.poses || [];
}

export async function createAdminPoseApi(payload: Partial<PoseRecord>): Promise<PoseRecord> {
  const data = await adminFetch("/poses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.pose;
}

export async function updateAdminPoseApi(id: string, payload: Partial<PoseRecord>): Promise<PoseRecord> {
  const data = await adminFetch(`/poses/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.pose;
}

export async function deleteAdminPoseApi(id: string): Promise<void> {
  await adminFetch(`/poses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleAdminPoseStatusApi(id: string): Promise<PoseRecord> {
  const data = await adminFetch(`/poses/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
  });
  return data.pose;
}

// 6. Presentations API
export async function fetchAdminPresentationsApi(filters?: {
  workspace?: string;
  genderTarget?: string;
  wearTypeId?: string;
  isActive?: boolean;
}): Promise<PresentationRecord[]> {
  const query = new URLSearchParams();
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.genderTarget) query.set("genderTarget", filters.genderTarget);
  if (filters?.wearTypeId) query.set("wearTypeId", filters.wearTypeId);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  query.set("limit", "200");

  const data = await adminFetch(`/presentations?${query.toString()}`);
  return data.presentations || [];
}

export async function createAdminPresentationApi(payload: Partial<PresentationRecord>): Promise<PresentationRecord> {
  const data = await adminFetch("/presentations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.presentation;
}

export async function updateAdminPresentationApi(id: string, payload: Partial<PresentationRecord>): Promise<PresentationRecord> {
  const data = await adminFetch(`/presentations/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.presentation;
}

export async function deleteAdminPresentationApi(id: string): Promise<void> {
  await adminFetch(`/presentations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleAdminPresentationStatusApi(id: string): Promise<PresentationRecord> {
  const data = await adminFetch(`/presentations/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
  });
  return data.presentation;
}

// 7. Backgrounds API
export async function fetchAdminBackgroundsApi(filters?: {
  workspace?: string;
  genderTarget?: string;
  wearTypeId?: string;
  isActive?: boolean;
}): Promise<BackgroundRecord[]> {
  const query = new URLSearchParams();
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.genderTarget) query.set("genderTarget", filters.genderTarget);
  if (filters?.wearTypeId) query.set("wearTypeId", filters.wearTypeId);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  query.set("limit", "200");

  const data = await adminFetch(`/backgrounds?${query.toString()}`);
  return data.backgrounds || [];
}

export async function createAdminBackgroundApi(payload: Partial<BackgroundRecord>): Promise<BackgroundRecord> {
  const data = await adminFetch("/backgrounds", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.background;
}

export async function updateAdminBackgroundApi(id: string, payload: Partial<BackgroundRecord>): Promise<BackgroundRecord> {
  const data = await adminFetch(`/backgrounds/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.background;
}

export async function deleteAdminBackgroundApi(id: string): Promise<void> {
  await adminFetch(`/backgrounds/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleAdminBackgroundStatusApi(id: string): Promise<BackgroundRecord> {
  const data = await adminFetch(`/backgrounds/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
  });
  return data.background;
}

// 5. System Settings
export async function fetchAdminSettingsApi(): Promise<SystemSettingRecord[]> {
  const data = await adminFetch("/settings");
  return data.settings || [];
}

export async function updateAdminSettingByKeyApi(key: string, value: any, description?: string): Promise<SystemSettingRecord> {
  const data = await adminFetch(`/settings/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify({ value, description }),
  });
  return data.setting;
}

// 6. Users & Credit Topup
export async function fetchAdminUsersApi(): Promise<AdminUserRecord[]> {
  const data = await adminFetch("/users");
  return data.users || [];
}

export async function adjustAdminCreditsApi(userId: string, amount: number, description?: string): Promise<any> {
  const data = await adminFetch("/credits/adjust", {
    method: "POST",
    body: JSON.stringify({ userId, amount, description }),
  });
  return data;
}

export async function toggleAdminUserStatusApi(userId: string): Promise<any> {
  const data = await adminFetch(`/users/${encodeURIComponent(userId)}/status`, {
    method: "PATCH",
  });
  return data;
}

// 7. System Lookups (Public & Admin)
export async function fetchLookupsApi(): Promise<GroupedLookups> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/studio/lookups`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || `Failed to fetch lookups (${res.status})`);
  }
  return data.lookups;
}

export async function fetchAdminLookupsApi(type?: string): Promise<SystemLookupRecord[]> {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  const data = await adminFetch(`/lookups${query}`);
  return data.lookups || [];
}

export async function createAdminLookupApi(payload: Partial<SystemLookupRecord>): Promise<SystemLookupRecord> {
  const data = await adminFetch("/lookups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.lookup;
}

export async function updateAdminLookupApi(id: string, payload: Partial<SystemLookupRecord>): Promise<SystemLookupRecord> {
  const data = await adminFetch(`/lookups/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.lookup;
}

export async function deleteAdminLookupApi(id: string): Promise<void> {
  await adminFetch(`/lookups/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// 8. Gender Demographics (Public & Admin)
export async function fetchGendersApi(): Promise<GenderRecord[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/studio/genders`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || `Failed to fetch genders (${res.status})`);
  }
  return data.genders || [];
}

export async function fetchAdminGendersApi(isActive?: boolean): Promise<GenderRecord[]> {
  const query = isActive !== undefined ? `?isActive=${isActive}` : "";
  const data = await adminFetch(`/genders${query}`);
  return data.genders || [];
}

export async function createAdminGenderApi(payload: Partial<GenderRecord>): Promise<GenderRecord> {
  const data = await adminFetch("/genders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.gender;
}

export async function updateAdminGenderApi(id: string, payload: Partial<GenderRecord>): Promise<GenderRecord> {
  const data = await adminFetch(`/genders/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.gender;
}

export async function deleteAdminGenderApi(id: string): Promise<void> {
  await adminFetch(`/genders/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// 9. Workspaces (Public & Admin)
export async function fetchWorkspacesApi(): Promise<WorkspaceRecord[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/studio/workspaces`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || `Failed to fetch workspaces (${res.status})`);
  }
  return data.workspaces || [];
}

export async function fetchAdminWorkspacesApi(isActive?: boolean): Promise<WorkspaceRecord[]> {
  const query = isActive !== undefined ? `?isActive=${isActive}` : "";
  const data = await adminFetch(`/workspaces${query}`);
  return data.workspaces || [];
}

export async function createAdminWorkspaceApi(payload: Partial<WorkspaceRecord>): Promise<WorkspaceRecord> {
  const data = await adminFetch("/workspaces", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.workspace;
}

export async function updateAdminWorkspaceApi(id: string, payload: Partial<WorkspaceRecord>): Promise<WorkspaceRecord> {
  const data = await adminFetch(`/workspaces/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.workspace;
}

export async function deleteAdminWorkspaceApi(id: string): Promise<void> {
  await adminFetch(`/workspaces/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// 10. Wear Types (Public & Admin)
export async function fetchWearTypesApi(workspace?: string): Promise<WearTypeRecord[]> {
  const baseUrl = getApiBaseUrl();
  const query = workspace ? `?workspace=${encodeURIComponent(workspace)}` : "";
  const res = await fetch(`${baseUrl}/studio/wear-types${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || `Failed to fetch wear types (${res.status})`);
  }
  return data.wearTypes || [];
}

export async function fetchAdminWearTypesApi(filters?: {
  workspace?: string;
  isActive?: boolean;
}): Promise<WearTypeRecord[]> {
  const query = new URLSearchParams();
  if (filters?.workspace) query.set("workspace", filters.workspace);
  if (filters?.isActive !== undefined) query.set("isActive", String(filters.isActive));
  const qs = query.toString() ? `?${query.toString()}` : "";
  const data = await adminFetch(`/wear-types${qs}`);
  return data.wearTypes || [];
}

export async function createAdminWearTypeApi(payload: Partial<WearTypeRecord>): Promise<WearTypeRecord> {
  const data = await adminFetch("/wear-types", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.wearType;
}

export async function updateAdminWearTypeApi(id: string, payload: Partial<WearTypeRecord>): Promise<WearTypeRecord> {
  const data = await adminFetch(`/wear-types/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.wearType;
}

export async function deleteAdminWearTypeApi(id: string): Promise<void> {
  await adminFetch(`/wear-types/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}



