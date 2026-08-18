import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { WalletTransaction, getCreditSettings, formatCredits } from "../utils/wallet";
import { formatPrice } from "../data";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "USD" | "INR";
  walletBalance: number; // in Credits
  transactions: WalletTransaction[];
  onRecharge: (amount: number, bonus: number, note: string) => void;
  onClearHistory?: () => void;
  onResetWalletCache?: () => void;
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
  onClearHistory,
  onResetWalletCache,
  lang,
  usdToInrRate = 83.5,
}) => {
  const isEn = lang === "en";
  const creditSettings = getCreditSettings();
  const [historyTab, setHistoryTab] = useState<"all" | "debit" | "credit">("all");
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showResetWalletConfirm, setShowResetWalletConfirm] = useState<boolean>(false);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number>(
    currency === "INR" ? 500 : 25
  );
  const [customAmountInput, setCustomAmountInput] = useState<string>(
    currency === "INR" ? "500" : "25"
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Conversion rates from Admin settings
  const conversionRate = currency === "INR" ? creditSettings.creditsPerInr : creditSettings.creditsPerUsd;

  // Quick Recharge Packs (Currency price -> Credits + Bonus Credits)
  const inrPresets = [
    { amount: 200, credits: 200, bonus: 20, label: "+20 Bonus Credits", badge: null },
    { amount: 500, credits: 500, bonus: 100, label: "+100 Bonus Credits", badge: isEn ? "Most Popular" : "అత్యంత ప్రజాదరణ" },
    { amount: 1000, credits: 1000, bonus: 300, label: "+300 Bonus Credits", badge: isEn ? "Pro Value" : "ఉత్తమ విలువ" },
    { amount: 2500, credits: 2500, bonus: 1000, label: "+1000 Bonus Credits", badge: isEn ? "Mega Pack" : "మెగా ప్యాక్" },
  ];

  const usdPresets = [
    { amount: 10, credits: 850, bonus: 100, label: "+100 Bonus Credits", badge: null },
    { amount: 25, credits: 2125, bonus: 400, label: "+400 Bonus Credits", badge: isEn ? "Most Popular" : "అత్యంత ప్రజాదరణ" },
    { amount: 50, credits: 4250, bonus: 1000, label: "+1000 Bonus Credits", badge: isEn ? "Pro Value" : "ఉత్తమ విలువ" },
    { amount: 100, credits: 8500, bonus: 2500, label: "+2500 Bonus Credits", badge: isEn ? "Mega Pack" : "మెగా ప్యాక్" },
  ];

  const quickPresets = currency === "INR" ? inrPresets : usdPresets;

  // Calculate current bonus for the selected or typed amount
  const parsedCustomAmount = parseFloat(customAmountInput) || 0;
  const baseCredits = Math.round(parsedCustomAmount * conversionRate);

  const activePreset = quickPresets.find((p) => p.amount === parsedCustomAmount);
  const calculatedBonus = activePreset
    ? activePreset.bonus
    : parsedCustomAmount >= (currency === "INR" ? 1000 : 50)
    ? Math.round(baseCredits * 0.25)
    : parsedCustomAmount >= (currency === "INR" ? 500 : 25)
    ? Math.round(baseCredits * 0.15)
    : 0;

  const totalCreditsToAdd = baseCredits + calculatedBonus;

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
        baseCredits,
        calculatedBonus,
        isEn
          ? `Purchased ${totalCreditsToAdd} Credits via Razorpay (${currency === "INR" ? `₹${parsedCustomAmount}` : `$${parsedCustomAmount}`})`
          : `రేజర్‌పే ద్వారా ${totalCreditsToAdd} క్రెడిట్స్ కొనుగోలు (${currency === "INR" ? `₹${parsedCustomAmount}` : `$${parsedCustomAmount}`})`
      );
      setIsProcessing(false);
      setShowSuccessNotice(
        isEn
          ? `Successfully added ${totalCreditsToAdd} Credits to your studio wallet!`
          : `మీ స్టూడియో వాలెట్‌కు ${totalCreditsToAdd} క్రెడిట్స్ విజయవంతంగా జోడించబడ్డాయి!`
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
              <Icon icon="lucide:zap" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-emphasis)] flex items-center gap-2">
                {isEn ? "Studio Credits & Wallet" : "స్టూడియో క్రెడిట్స్ & వాలెట్"}
              </h2>
              <p className="text-[11px] font-medium text-[var(--text-primary)] opacity-75">
                {isEn
                  ? "Recharge generation credits via Razorpay & track usage"
                  : "రేజర్‌పే ద్వారా క్రెడిట్స్ రీఛార్జ్ చేయండి మరియు ఖర్చును ట్రాక్ చేయండి"}
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

        {/* Current Balance Neumorphic Showcase (Primary Credit Display) */}
        <div className="nm-inset rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-panel)]/50">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl nm-outset-sm flex items-center justify-center text-accent shrink-0 bg-[var(--bg-primary)]">
                <Icon icon="lucide:coins" className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-primary)] opacity-70 block">
                  {isEn ? "Available Credits" : "అందుబాటులో ఉన్న క్రెడిట్స్"}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-accent">
                    {formatCredits(walletBalance)}
                  </span>
                  <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {isEn ? "Active" : "యాక్టివ్"}
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Cache (Reset Wallet to 0 & clear history) Button */}
            {onResetWalletCache && (
              <div className="sm:hidden">
                {!showResetWalletConfirm ? (
                  <button
                    id="btn-clean-wallet-cache-mobile"
                    type="button"
                    onClick={() => setShowResetWalletConfirm(true)}
                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    title={isEn ? "Clean wallet cache & reset credits to 0" : "వాలెట్ కాష్ క్లీన్ చేసి క్రెడిట్స్ 0 చేయండి"}
                  >
                    <Icon icon="lucide:trash-2" className="w-3 h-3" />
                    <span>{isEn ? "Clean Cache" : "క్లీన్ కాష్"}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-rose-500/15 p-1 rounded-xl border border-rose-500/30">
                    <button
                      type="button"
                      onClick={() => {
                        onResetWalletCache();
                        setShowResetWalletConfirm(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-rose-500 text-white text-[9.5px] font-black cursor-pointer"
                    >
                      {isEn ? "Reset 0" : "రీసెట్ 0"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetWalletConfirm(false)}
                      className="px-1.5 py-1 text-[9.5px] font-bold opacity-70 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end text-right border-t sm:border-t-0 pt-2.5 sm:pt-0 border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold opacity-70">
                  {isEn ? "Total Credited" : "మొత్తం జోడించినవి"}
                </span>
                <span className="text-xs font-black font-mono text-emerald-500 mt-0.5 flex items-center gap-1">
                  <Icon icon="lucide:arrow-down-left" className="w-3.5 h-3.5" />
                  {formatCredits(totalCredited)}
                </span>
              </div>
              <div className="h-7 w-[1px] bg-black/10 dark:bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold opacity-70">
                  {isEn ? "Total Used" : "మొత్తం వాడినవి"}
                </span>
                <span className="text-xs font-black font-mono text-rose-500 mt-0.5 flex items-center gap-1">
                  <Icon icon="lucide:arrow-up-right" className="w-3.5 h-3.5" />
                  {formatCredits(totalDebited)}
                </span>
              </div>
            </div>

            {/* Desktop Clean Cache Button */}
            {onResetWalletCache && (
              <div className="hidden sm:flex items-center pl-2 border-l border-black/10 dark:border-white/10">
                {!showResetWalletConfirm ? (
                  <button
                    id="btn-clean-wallet-cache"
                    type="button"
                    onClick={() => setShowResetWalletConfirm(true)}
                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    title={isEn ? "Clean wallet cache & reset credits to 0" : "వాలెట్ కాష్ క్లీన్ చేసి క్రెడిట్స్ 0 చేయండి"}
                  >
                    <Icon icon="lucide:trash-2" className="w-3 h-3" />
                    <span>{isEn ? "Clean Cache" : "క్లీన్ కాష్"}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-rose-500/15 p-1 rounded-xl border border-rose-500/30">
                    <span className="text-[9.5px] font-bold text-rose-500 px-1">
                      {isEn ? "Reset 0?" : "0 చేయాలా?"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onResetWalletCache();
                        setShowResetWalletConfirm(false);
                      }}
                      className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9.5px] font-black hover:bg-rose-600 cursor-pointer"
                    >
                      {isEn ? "Yes" : "అవును"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetWalletConfirm(false)}
                      className="px-1.5 py-0.5 text-[9.5px] font-bold text-[var(--text-primary)] opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      {isEn ? "No" : "వద్దు"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: QUICK RECHARGE CARDS (Credits Focus) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-emphasis)] flex items-center gap-1.5">
              <Icon icon="lucide:zap" className="w-3.5 h-3.5 text-accent" />
              {isEn ? "Purchase Credit Packs" : "క్రెడిట్ ప్యాక్‌లు కొనుగోలు చేయండి"}
            </label>
            <span className="text-[10px] font-bold text-accent">
              {currency === "INR" ? `1 ₹ = ${creditSettings.creditsPerInr} Credit` : `1 $ = ${creditSettings.creditsPerUsd} Credits`}
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
                      {formatCredits(p.credits + p.bonus)}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold mt-0.5 block ${
                        isSelected ? "text-accent" : "text-emerald-500 dark:text-emerald-400"
                      }`}
                    >
                      {p.label}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[9.5px] font-bold opacity-75">
                    <span>{isEn ? "Pay" : "చెల్లించండి"}</span>
                    <span className="font-mono font-extrabold text-[var(--text-emphasis)]">
                      {currency === "INR" ? `₹${p.amount}` : `$${p.amount.toFixed(2)}`}
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
                placeholder={isEn ? "Enter payment amount..." : "చెల్లింపు మొత్తం నమోదు చేయండి..."}
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
                    {isEn ? "Get" : "పొందండి"} {formatCredits(totalCreditsToAdd)} (
                    {currency === "INR" ? `₹${parsedCustomAmount}` : `$${parsedCustomAmount.toFixed(2)}`})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 2: USAGE HISTORY WITH TABS [ALL, DEBIT, CREDIT] & CLEAR OPTION */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-emphasis)] flex items-center gap-1.5">
                <Icon icon="lucide:receipt" className="w-3.5 h-3.5 text-accent" />
                {isEn ? "Credits Usage & Transaction History" : "క్రెడిట్స్ ఖర్చు మరియు లావాదేవీల చరిత్ర"}
              </label>

              {/* Clear History Button */}
              {transactions.length > 0 && onClearHistory && (
                <>
                  {!showClearConfirm ? (
                    <button
                      id="btn-clear-wallet-history"
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer flex items-center gap-1 opacity-80 hover:opacity-100"
                      title={isEn ? "Clear all transaction history" : "లావాదేవీల చరిత్రను తొలగించండి"}
                    >
                      <Icon icon="lucide:trash-2" className="w-3 h-3" />
                      <span>{isEn ? "Clear" : "తొలగించు"}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                      <span className="text-[10px] font-bold text-rose-500">
                        {isEn ? "Confirm clear?" : "తొలగించాలా?"}
                      </span>
                      <button
                        id="btn-confirm-clear-wallet-history"
                        type="button"
                        onClick={() => {
                          onClearHistory();
                          setShowClearConfirm(false);
                        }}
                        className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9.5px] font-black hover:bg-rose-600 cursor-pointer"
                      >
                        {isEn ? "Yes" : "అవును"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-1 py-0.5 text-[9.5px] text-[var(--text-primary)] opacity-70 hover:opacity-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Filter Tabs [All, Spent / Debits, Top-ups / Credits] */}
            <div className="flex items-center p-1 rounded-xl nm-inset-sm gap-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setHistoryTab("all")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  historyTab === "all"
                    ? "bg-accent text-white shadow-xs"
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                {isEn ? "All" : "అన్నీ"} ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab("debit")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  historyTab === "debit"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                {isEn ? "Used" : "వాడినవి"} ({transactions.filter((t) => t.type === "debit").length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab("credit")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  historyTab === "credit"
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                }`}
              >
                {isEn ? "Top-ups" : "రీఛార్జ్‌లు"} ({transactions.filter((t) => t.type === "credit").length})
              </button>
            </div>
          </div>

          {/* Transactions List Area */}
          <div className="nm-inset rounded-2xl p-3 bg-[var(--bg-panel)]/30 max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {filteredTransactions.length === 0 ? (
              <div className="py-8 text-center text-[var(--text-primary)] opacity-50 flex flex-col items-center gap-2">
                <Icon icon="lucide:receipt-text" className="w-7 h-7 stroke-1" />
                <span className="text-xs font-bold">
                  {isEn
                    ? "No transactions found in this view"
                    : "ఈ విభాగంలో లావాదేవీలు లేవు"}
                </span>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const isCredit = tx.type === "credit";
                return (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded-xl nm-outset-sm bg-[var(--bg-panel)] flex items-center justify-between gap-3 hover:scale-[1.005] transition-transform"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        <Icon
                          icon={
                            isCredit
                              ? "lucide:arrow-down-left"
                              : "lucide:sparkles"
                          }
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[var(--text-emphasis)] leading-snug">
                          {isEn ? tx.title : tx.titleTe || tx.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9.5px] opacity-70 mt-0.5 font-medium">
                          <span>{tx.date}</span>
                          {tx.description && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[200px] sm:max-w-[280px]">
                                {isEn ? tx.description : tx.descriptionTe || tx.description}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-black font-mono ${
                          isCredit
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatCredits(tx.amount)}
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
            <span>{isEn ? "100% Secure Studio Credit System (Razorpay Ready)" : "100% సురక్షిత స్టూడియో క్రెడిట్ సిస్టమ్"}</span>
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
