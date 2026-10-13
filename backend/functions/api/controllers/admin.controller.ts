import { Request, Response } from "express";
import { db } from "../config";
import { users, payments, usage } from "../config/schema";
import { eq, desc, sql } from "drizzle-orm";
import { UsageService } from "../services/usage.service";
import { NotFoundError, asyncHandler } from "../utils";

export {
  adjustCreditsSchema,
  AdjustCreditsSchema,
} from "../schemas/admin.schema";

export class AdminController {
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 50), 100);
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const userList = await db
      .select({
        id: users.id,
        phone: users.phone,
        role: users.role,
        walletBalance: users.walletBalance,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return res.status(200).json({ success: true, users: userList });
  });

  static adjustCredits = asyncHandler(async (req: Request, res: Response) => {
    const { userId, creditChange, reason } = req.body;

    const [updatedUser] = await db
      .update(users)
      .set({
        walletBalance: sql`GREATEST(0, ${users.walletBalance} + ${creditChange})`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError(`User with ID '${userId}' not found.`, undefined, "USER_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      message: `Wallet balance adjusted by ${creditChange >= 0 ? "+" : ""}${creditChange} credits.`,
      newBalance: updatedUser.walletBalance,
      reason,
    });
  });

  static toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { isActive } = req.body;

    const [user] = await db
      .update(users)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new NotFoundError(`User with ID '${userId}' not found.`, undefined, "USER_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        isActive: user.isActive,
      },
    });
  });

  static getStats = asyncHandler(async (_req: Request, res: Response) => {
    const [totalUsersRes] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [totalGenerationsRes] = await db.select({ count: sql<number>`count(*)::int` }).from(usage);
    const [totalRevenueRes] = await db
      .select({ sum: sql<number>`coalesce(sum(${payments.amount}), 0)::int` })
      .from(payments)
      .where(eq(payments.status, "paid"));

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsersRes?.count || 0,
        totalGenerations: totalGenerationsRes?.count || 0,
        totalRevenuePaise: totalRevenueRes?.sum || 0,
        totalRevenueInr: (totalRevenueRes?.sum || 0) / 100,
      },
    });
  });

  static getUsageLogs = asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 50), 100);
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const logs = await UsageService.getAllUsageLogs(limit, offset);

    return res.status(200).json({
      success: true,
      logs,
    });
  });
}
