export interface WalletTransaction {
  id: string;
  type: "debit" | "credit";
  amount: number;               // Credits amount (e.g. 50 Credits)
  currency?: "INR" | "USD";      // Purchase currency for recharges
  fiatAmount?: number;          // Real currency paid (e.g. ₹500 or $10)
  title: string;
  titleTe?: string;
  description?: string;
  descriptionTe?: string;
  date: string;
  timestamp?: number;
  status: "success" | "pending" | "failed";
  category: "generation" | "recharge" | "bonus" | "refund";
  referenceId?: string;
  modelUsed?: string;
  resolution?: string;
  aspectRatio?: string;
}

export interface CreditSettings {
  creditsPerInr: number;        // Credits received per 1 INR (e.g., 1 INR = 1 Credit)
  creditsPerUsd: number;        // Credits received per 1 USD (e.g., 1 USD = 83.5 Credits or 100 Credits)
  costPerImageGenLow: number;   // Credits per Low quality image (e.g. 1 Credit)
  costPerImageGenMed: number;   // Credits per Medium quality image (e.g. 5 Credits)
  costPerImageGenHigh: number;  // Credits per High quality image (e.g. 20 Credits)
  profitMarginPercent: number;  // Studio profit markup on raw API costs (%) (e.g. 25%)
  pricingMode: "flat_credits" | "cost_plus_margin"; // Flat credits or Cost + Profit Margin
  autoCreditDeduction: boolean; // Deduct credits automatically on generation
  lowBalanceThreshold: number;  // Warning threshold in credits (e.g. 5 Credits)
}

export const DEFAULT_CREDIT_SETTINGS: CreditSettings = {
  creditsPerInr: 1,           // 1 INR = 1 Credit
  creditsPerUsd: 85,          // 1 USD = 85 Credits
  costPerImageGenLow: 1,      // 1 Credit
  costPerImageGenMed: 5,      // 5 Credits
  costPerImageGenHigh: 18,    // 18 Credits
  profitMarginPercent: 30,    // 30% Studio profit margin markup
  pricingMode: "cost_plus_margin", // Active Studio Profit Margin by default
  autoCreditDeduction: true,
  lowBalanceThreshold: 5,
};

export function getCreditSettings(): CreditSettings {
  try {
    const saved = localStorage.getItem("srushti_credit_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CREDIT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to read credit settings:", e);
  }
  return DEFAULT_CREDIT_SETTINGS;
}

export function saveCreditSettings(settings: CreditSettings): void {
  try {
    localStorage.setItem("srushti_credit_settings", JSON.stringify(settings));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("srushti:credit-settings-updated", { detail: settings }));
    }
  } catch (e) {
    console.error("Failed to save credit settings:", e);
  }
}

const DEFAULT_CREDITS_BALANCE = 0.0;

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [];

/**
 * Reads user usable credits balance from local storage
 */
export function getInitialWalletBalance(currency?: "INR" | "USD"): number {
  try {
    const savedCredits = localStorage.getItem("srushti_wallet_credits");
    if (savedCredits !== null) {
      const parsed = parseFloat(savedCredits);
      if (!isNaN(parsed)) return parsed;
    }
    // Backward compatibility with legacy currency keys
    const legacyKey = currency === "USD" ? "srushti_wallet_usd" : "srushti_wallet_inr";
    const legacySaved = localStorage.getItem(legacyKey);
    if (legacySaved !== null) {
      const parsed = parseFloat(legacySaved);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read wallet balance from localStorage:", e);
  }
  return DEFAULT_CREDITS_BALANCE;
}

/**
 * Saves user usable credits balance to local storage
 */
export function saveWalletBalance(currency: "INR" | "USD" | undefined, balance: number): void {
  try {
    localStorage.setItem("srushti_wallet_credits", balance.toFixed(1));
    // Also write to legacy keys for seamless compatibility
    localStorage.setItem("srushti_wallet_inr", balance.toFixed(2));
    localStorage.setItem("srushti_wallet_usd", balance.toFixed(2));
  } catch (e) {
    console.error("Failed to save wallet balance to localStorage:", e);
  }
}

export function getInitialWalletTransactions(): WalletTransaction[] {
  try {
    const saved = localStorage.getItem("srushti_wallet_transactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read wallet transactions from localStorage:", e);
  }
  return DEFAULT_TRANSACTIONS;
}

export function saveWalletTransactions(txs: WalletTransaction[]): void {
  try {
    localStorage.setItem("srushti_wallet_transactions", JSON.stringify(txs));
  } catch (e) {
    console.error("Failed to save wallet transactions to localStorage:", e);
  }
}

/**
 * Helper to calculate required credits for an AI Generation
 */
export function calculateRequiredCredits(
  modelId: string,
  resolutionId: string,
  quality: "low" | "medium" | "high" | string = "low",
  aspectRatio: string = "1:1",
  settings: CreditSettings = getCreditSettings()
): number {
  if (aspectRatio === "1:1" && (resolutionId === "4k" || resolutionId === "3840x3840" || resolutionId === "4096px")) {
    return 0;
  }

  let baseCredits = settings.costPerImageGenLow;
  if (quality === "medium") baseCredits = settings.costPerImageGenMed;
  if (quality === "high") baseCredits = settings.costPerImageGenHigh;

  let multiplier = 1.0;
  if (resolutionId === "2k" || resolutionId === "2048x2048" || resolutionId === "2048x1152" || resolutionId === "1152x2048") {
    multiplier = 1.5;
  } else if (resolutionId === "4k" || resolutionId === "3840x2160" || resolutionId === "2160x3840" || resolutionId === "3840x3840") {
    multiplier = 2.0;
  }

  let totalCredits = baseCredits * multiplier;

  // Apply profit margin markup if cost_plus_margin pricing mode is selected
  if (settings.pricingMode === "cost_plus_margin" && settings.profitMarginPercent > 0) {
    const marginMultiplier = 1 + (settings.profitMarginPercent / 100);
    totalCredits = totalCredits * marginMultiplier;
  }

  return Math.round(totalCredits * 10) / 10;
}

/**
 * Formats credit number nicely with "Credits" or icon notation
 */
export function formatCredits(credits: number): string {
  if (credits === 0) return "0 Credits";
  if (credits < 0.1) return `${credits.toFixed(2)} Credits`;
  if (credits % 1 === 0) return `${credits.toFixed(0)} Credits`;
  return `${credits.toFixed(1)} Credits`;
}

