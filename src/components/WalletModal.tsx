import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { WalletTransaction } from "../utils/wallet";
import { formatPrice } from "../data";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "USD" | "INR";
  walletBalance: number;
  transactions: WalletTransaction[];
  onRecharge: (amount: number, bonus: number, note: string) => void;
  lang: "en" | "te";
  usdToInrRate?: number;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currency,
  walletBalance,
  transactions,
  onRecharge,
  lang,
  usdToInrRate = 83.5,
}) => {
  const isEn = lang === "en";
  const [historyTab, setHistoryTab] = useState<"all" | "debit" | "credit">("all");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number>(
    currency === "INR" ? 500 : 25
  );
  const [customAmountInput, setCustomAmountInput] = useState<string>(
    currency === "INR" ? "500" : "25"
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Quick Recharge Presets based on currency
  const inrPresets = [
    { amount: 200, bonus: 10, label: "+₹10 Bonus", badge: null },
    { amount: 500, bonus: 50, label: "+₹50 Bonus", badge: isEn ? "Most Popular" : "అత్యంత ప్రజాదరణ" },
    { amount: 1000, bonus: 150, label: "+₹150 Bonus", badge: isEn ? "Pro Value" : "ఉత్తమ విలువ" },
    { amount: 2500, bonus: 450, label: "+₹450 Bonus", badge: isEn ? "Mega Pack" : "మెగా ప్యాక్" },
  ];

  const usdPresets = [
    { amount: 10, bonus: 1.0, label: "+$1.00 Bonus", badge: null },
    { amount: 25, bonus: 3.5, label: "+$3.50 Bonus", badge: isEn ? "Most Popular" : "అత్యంత ప్రజాదరణ" },
    { amount: 50, bonus: 9.0, label: "+$9.00 Bonus", badge: isEn ? "Pro Value" : "ఉత్తమ విలువ" },
    { amount: 100, bonus: 25.0, label: "+$25.00 Bonus", badge: isEn ? "Mega Pack" : "మెగా ప్యాక్" },
  ];

  const quickPresets = currency === "INR" ? inrPresets : usdPresets;

  // Calculate current bonus for the selected or typed amount
  const parsedCustomAmount = parseFloat(customAmountInput) || 0;
  const activePreset = quickPresets.find((p) => p.amount === parsedCustomAmount);
  const calculatedBonus = activePreset
    ? activePreset.bonus
    : parsedCustomAmount >= 1000
    ? parsedCustomAmount * 0.15
    : parsedCustomAmount >= 500
    ? parsedCustomAmount * 0.1
    : 0;

  const totalCreditsToAdd = parsedCustomAmount + calculatedBonus;

  // Filter transactions according to active tab
  const filteredTransactions = transactions.filter((tx) => {
    if (historyTab === "all") return true;
    return tx.type === historyTab;
  });

  const totalDebited = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCredited = transactions
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleSelectPreset = (amount: number) => {
    setSelectedQuickAmount(amount);
    setCustomAmountInput(amount.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setSelectedQuickAmount(num);
    } else {
      setSelectedQuickAmount(0);
    }
  };

  const handleExecuteRecharge = () => {
    if (parsedCustomAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onRecharge(
        parsedCustomAmount,
        calculatedBonus,
        isEn
          ? `Instant Recharge (${currency === "INR" ? "UPI/Card" : "Card"})`
          : `తక్షణ రీఛార్జ్ (${currency === "INR" ? "UPI/కార్డ్" : "కార్డ్"})`
      );
      setIsProcessing(false);
      const symbol = currency === "INR" ? "₹" : "$";
      setShowSuccessNotice(
        isEn
          ? `Successfully added ${symbol}${totalCreditsToAdd.toFixed(2)} to your wallet!`
          : `మీ వాలెట్‌కు ${symbol}${totalCreditsToAdd.toFixed(2)} విజయవంతంగా జోడించబడింది!`
      );
      setTimeout(() => {
        setShowSuccessNotice(null);
      }, 3500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        className="relative bg-[var(--bg-primary)] rounded-[2rem] p-5 sm:p-7 max-w-2xl w-full border border-neutral-300 dark:border-neutral-800 text-[var(--text-primary)] z-10 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col gap-5 my-auto"
      >
        {/* Header with Title and Close */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl nm-inset-sm flex items-center justify-center text-accent bg-accent/10 shrink-0">
              <Icon icon="lucide:wallet" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-emphasis)] flex items-center gap-2">
                {isEn ? "Studio Wallet & Credits" : "స్టూడియో వాలెట్ & క్రెడిట్స్"}
              </h2>
              <p className="text-[11px] font-medium text-[var(--text-primary)] opacity-75">
                {isEn
                  ? "Manage generation balance, recharge credits & view usage history"
                  : "బ్యాలెన్స్ నిర్వహించండి, క్రెడిట్స్ రీఛార్జ్ చేయండి మరియు హిస్టరీ చూడండి"}
              </p>
            </div>
          </div>

          <button
            id="btn-close-wallet-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full nm-outset-sm hover:scale-105 active:scale-95 flex items-center justify-center text-[var(--text-primary)] opacity-80 hover:opacity-100 transition-all cursor-pointer shrink-0"
            title={isEn ? "Close" : "మూసివేయి"}
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert Banner */}
        <AnimatePresence>
          {showSuccessNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5"
            >
              <Icon icon="lucide:check-circle-2" className="w-5 h-5 shrink-0" />
              <span>{showSuccessNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Balance Neumorphic Showcase */}
        <div className="nm-inset rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-panel)]/50">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl nm-outset-sm flex items-center justify-center text-accent shrink-0 bg-[var(--bg-primary)]">
              <Icon icon="lucide:coins" className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-primary)] opacity-70 block">
                {isEn ? "Available Balance" : "అందుబాటులో ఉన్న బ్యాలెన్స్"}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-accent">
                  {currency === "INR" ? `₹${walletBalance.toFixed(2)}` : `$${walletBalance.toFixed(2)}`}
                </span>
                <span className="text-[11px] font-bold opacity-60 font-mono">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end text-right border-t sm:border-t-0 pt-2.5 sm:pt-0 border-black/5 dark:border-white/5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold opacity-70">
                {isEn ? "Total Recharges" : "మొత్తం రీఛార్జ్‌లు"}
              </span>
              <span className="text-xs font-black font-mono text-emerald-500 mt-0.5 flex items-center gap-1">
                <Icon icon="lucide:arrow-down-left" className="w-3.5 h-3.5" />
                {currency === "INR" ? `₹${totalCredited.toFixed(2)}` : `$${totalCredited.toFixed(2)}`}
              </span>
            </div>
            <div className="h-7 w-[1px] bg-black/10 dark:bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold opacity-70">
                {isEn ? "Total Spent" : "మొత్తం ఖర్చు"}
              </span>
              <span className="text-xs font-black font-mono text-rose-500 mt-0.5 flex items-center gap-1">
                <Icon icon="lucide:arrow-up-right" className="w-3.5 h-3.5" />
                {currency === "INR" ? `₹${totalDebited.toFixed(2)}` : `$${totalDebited.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: QUICK RECHARGE CARDS */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-emphasis)] flex items-center gap-1.5">
              <Icon icon="lucide:zap" className="w-3.5 h-3.5 text-accent" />
              {isEn ? "Quick Recharge Packs" : "త్వరిత రీఛార్జ్ ప్యాక్‌లు"}
            </label>
            <span className="text-[10px] font-bold text-accent">
              {isEn ? "Instant Credits" : "తక్షణ క్రెడిట్స్"}
            </span>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {quickPresets.map((p) => {
              const isSelected = selectedQuickAmount === p.amount;
              return (
                <button
                  key={p.amount}
                  id={`btn-quick-recharge-${p.amount}`}
                  type="button"
                  onClick={() => handleSelectPreset(p.amount)}
                  className={`relative p-3 rounded-2xl transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "nm-inset-sm text-accent ring-1.5 ring-accent/60 bg-accent/5"
                      : "nm-outset-sm text-[var(--text-primary)] hover:scale-[1.02] active:scale-[0.98] bg-[var(--bg-panel)]"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase bg-accent text-white shadow-sm tracking-tight">
                      {p.badge}
                    </span>
                  )}
                  <div>
                    <span
                      className={`text-base sm:text-lg font-black font-mono tracking-tight block ${
                        isSelected ? "text-accent" : "text-[var(--text-emphasis)]"
                      }`}
                    >
                      {currency === "INR" ? `₹${p.amount}` : `$${p.amount}`}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold mt-0.5 block ${
                        isSelected ? "text-accent" : "text-emerald-500 dark:text-emerald-400"
                      }`}
                    >
                      {p.label}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[9px] font-bold opacity-75">
                    <span>{isEn ? "Get" : "లభించును"}</span>
                    <span className="font-mono font-extrabold text-[var(--text-emphasis)]">
                      {currency === "INR"
                        ? `₹${p.amount + p.bonus}`
                        : `$${(p.amount + p.bonus).toFixed(2)}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Input & Recharge Action Row */}
          <div className="nm-outset rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center gap-3 bg-[var(--bg-panel)]">
            <div className="relative w-full sm:flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-[var(--text-primary)] opacity-60">
                {currency === "INR" ? "₹" : "$"}
              </span>
              <input
                id="input-custom-recharge-amount"
                type="number"
                min="10"
                step="10"
                value={customAmountInput}
                onChange={handleCustomInputChange}
                placeholder={isEn ? "Enter custom amount..." : "మొత్తం నమోదు చేయండి..."}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl nm-inset text-sm font-mono font-bold text-[var(--text-emphasis)] bg-transparent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              id="btn-execute-recharge"
              type="button"
              disabled={isProcessing || parsedCustomAmount <= 0}
              onClick={handleExecuteRecharge}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl nm-outset-sm flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                parsedCustomAmount > 0 && !isProcessing
                  ? "bg-accent text-white hover:scale-[1.03] active:scale-[0.97] shadow-md shadow-accent/20"
                  : "opacity-50 cursor-not-allowed text-[var(--text-primary)]"
              }`}
            >
              {isProcessing ? (
                <>
                  <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Processing..." : "ప్రాసెస్ అవుతోంది..."}</span>
                </>
              ) : (
                <>
                  <Icon icon="lucide:credit-card" className="w-4 h-4" />
                  <span>
                    {isEn ? "Recharge" : "రీఛార్జ్ చేయండి"}{" "}
                    {currency === "INR"
                      ? `₹${totalCreditsToAdd.toFixed(0)}`
                      : `$${totalCreditsToAdd.toFixed(2)}`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 2: USAGE HISTORY WITH TABS [ALL, DEBIT, CREDIT] */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-emphasis)] flex items-center gap-1.5">
              <Icon icon="lucide:receipt" className="w-3.5 h-3.5 text-accent" />
              {isEn ? "Usage & Transaction History" : "ఖర్చు మరియు లావాదేవీల చరిత్ర"}
            </label>

            {/* TABS: [ALL, DEBIT, CREDIT] */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl nm-inset-sm bg-[var(--bg-panel)] self-start sm:self-auto">
              <button
                id="tab-history-all"
                type="button"
                onClick={() => setHistoryTab("all")}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  historyTab === "all"
                    ? "nm-inset-sm text-accent font-black bg-accent/10"
                    : "nm-outset-sm text-[var(--text-primary)] font-semibold hover:opacity-100 opacity-75"
                }`}
              >
                {isEn ? "All" : "అన్నీ"}
              </button>

              <button
                id="tab-history-debit"
                type="button"
                onClick={() => setHistoryTab("debit")}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  historyTab === "debit"
                    ? "nm-inset-sm text-accent font-black bg-accent/10"
                    : "nm-outset-sm text-[var(--text-primary)] font-semibold hover:opacity-100 opacity-75"
                }`}
              >
                <Icon
                  icon="lucide:arrow-up-right"
                  className={`w-3.5 h-3.5 ${
                    historyTab === "debit" ? "text-accent" : "text-rose-500 opacity-75"
                  }`}
                />
                <span>{isEn ? "Debit" : "డెబిట్"}</span>
              </button>

              <button
                id="tab-history-credit"
                type="button"
                onClick={() => setHistoryTab("credit")}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  historyTab === "credit"
                    ? "nm-inset-sm text-accent font-black bg-accent/10"
                    : "nm-outset-sm text-[var(--text-primary)] font-semibold hover:opacity-100 opacity-75"
                }`}
              >
                <Icon
                  icon="lucide:arrow-down-left"
                  className={`w-3.5 h-3.5 ${
                    historyTab === "credit" ? "text-accent" : "text-emerald-500 opacity-75"
                  }`}
                />
                <span>{isEn ? "Credit" : "క్రెడిట్"}</span>
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {filteredTransactions.length === 0 ? (
              <div className="nm-inset rounded-2xl p-6 text-center text-xs text-[var(--text-primary)] opacity-70 flex flex-col items-center justify-center gap-2">
                <Icon icon="lucide:history" className="w-7 h-7 opacity-40" />
                <p>
                  {isEn
                    ? `No ${historyTab} transactions found.`
                    : `ఎటువంటి ${historyTab} లావాదేవీలు కనుగొనబడలేదు.`}
                </p>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const isDebit = tx.type === "debit";
                return (
                  <div
                    key={tx.id}
                    className="nm-outset-sm rounded-xl p-3 flex items-center justify-between gap-3 bg-[var(--bg-panel)] hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl nm-inset-sm flex items-center justify-center shrink-0 ${
                          isDebit
                            ? "text-rose-500 bg-rose-500/10"
                            : "text-emerald-500 bg-emerald-500/10"
                        }`}
                      >
                        <Icon
                          icon={isDebit ? "lucide:arrow-up-right" : "lucide:arrow-down-left"}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--text-emphasis)] truncate">
                          {isEn ? tx.title : tx.titleTe || tx.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] opacity-70 mt-0.5">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span className="truncate">
                            {isEn
                              ? tx.description || "Studio service"
                              : tx.descriptionTe || tx.description || "స్టూడియో సేవ"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span
                        className={`text-xs sm:text-sm font-black font-mono ${
                          isDebit ? "text-rose-500" : "text-emerald-500"
                        }`}
                      >
                        {isDebit ? "- " : "+ "}
                        {tx.currency === "INR" ? `₹${tx.amount.toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
                      </span>
                      <span className="text-[8.5px] font-extrabold uppercase tracking-tight text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {isEn ? "Success" : "విజయవంతం"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-[var(--text-primary)] opacity-70">
          <div className="flex items-center gap-1.5">
            <Icon icon="lucide:shield-check" className="w-3.5 h-3.5 text-accent" />
            <span>{isEn ? "100% Secure Simulated Wallet" : "100% సురక్షిత స్టూడియో వాలెట్"}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold hover:text-accent cursor-pointer"
          >
            {isEn ? "Done" : "పూర్తయింది"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
