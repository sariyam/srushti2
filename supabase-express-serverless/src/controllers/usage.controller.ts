import { Request, Response, NextFunction } from "express";
import { UsageService } from "../services/usage.service";
import { z } from "zod";

export const recordUsageSchema = z.object({
  workspace: z.enum(["garment", "jewelry", "face", "general"]),
  itemType: z.string().min(1, "itemType is required (e.g. saree, necklace)"),
  creditsDeducted: z.number().int().min(0).default(1),
  prompt: z.string().optional(),
  status: z.enum(["pending", "success", "failed"]).default("success"),
  errorMessage: z.string().optional(),
  latencyMs: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export class UsageController {
  static async recordUsage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const result = await UsageService.recordUsage({
        userId: req.user.userId,
        ...req.body,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;

      const history = await UsageService.getUserUsageHistory(req.user.userId, limit, offset);

      return res.status(200).json({
        success: true,
        history,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getBalance(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const balance = await UsageService.getUserBalance(req.user.userId);

      return res.status(200).json({
        success: true,
        balance,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const type = (req.query.type as "payment" | "usage") || undefined;
      const period = (req.query.period as string) || undefined;

      const result = await UsageService.getCombinedTimeline(
        req.user.userId,
        limit,
        offset,
        type,
        period
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
