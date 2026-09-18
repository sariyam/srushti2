import { Request, Response } from "express";
import { UsageService } from "../services/usage.service";
import { UnauthorizedError, asyncHandler } from "../utils";

export {
  recordUsageSchema,
  RecordUsageSchema,
} from "../schemas/usage.schema";

export class UsageController {
  static recordUsage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const result = await UsageService.recordUsage({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  });

  static getHistory = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const history = await UsageService.getUserUsageHistory(req.user.userId, limit, offset);

    return res.status(200).json({
      success: true,
      history,
    });
  });

  static getBalance = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const balance = await UsageService.getUserBalance(req.user.userId);

    return res.status(200).json({
      success: true,
      balance,
    });
  });

  static getTimeline = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const limit = Math.min(Math.max(1, Number(req.query.limit) || 50), 100);
    const offset = Math.max(0, Number(req.query.offset) || 0);
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
  });
}
