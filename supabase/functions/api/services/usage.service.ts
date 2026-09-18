import { db } from "../config";
import { usage, users, payments } from "../config/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";
import { NotFoundError, PaymentRequiredError } from "../utils/errors";

export interface RecordUsageParams {
  userId: string;
  workspace: "garment" | "jewelry" | "face" | "general";
  itemType: string;
  creditsDeducted?: number;
  prompt?: string;
  status?: "pending" | "success" | "failed";
  errorMessage?: string;
  latencyMs?: number;
  metadata?: Record<string, any>;
}

export class UsageService {
  /**
   * Atomically checks wallet balance, deducts credits, and logs the AI usage
   */
  static async recordUsage({
    userId,
    workspace,
    itemType,
    creditsDeducted = 1,
    prompt,
    status = "success",
    errorMessage,
    latencyMs,
    metadata,
  }: RecordUsageParams) {
    return await db.transaction(async (tx) => {
      // 1. Fetch user & check sufficient balance
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new NotFoundError(`User with ID '${userId}' not found.`);
      }

      if (user.walletBalance < creditsDeducted) {
        throw new PaymentRequiredError(
          `Insufficient wallet credits. You have ${user.walletBalance} credit${user.walletBalance === 1 ? "" : "s"}, but ${creditsDeducted} is required to generate this item.`,
          {
            availableCredits: user.walletBalance,
            requiredCredits: creditsDeducted,
            workspace,
            itemType,
          }
        );
      }

      // 2. Deduct credits if status is success or pending
      if (status !== "failed" && creditsDeducted > 0) {
        await tx
          .update(users)
          .set({
            walletBalance: sql`${users.walletBalance} - ${creditsDeducted}`,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      }

      // 3. Log usage entry
      const [usageLog] = await tx
        .insert(usage)
        .values({
          userId,
          workspace,
          itemType,
          creditsDeducted,
          prompt,
          status,
          errorMessage,
          latencyMs,
          metadata,
        })
        .returning();

      const [updatedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return {
        usageLog,
        remainingCredits: updatedUser.walletBalance,
      };
    });
  }

  /**
   * Fetches paginated AI usage logs for a specific user
   */
  static async getUserUsageHistory(userId: string, limit = 20, offset = 0) {
    const logs = await db
      .select()
      .from(usage)
      .where(eq(usage.userId, userId))
      .orderBy(desc(usage.createdAt))
      .limit(limit)
      .offset(offset);

    return logs;
  }

  /**
   * Returns current user balance and credit stats
   */
  static async getUserBalance(userId: string) {
    const [user] = await db
      .select({
        id: users.id,
        phone: users.phone,
        walletBalance: users.walletBalance,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Fetches paginated AI usage logs across all users (Admin view)
   */
  static async getAllUsageLogs(limit = 50, offset = 0) {
    const logs = await db
      .select({
        id: usage.id,
        userId: usage.userId,
        userPhone: users.phone,
        workspace: usage.workspace,
        itemType: usage.itemType,
        creditsDeducted: usage.creditsDeducted,
        prompt: usage.prompt,
        status: usage.status,
        errorMessage: usage.errorMessage,
        latencyMs: usage.latencyMs,
        metadata: usage.metadata,
        createdAt: usage.createdAt,
      })
      .from(usage)
      .leftJoin(users, eq(usage.userId, users.id))
      .orderBy(desc(usage.createdAt))
      .limit(limit)
      .offset(offset);

    return logs;
  }

  /**
   * Fetches unified chronological timeline of user's activity from both [payments, usage] tables
   * Supports filtering by type ('payment' | 'usage') and time range period ('1w', '1m', '3m', '6m', '1y', 'all')
   */
  static async getCombinedTimeline(
    userId: string,
    limit = 50,
    offset = 0,
    type?: "payment" | "usage",
    period?: string
  ) {
    const sinceDate = this.getPeriodStartDate(period);

    // 1. Fetch user payments if requested or when type is not specified
    let paymentItems: any[] = [];
    if (!type || type === "payment") {
      const paymentConditions = [eq(payments.userId, userId)];
      if (sinceDate) {
        paymentConditions.push(gte(payments.createdAt, sinceDate));
      }

      const userPayments = await db
        .select({
          id: payments.id,
          amount: payments.amount,
          currency: payments.currency,
          status: payments.status,
          creditsAdded: payments.creditsAdded,
          razorpayOrderId: payments.razorpayOrderId,
          razorpayPaymentId: payments.razorpayPaymentId,
          metadata: payments.metadata,
          createdAt: payments.createdAt,
        })
        .from(payments)
        .where(and(...paymentConditions))
        .orderBy(desc(payments.createdAt))
        .limit(offset + limit);

      paymentItems = userPayments.map((p) => ({
        id: p.id,
        type: "payment" as const,
        timestamp: new Date(p.createdAt).getTime(),
        createdAt: p.createdAt,
        status: p.status,
        creditsChange: p.creditsAdded,
        amountPaise: p.amount,
        amountFiat: p.amount / 100,
        currency: p.currency,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        packName: p.metadata?.packName,
        title: `Top-up / Recharge (${p.currency === "INR" ? "₹" : "$"}${p.amount / 100})`,
        titleTe: `రీఛార్జ్ చెల్లింపు (${p.currency === "INR" ? "₹" : "$"}${p.amount / 100})`,
        description: p.razorpayPaymentId ? `Razorpay ID: ${p.razorpayPaymentId}` : `Order: ${p.razorpayOrderId}`,
        descriptionTe: p.razorpayPaymentId ? `రేజర్‌పే ID: ${p.razorpayPaymentId}` : `ఆర్డర్: ${p.razorpayOrderId}`,
      }));
    }

    // 2. Fetch user AI generation usages if requested or when type is not specified
    let usageItems: any[] = [];
    if (!type || type === "usage") {
      const usageConditions = [eq(usage.userId, userId)];
      if (sinceDate) {
        usageConditions.push(gte(usage.createdAt, sinceDate));
      }

      const userUsages = await db
        .select({
          id: usage.id,
          workspace: usage.workspace,
          itemType: usage.itemType,
          creditsDeducted: usage.creditsDeducted,
          prompt: usage.prompt,
          status: usage.status,
          errorMessage: usage.errorMessage,
          latencyMs: usage.latencyMs,
          metadata: usage.metadata,
          createdAt: usage.createdAt,
        })
        .from(usage)
        .where(and(...usageConditions))
        .orderBy(desc(usage.createdAt))
        .limit(offset + limit);

      usageItems = userUsages.map((u) => ({
        id: u.id,
        type: "usage" as const,
        timestamp: new Date(u.createdAt).getTime(),
        createdAt: u.createdAt,
        status: u.status,
        creditsChange: -u.creditsDeducted,
        workspace: u.workspace,
        itemType: u.itemType,
        prompt: u.prompt,
        errorMessage: u.errorMessage,
        latencyMs: u.latencyMs,
        metadata: u.metadata,
        title: `${u.workspace === "garment" ? "Garment" : "Jewelry"} Shoot • ${u.itemType.toUpperCase()}`,
        titleTe: `${u.workspace === "garment" ? "బట్టల" : "నగల"} షూట్ • ${u.itemType.toUpperCase()}`,
        description: `${u.metadata?.resolution || "1024x1024"} • ${u.metadata?.aspectRatio || "1:1"}${u.latencyMs ? ` • ${u.latencyMs}ms` : ""}`,
        descriptionTe: `${u.metadata?.resolution || "1024x1024"} • ${u.metadata?.aspectRatio || "1:1"}${u.latencyMs ? ` • ${u.latencyMs}ms` : ""}`,
      }));
    }

    // Merge and sort by timestamp descending
    const combined = [...paymentItems, ...usageItems]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(offset, offset + limit);

    return {
      timeline: combined,
      summary: {
        totalGenerations: usageItems.length,
        totalPayments: paymentItems.filter((p) => p.status === "paid").length,
        totalCreditsSpent: usageItems.reduce((acc, u) => acc + (u.creditsDeducted || 0), 0),
        totalCreditsPurchased: paymentItems
          .filter((p) => p.status === "paid")
          .reduce((acc, p) => acc + (p.creditsChange || 0), 0),
      },
    };
  }

  private static getPeriodStartDate(period?: string): Date | null {
    if (!period || period === "all") return null;
    const now = Date.now();
    switch (period.toLowerCase()) {
      case "1w":
      case "1week":
        return new Date(now - 7 * 24 * 60 * 60 * 1000);
      case "1m":
      case "1month":
        return new Date(now - 30 * 24 * 60 * 60 * 1000);
      case "3m":
      case "3months":
        return new Date(now - 90 * 24 * 60 * 60 * 1000);
      case "6m":
      case "6months":
        return new Date(now - 180 * 24 * 60 * 60 * 1000);
      case "1y":
      case "1year":
        return new Date(now - 365 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  }
}
