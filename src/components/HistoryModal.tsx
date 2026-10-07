import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import {
  fetchCombinedTimelineApi,
  TimelineItem,
  getAuthToken
} from "../utils/api";
import {
  getInitialWalletTransactions,
  formatCredits
} from "../utils/wallet";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "te";
  currency: "USD" | "INR";
  onOpenWallet?: () => void;
}

export type HistoryCategoryFilter = "payment" | "usage";
export type HistoryPeriodFilter = "1w" | "1m" | "3m" | "6m" | "1y" | "all";

export const PERIOD_FILTERS: { id: HistoryPeriodFilter; labelEn: string; labelTe: string }[] = [
  { id: "1w", labelEn: "1 week", labelTe: "1 వారం" },
  { id: "1m", labelEn: "1 month", labelTe: "1 నెల" },
  { id: "3m", labelEn: "3 months", labelTe: "3 నెలలు" },
  { id: "6m", labelEn: "6 months", labelTe: "6 నెలలు" },
  { id: "1y", labelEn: "1 year", labelTe: "1 సంవత్సరం" },
  { id: "all", labelEn: "All", labelTe: "అన్నీ" },
];

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
  onOpenWallet,
}) => {
  const isEn = lang === "en";
  const PAGE_SIZE = 50;
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filter, setFilter] = useState<HistoryCategoryFilter>("payment");
  const [period, setPeriod] = useState<HistoryPeriodFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const loadData = async (activePeriod = period, reset = true) => {
    if (reset) {
      setIsLoading(true);
      setHasMore(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const currentOffset = reset ? 0 : timeline.length;
      const token = getAuthToken();
      if (token) {
        const res = await fetchCombinedTimelineApi(PAGE_SIZE, currentOffset, undefined, activePeriod);
        if (res && Array.isArray(res.timeline)) {
          if (reset) {
            setTimeline(res.timeline);
          } else {
            setTimeline((prev) => {
              const existingIds = new Set(prev.map((i) => i.id));
              const newItems = res.timeline.filter((i) => !existingIds.has(i.id));
              return [...prev, ...newItems];
            });
          }

          if (res.timeline.length < PAGE_SIZE) {
            setHasMore(false);
          }
          return;
        }
      }

      // Guest / Offline fallback to local transactions
      const localTxs = getInitialWalletTransactions();
      let fallbackTimeline: TimelineItem[] = localTxs.map((t) => ({
        id: t.id,
        type: t.category === "generation" ? "usage" : "payment",
        timestamp: t.timestamp || Date.now(),
        createdAt: new Date(t.timestamp || Date.now()).toISOString(),
        status: t.status,
        creditsChange: t.type === "credit" ? t.amount : -t.amount,
        title: isEn ? t.title : t.titleTe || t.title,
        description: isEn ? t.description : t.descriptionTe || t.description,
        amountFiat: t.fiatAmount,
        currency: t.currency || currency,
        workspace: t.category === "generation" ? "garment" : undefined,
        itemType: t.modelUsed || (t.category === "generation" ? "ai_shoot" : undefined),
        metadata: {
          resolution: t.resolution || "1024x1024",
          aspectRatio: t.aspectRatio || "1:1",
        },
      }));

      // Apply period filter to fallback
      if (activePeriod !== "all") {
        const now = Date.now();
        const periodMsMap: Record<HistoryPeriodFilter, number> = {
          "1w": 7 * 24 * 60 * 60 * 1000,
          "1m": 30 * 24 * 60 * 60 * 1000,
          "3m": 90 * 24 * 60 * 60 * 1000,
          "6m": 180 * 24 * 60 * 60 * 1000,
          "1y": 365 * 24 * 60 * 60 * 1000,
          "all": 0,
        };
        const cutoff = now - (periodMsMap[activePeriod] || 0);
        fallbackTimeline = fallbackTimeline.filter((t) => t.timestamp >= cutoff);
      }

      setTimeline(fallbackTimeline);
      setHasMore(false);
    } catch (err) {
      console.warn("Failed to load timeline data:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData(period, true);
    }
  }, [isOpen, period]);

  // Reset scroll position to top when filter tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [filter]);

  // Infinite scroll trigger
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60 && hasMore && !isLoading && !isLoadingMore) {
      loadData(period, false);
    }
  };

  // Copy text helper with feedback
  const handleCopyText = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  // Filter Items by category (payment or usage) and period
  const filteredItems = useMemo(() => {
    return timeline.filter((item) => {
      if (item.type !== filter) return false;
      return true;
    });
  }, [timeline, filter]);

  // Tab count badges
  const rechargeCount = useMemo(() => {
    return timeline.filter((i) => i.type === "payment").length;
  }, [timeline]);

  const usageCount = useMemo(() => {
    return timeline.filter((i) => i.type === "usage").length;
  }, [timeline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ height: "90dvh", maxHeight: "90dvh" }}
        className="relative w-full max-w-2xl bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] rounded-[2rem] neu-m3-dialog p-4 sm:p-6 flex flex-col z-10 border border-black/5 dark:border-white/10 h-[90vh] h-[90dvh] max-h-[90vh] max-h-[90dvh] shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3.5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl neu-m3-inset-sm flex items-center justify-center text-accent bg-accent/10 shrink-0">
              <Icon icon="lucide:history" className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--md-on-surface)] leading-tight">
                  {isEn ? "Usage & Payment History" : "వాడుక & చెల్లింపుల చరిత్ర"}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono shrink-0">
                  {filteredItems.length} {isEn ? "events" : "ఈవెంట్లు"}
                </span>
              </div>
              <p className="text-[11px] font-medium text-[var(--md-on-surface-variant)] opacity-70 truncate mt-0.5">
                {isEn
                  ? "Real-time audit records for AI generations & wallet recharges"
                  : "ఏఐ ఫోటో షూట్‌లు & వాలెట్ రీఛార్జ్‌ల వాస్తవ రికార్డులు"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Refresh Button */}
            <button
              id="btn-refresh-history"
              type="button"
              onClick={() => loadData(period, true)}
              disabled={isLoading || isLoadingMore}
              className="w-8 h-8 rounded-xl neu-m3-icon-btn flex items-center justify-center text-accent transition-all cursor-pointer shrink-0 disabled:opacity-50"
              title={isEn ? "Refresh Activity" : "తాజాకరించు"}
            >
              <Icon icon="lucide:refresh-cw" className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            {/* Close Button */}
            <button
              id="btn-close-history-modal"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl neu-m3-icon-btn flex items-center justify-center text-[var(--md-on-surface)] opacity-75 hover:opacity-100 transition-all cursor-pointer shrink-0"
              title={isEn ? "Close" : "మూసివేయి"}
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 pb-2 shrink-0 border-b border-black/5 dark:border-white/5">
          {/* Category Tabs: 1st Recharges, 2nd AI Shoots (No 'All' option) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-m3-tabs-track shrink-0">
            {/* 1st Tab: Recharges */}
            <button
              id="filter-payment-history"
              type="button"
              onClick={() => setFilter("payment")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                filter === "payment"
                  ? "neu-m3-outset-sm bg-accent text-white"
                  : "text-[var(--md-on-surface-variant)] opacity-75 hover:opacity-100"
              }`}
            >
              <Icon icon="lucide:credit-card" className="w-3.5 h-3.5" />
              <span>{isEn ? "Recharges" : "రీఛార్జ్‌లు"}</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  filter === "payment" ? "bg-white text-accent" : "bg-accent/15 text-accent"
                }`}
              >
                {rechargeCount}
              </span>
            </button>

            {/* 2nd Tab: AI Shoots */}
            <button
              id="filter-usage-history"
              type="button"
              onClick={() => setFilter("usage")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                filter === "usage"
                  ? "neu-m3-outset-sm bg-accent text-white"
                  : "text-[var(--md-on-surface-variant)] opacity-75 hover:opacity-100"
              }`}
            >
              <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
              <span>{isEn ? "AI Shoots" : "ఏఐ షూట్స్"}</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  filter === "usage" ? "bg-white text-accent" : "bg-accent/15 text-accent"
                }`}
              >
                {usageCount}
              </span>
            </button>
          </div>

          {/* Time Range Filter Tabs: [1 week , 1 month , 3 months , 6 months , 1 year , All] */}
          <div className="flex items-center gap-1 p-1 rounded-2xl neu-m3-tabs-track overflow-x-auto no-scrollbar touch-pan-x">
            {PERIOD_FILTERS.map((p) => {
              const isActive = period === p.id;
              return (
                <button
                  key={p.id}
                  id={`filter-period-${p.id}`}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10.5px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "neu-m3-outset-sm bg-accent text-white font-black"
                      : "text-[var(--md-on-surface-variant)] opacity-70 hover:opacity-100 font-bold"
                  }`}
                >
                  {isEn ? p.labelEn : p.labelTe}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Timeline Activity Feed */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1.5 my-2 overscroll-contain custom-scrollbar touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Loading Skeletons */}
          {isLoading && timeline.length === 0 ? (
            <div className="space-y-2.5 py-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="p-4 rounded-2xl neu-m3-inset-sm bg-[var(--md-surface-container-lowest)] animate-pulse flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10" />
                    <div className="space-y-1.5">
                      <div className="w-40 h-3.5 bg-black/10 dark:bg-white/10 rounded" />
                      <div className="w-24 h-2.5 bg-black/10 dark:bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="w-16 h-5 bg-black/10 dark:bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            /* Empty State */
            <div className="p-8 sm:p-10 rounded-3xl neu-m3-inset-sm bg-[var(--md-surface-container-lowest)] text-center flex flex-col items-center justify-center gap-2.5 text-[var(--md-on-surface)] my-auto min-h-[280px] h-full">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent neu-m3-inset-sm">
                <Icon icon={filter === "payment" ? "lucide:credit-card" : "lucide:camera"} className="w-6 h-6" />
              </div>
              <p className="text-sm font-extrabold text-[var(--md-on-surface)]">
                {filter === "payment"
                  ? isEn
                    ? "No recharge history found"
                    : "రీఛార్జ్ రికార్డులు ఏవీ కనుగొనబడలేదు"
                  : isEn
                  ? "No AI shoot history found"
                  : "ఏఐ షూట్ రికార్డులు ఏవీ కనుగొనబడలేదు"}
              </p>
              <p className="text-xs max-w-sm text-[var(--md-on-surface-variant)] opacity-70 leading-relaxed">
                {filter === "payment"
                  ? isEn
                    ? "No wallet recharge payments found for the selected time range."
                    : "ఎంచుకున్న సమయంలో ఎలాంటి వాలెట్ రీఛార్జ్ చెల్లింపులు కనుగొనబడలేదు."
                  : isEn
                  ? "No AI photo shoot generations recorded for the selected time range."
                    : "ఎంచుకున్న సమయంలో ఎలాంటి ఏఐ ఫోటో షూట్‌లు నమోదు కాలేదు."}
              </p>
              {filter === "payment" && onOpenWallet && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWallet();
                  }}
                  className="mt-2 px-4 py-2 rounded-xl neu-m3-btn-filled text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Icon icon="lucide:zap" className="w-3.5 h-3.5" />
                  <span>{isEn ? "Recharge Studio Credits" : "క్రెడిట్స్ రీఛార్జ్ చేయండి"}</span>
                </button>
              )}
            </div>
          ) : (
            /* Items List */
            filteredItems.map((item) => {
              const isUsage = item.type === "usage";
              const isPaid = item.status === "paid" || item.status === "success";
              const isFailed = item.status === "failed";
              const dateObj = new Date(item.createdAt);
              const dateStr = dateObj.toLocaleDateString(lang === "te" ? "te-IN" : "en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const refId = item.razorpayPaymentId || item.razorpayOrderId || item.id;
              const isCopied = copiedId === refId || copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl neu-m3-card bg-[var(--md-surface-container)] flex flex-col gap-2.5 transition-all"
                >
                  {/* Card Main Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Icon Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 neu-m3-inset-sm ${
                          isUsage
                            ? "bg-accent/10 text-accent"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        <Icon
                          icon={
                            isUsage
                              ? item.workspace === "jewelry"
                                ? "lucide:gem"
                                : "lucide:shirt"
                              : "lucide:arrow-down-left"
                          }
                          className="w-4 h-4"
                        />
                      </div>

                      {/* Info Center */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-xs text-[var(--md-on-surface)] break-words">
                            {isEn ? item.title : item.titleTe || item.title}
                          </span>

                          {/* Category Badge */}
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 uppercase tracking-tight flex items-center gap-1 ${
                              isUsage
                                ? "bg-accent/15 text-accent"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            <Icon
                              icon={isUsage ? "lucide:sparkles" : "lucide:shield-check"}
                              className="w-2.5 h-2.5"
                            />
                            <span>
                              {isUsage
                                ? isEn
                                  ? "AI Shoot"
                                  : "ఏఐ షూట్"
                                : isEn
                                ? "Recharge"
                                : "రీఛార్జ్"}
                            </span>
                          </span>

                          {/* Workspace / Item Chip for Usage */}
                          {isUsage && item.itemType && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5 text-[var(--md-on-surface-variant)] opacity-80 uppercase">
                              {item.itemType}
                            </span>
                          )}
                        </div>

                        {/* Metadata & Technical Specs */}
                        <div className="flex items-center gap-2 text-[10px] text-[var(--md-on-surface-variant)] opacity-75 flex-wrap mt-1">
                          <span className="flex items-center gap-1">
                            <Icon icon="lucide:clock" className="w-3 h-3 opacity-60" />
                            <span>{dateStr}</span>
                          </span>

                          {isUsage && item.metadata?.resolution && (
                            <span className="px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5 font-mono text-[9px]">
                              {item.metadata.resolution}
                            </span>
                          )}

                          {isUsage && item.metadata?.aspectRatio && (
                            <span className="px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5 font-mono text-[9px]">
                              {item.metadata.aspectRatio}
                            </span>
                          )}

                          {isUsage && item.latencyMs && (
                            <span className="text-[9.5px] opacity-70">
                              ⚡ {(item.latencyMs / 1000).toFixed(1)}s
                            </span>
                          )}

                          {/* Reference ID with quick copy */}
                          {refId && (
                            <button
                              type="button"
                              onClick={() => handleCopyText(refId, refId)}
                              className="inline-flex items-center gap-1 font-mono text-[9px] opacity-70 hover:opacity-100 hover:text-accent cursor-pointer transition-colors"
                              title="Click to copy Reference ID"
                            >
                              <span>
                                • ID: {refId.length > 18 ? `${refId.slice(0, 14)}...` : refId}
                              </span>
                              <Icon
                                icon={isCopied ? "lucide:check" : "lucide:copy"}
                                className={`w-2.5 h-2.5 ${isCopied ? "text-emerald-500" : ""}`}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Amount & Status Badge */}
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-black font-mono block ${
                          isUsage ? "text-rose-500" : "text-emerald-500"
                        }`}
                      >
                        {item.creditsChange > 0
                          ? `+${formatCredits(item.creditsChange)}`
                          : item.creditsChange < 0
                          ? `-${formatCredits(Math.abs(item.creditsChange))}`
                          : "0 Credits"}
                      </span>

                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider ${
                          isFailed
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : isPaid
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Failure Error Message Banner */}
                  {isFailed && item.errorMessage && (
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-medium flex items-center gap-1.5">
                      <Icon icon="lucide:alert-circle" className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.errorMessage}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Infinite Scroll Activity Loader */}
          {isLoadingMore && (
            <div className="py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-accent">
              <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
              <span>{isEn ? "Loading more activity..." : "మరిన్ని రికార్డులు లోడ్ అవుతున్నాయి..."}</span>
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && filteredItems.length > 4 && (
            <div className="py-2 text-center text-[10px] font-bold text-[var(--md-on-surface-variant)] opacity-40">
              {isEn ? "• All records loaded •" : "• అన్ని రికార్డులు లోడ్ అయ్యాయి •"}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10.5px] text-[var(--md-on-surface-variant)] opacity-80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[var(--md-on-surface)]">
              {isEn ? "100% Encrypted & Live Audited Activity" : "100% భద్రపరచబడిన లైవ్ ఆడిట్ రికార్డులు"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWallet && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWallet();
                }}
                className="font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Icon icon="lucide:zap" className="w-3 h-3" />
                <span>{isEn ? "Top Up Credits" : "క్రెడిట్స్ రీఛార్జ్"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="font-black cursor-pointer px-4 py-1.5 rounded-xl neu-m3-btn-tonal text-xs"
            >
              {isEn ? "Done" : "పూర్తయింది"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
