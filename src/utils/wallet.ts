export interface WalletTransaction {
  id: string;
  type: "debit" | "credit";
  amount: number;
  currency: "INR" | "USD";
  title: string;
  titleTe?: string;
  description?: string;
  descriptionTe?: string;
  date: string;
  status: "success" | "pending" | "failed";
  category: "generation" | "recharge" | "bonus" | "refund";
}

const DEFAULT_INR_BALANCE = 750.0;
const DEFAULT_USD_BALANCE = 25.0;

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx-1",
    type: "credit",
    amount: 500,
    currency: "INR",
    title: "UPI Instant Recharge",
    titleTe: "UPI తక్షణ రీఛార్జ్",
    description: "Ref: UPI-9827419208 • PhonePe / GPay",
    descriptionTe: "రిఫరెన్స్: UPI-9827419208",
    date: "Today, 11:30 AM",
    status: "success",
    category: "recharge",
  },
  {
    id: "tx-2",
    type: "credit",
    amount: 250,
    currency: "INR",
    title: "Welcome Bonus Credits",
    titleTe: "స్వాగత బోనస్ క్రెడిట్స్",
    description: "New account creation rewards",
    descriptionTe: "కొత్త ఖాతా రివార్డ్స్",
    date: "Yesterday, 04:15 PM",
    status: "success",
    category: "bonus",
  },
  {
    id: "tx-3",
    type: "debit",
    amount: 14.5,
    currency: "INR",
    title: "Garment Model Shoot (4K UHD)",
    titleTe: "బట్టల మోడల్ ఫోటో షూట్ (4K)",
    description: "GPTImage-2 • High Quality • Saree Standing Pose",
    descriptionTe: "GPTImage-2 • హై క్వాలిటీ • చీర ఫోటో షూట్",
    date: "Yesterday, 05:20 PM",
    status: "success",
    category: "generation",
  },
  {
    id: "tx-4",
    type: "debit",
    amount: 8.5,
    currency: "INR",
    title: "Jewelry Studio Shoot (2K HD)",
    titleTe: "నగల స్టూడియో ఫోటో షూట్ (2K)",
    description: "GPTImage-2 • Medium Quality • Necklace Portrait",
    descriptionTe: "GPTImage-2 • మీడియం క్వాలిటీ • నెక్లెస్ పోర్ట్రెయిట్",
    date: "Yesterday, 06:10 PM",
    status: "success",
    category: "generation",
  },
];

export function getInitialWalletBalance(currency: "INR" | "USD"): number {
  try {
    const key = currency === "INR" ? "srushti_wallet_inr" : "srushti_wallet_usd";
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read wallet balance from localStorage:", e);
  }
  return currency === "INR" ? DEFAULT_INR_BALANCE : DEFAULT_USD_BALANCE;
}

export function saveWalletBalance(currency: "INR" | "USD", balance: number): void {
  try {
    const key = currency === "INR" ? "srushti_wallet_inr" : "srushti_wallet_usd";
    localStorage.setItem(key, balance.toFixed(2));
  } catch (e) {
    console.error("Failed to save wallet balance to localStorage:", e);
  }
}

export function getInitialWalletTransactions(): WalletTransaction[] {
  try {
    const saved = localStorage.getItem("srushti_wallet_transactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
