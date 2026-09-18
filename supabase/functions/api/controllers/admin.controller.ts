import { Request, Response, NextFunction } from "express";
import { db } from "../config";
import { users, payments, usage } from "../config/schema";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { UsageService } from "../services/usage.service";

export const adjustCreditsSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  creditChange: z.number().int("creditChange must be an integer"), // positive to add, negative to deduct
  reason: z.string().optional(),
});

export class AdminController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

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
    } catch (error: any) {
      next(error);
    }
  }

  static async adjustCredits(req: Request, res: Response, next: NextFunction) {
    try {
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
        return res.status(404).json({ success: false, error: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: `Wallet balance adjusted by ${creditChange >= 0 ? "+" : ""}${creditChange} credits.`,
        newBalance: updatedUser.walletBalance,
        reason,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
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
        return res.status(404).json({ success: false, error: "User not found" });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          isActive: user.isActive,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (error: any) {
      next(error);
    }
  }

  static async getUsageLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      const logs = await UsageService.getAllUsageLogs(limit, offset);

      return res.status(200).json({
        success: true,
        logs,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
