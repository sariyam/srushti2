import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  fetchAdminUsersApi,
  adjustAdminCreditsApi,
  toggleAdminUserStatusApi,
  fetchAdminUsageLogsApi,
  AdminUserRecord,
  UsageLogItem,
} from "../../utils/api";

interface UsersAuditTabProps {
  lang: "en" | "te";
}

export const UsersAuditTab: React.FC<UsersAuditTabProps> = ({ lang }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [creditAdjustmentAmount, setCreditAdjustmentAmount] = useState<string>("50");
  const [adjustmentReason, setAdjustmentReason] = useState<string>("Admin topup");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEn = lang === "en";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [u, logs] = await Promise.all([
        fetchAdminUsersApi(),
        fetchAdminUsageLogsApi(30),
      ]);
      setUsers(u);
      setUsageLogs(logs);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load users and logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amount = parseFloat(creditAdjustmentAmount);
    if (isNaN(amount) || amount === 0) {
      setErrorMsg(isEn ? "Please enter a valid credit amount" : "దయచేసి సరైన క్రెడిట్ మొత్తాన్ని నమోదు చేయండి");
      return;
    }

    setIsAdjusting(true);
    setErrorMsg(null);
    try {
      await adjustAdminCreditsApi(selectedUser.id, amount, adjustmentReason);
      setToastMsg(
        isEn
          ? `Successfully adjusted ${amount > 0 ? "+" : ""}${amount} credits for ${selectedUser.phone}`
          : `${selectedUser.phone} కోసం ${amount > 0 ? "+" : ""}${amount} క్రెడిట్స్ సర్దుబాటు చేయబడ్డాయి`
      );
      setSelectedUser(null);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to adjust credits");
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    try {
      await toggleAdminUserStatusApi(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
      setToastMsg(isEn ? "User status updated" : "వినియోగదారు స్థితి నవీకరించబడింది");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--md-on-surface)] flex items-center gap-2">
            <Icon icon="lucide:users" className="w-5 h-5 text-[var(--md-primary)]" />
            <span>{isEn ? "Users & Credit Audit Ledger" : "వినియోగదారులు & క్రెడిట్ ఖాతాలు"}</span>
          </h2>
          <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">
            {isEn
              ? "Audit authenticated users, grant promotional wallet credits, and view generation logs."
              : "వినియోగదారుల వ్యాలెట్ బ్యాలెన్స్‌లను నిర్వహించండి మరియు జనరేషన్ లాగ్‌లను చూడండి."}
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="m3-btn-outlined px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Icon icon="lucide:refresh-cw" className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isEn ? "Refresh" : "తాజాకరించు"}</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-2xl bg-[var(--md-success-container)] text-[var(--md-on-success-container)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Icon icon="lucide:check-circle" className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-[var(--md-error-container)] text-[var(--md-on-error-container)] text-xs font-bold flex items-center gap-2">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Users Table Card */}
      <div className="m3-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--md-outline)] flex items-center gap-2">
            <Icon icon="lucide:user-check" className="w-4 h-4 text-[var(--md-primary)]" />
            <span>{isEn ? "Registered User Accounts" : "నమోదిత ఖాతాలు"} ({users.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[var(--md-outline-variant)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--md-surface-container)] border-b border-[var(--md-outline-variant)] text-[10px] font-black uppercase tracking-wider text-[var(--md-on-surface)]">
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-right">Wallet Balance</th>
                <th className="py-2.5 px-3">Joined Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--md-outline-variant)]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--md-surface-variant)] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[var(--md-on-surface)]">
                    {u.phone}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`m3-badge text-[9px] px-2 py-0.5 uppercase tracking-wider font-extrabold ${
                        u.role === "admin"
                          ? "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]"
                          : "bg-[var(--md-surface-container-high)] text-[var(--md-on-surface-variant)]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-[var(--md-primary)]">
                    {Number(u.walletBalance || 0).toFixed(1)} Credits
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-[var(--md-on-surface-variant)]">
                    {new Date(u.createdAt).toLocaleDateString(isEn ? "en-US" : "te-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="m3-btn-tonal px-3 py-1 rounded-full text-xs font-bold cursor-pointer"
                    >
                      <Icon icon="lucide:plus" className="w-3.5 h-3.5 inline mr-1" />
                      <span>{isEn ? "Adjust Credits" : "క్రెడిట్స్ సర్దుబాటు"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live AI Generation Audit Log */}
      <div className="m3-card p-5 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--md-outline)] flex items-center gap-2">
          <Icon icon="lucide:activity" className="w-4 h-4 text-emerald-500" />
          <span>{isEn ? "Live Generation Audit Activity" : "లైవ్ షూట్ ఆడిట్ లాగ్"}</span>
        </h3>

        {usageLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--md-outline)]">
            {isEn ? "No recent generation logs found." : "ఇటీవలి లాగ్‌లు ఏవీ లేవు."}
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {usageLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-[var(--md-surface-container)] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon icon="lucide:camera" className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-[var(--md-on-surface)] capitalize">
                      {log.workspace} Shoot • {log.itemType}
                    </div>
                    <div className="text-[10px] text-[var(--md-on-surface-variant)] flex items-center gap-2">
                      <span>{log.userPhone || "Guest"}</span>
                      <span>•</span>
                      <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                      {log.latencyMs && <span>• {log.latencyMs}ms</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-rose-500 text-xs block">
                    -{Number(log.creditsDeducted || 1).toFixed(1)} Credits
                  </span>
                  <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credit Adjustment Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="m3-card-elevated w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--md-outline-variant)] pb-3">
              <h3 className="text-sm font-black text-[var(--md-on-surface)]">
                {isEn ? `Adjust Credits for ${selectedUser.phone}` : `${selectedUser.phone} కోసం క్రెడిట్స్`}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-7 h-7 rounded-full hover:bg-[var(--md-surface-variant)] flex items-center justify-center text-[var(--md-outline)] cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustCredits} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Credit Amount (+ or -)" : "క్రెడిట్ మొత్తం"}
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={creditAdjustmentAmount}
                  onChange={(e) => setCreditAdjustmentAmount(e.target.value)}
                  className="m3-text-field w-full px-3 py-2 text-xs font-mono font-black"
                  placeholder="+50 or -10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--md-on-surface)]">
                  {isEn ? "Audit Reason / Reference" : "కారణం / రిఫరెన్స్"}
                </label>
                <input
                  type="text"
                  required
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="m3-text-field w-full px-3 py-2 text-xs font-bold"
                  placeholder="e.g. Promotional campaign grant"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--md-outline-variant)]">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="m3-btn-text px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
                >
                  {isEn ? "Cancel" : "రద్దు"}
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="m3-btn-filled px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer disabled:opacity-50"
                >
                  {isAdjusting ? "Updating..." : isEn ? "Confirm Adjustment" : "నిర్ధారించండి"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
