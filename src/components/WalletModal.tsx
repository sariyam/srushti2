import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { WalletTransaction, getCreditSettings, formatCredits } from "../utils/wallet";
import {
  getAuthToken,
  createPaymentOrderApi,
  verifyPaymentApi,
  loadRazorpayCheckoutScript,
  fetchCurrentUserApi,
} from "../utils/api";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "USD" | "INR";
  walletBalance: number; // in Credits
  transactions?: WalletTransaction[];
  onRecharge: (amount: number, bonus: number, note: string) => void;
  onClearHistory?: () => void;
  onOpenHistory?: () => void;
  lang: "en" | "te";
  usdToInrRate?: number;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currency,
  walletBalance,
  onRecharge,
  onOpenHistory,
  lang,
  usdToInrRate = 83.5,
}) => {
  const isEn = lang === "en";
  const creditSettings = getCreditSettings();
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number>(
    currency === "INR" ? 500 : 25
  );
  const [customAmountInput, setCustomAmountInput] = useState<string>(
    currency === "INR" ? "500" : "25"
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  const handleSelectPreset = (amount: number) => {
    setSelectedQuickAmount(amount);
    setCustomAmountInput(amount.toString());
    setPaymentError(null);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountInput(val);
    setPaymentError(null);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setSelectedQuickAmount(num);
    } else {
      setSelectedQuickAmount(0);
    }
  };

  const handleExecuteRecharge = async () => {
    if (parsedCustomAmount <= 0) return;

    setPaymentError(null);
    const token = getAuthToken();

    // Ensure user has an active session before initiating payment
    if (!token) {
      setPaymentError(
        isEn
          ? "Please sign in to your mobile account before recharging credits."
          : "క్రెడిట్లను రీఛార్జ్ చేయడానికి దయచేసి ముందుగా మీ ఖాతాలోకి సైన్ ఇన్ అవ్వండి."
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay Checkout SDK is ready in browser
      const scriptReady = await loadRazorpayCheckoutScript();
      if (!scriptReady || !(window as any).Razorpay) {
        throw new Error(
          isEn
            ? "Razorpay checkout gateway could not be loaded. Please check your network connection."
            : "Razorpay గేట్‌వే లోడ్ కాలేదు. దయచేసి నెట్‌వర్క్ కనెక్షన్‌ను తనిఖీ చేయండి."
        );
      }

      // 2. Request backend to create server-side Razorpay order
      const packTitle = activePreset
        ? `Pack ₹${activePreset.amount} (${activePreset.credits}+${activePreset.bonus} Credits)`
        : `${totalCreditsToAdd} Credits Top-up`;

      const orderRes = await createPaymentOrderApi({
        amount: parsedCustomAmount,
        credits: totalCreditsToAdd,
        packName: packTitle,
      });

      const { order } = orderRes;
      if (!order || !order.orderId) {
        throw new Error(
          isEn
            ? "Failed to generate payment order from server."
            : "సర్వర్ నుండి చెల్లింపు ఆర్డర్‌ను ప్రారంభించడం విఫలమైంది."
        );
      }

      const userPhone = localStorage.getItem("srushti_user_phone") || "";

      // 3. Configure Razorpay Standard Checkout with custom payment configuration
      const customConfigId = order.configId || "config_SVPwn8f33zfhsP";
      const options = {
        key: order.keyId,
        amount: order.amount, // in paise
        currency: order.currency || "INR",
        name: "Srushti AI",
        description: `${totalCreditsToAdd} Studio Credits Top-up`,
        image: "/assets/front_logo.png",
        order_id: order.orderId,
        checkout_config_id: customConfigId,
        config_id: customConfigId,
        prefill: {
          contact: userPhone ? (userPhone.startsWith("+91") ? userPhone : `+91${userPhone}`) : "",
        },
        theme: {
          color: "#32cf11",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response: any) => {
          try {
            setIsProcessing(true);

            // 4. Verify HMAC-SHA256 signature and atomically credit wallet in database
            const verifyRes = await verifyPaymentApi({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              onRecharge(
                baseCredits,
                calculatedBonus,
                isEn
                  ? `Purchased ${totalCreditsToAdd} Credits via Razorpay (${response.razorpay_payment_id})`
                  : `రేజర్‌పే ద్వారా ${totalCreditsToAdd} క్రెడిట్స్ కొనుగోలు (${response.razorpay_payment_id})`
              );

              // Sync fresh balance from server
              await fetchCurrentUserApi();

              setShowSuccessNotice(
                isEn
                  ? `Payment Successful! Added ${totalCreditsToAdd} Credits. (ID: ${response.razorpay_payment_id})`
                  : `చెల్లింపు విజయవంతమైంది! ${totalCreditsToAdd} క్రెడిట్స్ జమయ్యాయి. (ID: ${response.razorpay_payment_id})`
              );

              setTimeout(() => {
                setShowSuccessNotice(null);
              }, 5000);
            }
          } catch (verifyErr: any) {
            console.error("Razorpay verification error:", verifyErr);
            setPaymentError(
              verifyErr.message ||
                (isEn
                  ? "Payment verification failed. Please contact support with your Payment ID."
                  : "చెల్లింపు ధృవీకరణ విఫలమైంది. దయచేసి పేమెంట్ ఐడీతో సపోర్ట్‌ను సంప్రదించండి.")
            );
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", (resp: any) => {
        setIsProcessing(false);
        setPaymentError(
          resp.error?.description ||
            (isEn
              ? "Payment was declined or cancelled. Please try again."
              : "చెల్లింపు విఫలమైంది లేదా రద్దు చేయబడింది. దయచేసి మళ్లీ ప్రయత్నించండి.")
        );
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setIsProcessing(false);
      setPaymentError(
        err.message ||
          (isEn
            ? "Could not start payment. Please check your network and try again."
            : "చెల్లింపు ప్రారంభించడం సాధ్యం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.")
      );
    }
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
        className="relative bg-[var(--bg-primary)] rounded-[2rem] p-5 sm:p-7 max-w-xl w-full border border-neutral-300 dark:border-neutral-800 text-[var(--text-primary)] z-10 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col gap-5 my-auto"
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
                  ? "Recharge generation credits instantly via Razorpay"
                  : "రేజర్‌పే ద్వారా క్రెడిట్స్ తక్షణమే రీఛార్జ్ చేయండి"}
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

        {/* Payment Error Alert Banner */}
        <AnimatePresence>
          {paymentError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Icon icon="lucide:alert-circle" className="w-5 h-5 shrink-0 text-red-500" />
                <span className="break-words leading-snug">{paymentError}</span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentError(null)}
                className="p-1 text-red-500 hover:opacity-80 cursor-pointer shrink-0"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Balance Neumorphic Showcase (Primary Credit Display) */}
        <div className="nm-inset rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 bg-[var(--bg-panel)]/50">
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
        </div>

        {/* Quick Recharge Section */}
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

          {/* Direct Link to Usage & History Modal */}
          {onOpenHistory && (
            <div className="flex items-center justify-between p-3 rounded-2xl nm-inset-sm bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-accent/10 text-accent shrink-0">
                  <Icon icon="lucide:history" className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-[var(--text-emphasis)] block">
                    {isEn ? "Usage & Payment History" : "వాడుక & చెల్లింపుల చరిత్ర"}
                  </span>
                  <span className="text-[10px] text-[var(--text-primary)] opacity-70">
                    {isEn ? "View logs from AI generations & Razorpay payments" : "ఏఐ జనరేషన్‌లు & Razorpay చెల్లింపుల వివరాలు చూడండి"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHistory();
                }}
                className="px-3 py-1.5 rounded-xl nm-outset-sm bg-accent/10 hover:bg-accent text-accent hover:text-white text-xs font-black transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              >
                <span>{isEn ? "View Logs" : "చూడండి"}</span>
                <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badge & Compliance Links */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[var(--text-primary)] opacity-80">
          <div className="flex flex-wrap items-center gap-1.5">
            <Icon icon="lucide:shield-check" className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>{isEn ? "100% Secure via Razorpay (PCI-DSS Level 1) •" : "Razorpay ద్వారా 100% సురక్షితం •"}</span>
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline font-bold hover:opacity-80"
            >
              {isEn ? "Terms" : "నిబంధనలు"}
            </a>
            <span>&</span>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline font-bold hover:opacity-80"
            >
              {isEn ? "Privacy" : "గోప్యత"}
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold hover:text-accent cursor-pointer ml-auto"
          >
            {isEn ? "Done" : "పూర్తయింది"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
