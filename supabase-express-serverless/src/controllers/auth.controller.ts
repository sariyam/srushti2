import { Request, Response, NextFunction } from "express";
import { OtpService } from "../services/otp.service";
import { JwtService } from "../services/jwt.service";
import { StorageService } from "../services/storage.service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const sendOtpSchema = z.object({
  identifier: z.string().min(3, "Phone number or email is required"),
  purpose: z.enum(["login", "register", "recharge"]).optional(),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(3, "Phone number is required"),
  code: z.string().length(6, "OTP must be exactly 6 digits"),
  purpose: z.enum(["login", "register", "recharge"]).optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export class AuthController {
  static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, purpose } = req.body;
      const result = await OtpService.sendOtp({ identifier, purpose });
      return res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, code, purpose } = req.body;
      const result = await OtpService.verifyOtp({ identifier, code, purpose });
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const payload = JwtService.verifyRefreshToken(refreshToken);

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, error: "User is no longer active" });
      }

      const tokens = JwtService.generateTokens({
        userId: user.id,
        phone: user.phone,
        role: user.role,
      });

      return res.status(200).json({ success: true, tokens });
    } catch (error: any) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const [user] = await db
        .select({
          id: users.id,
          phone: users.phone,
          avatarUrl: users.avatarUrl,
          role: users.role,
          walletBalance: users.walletBalance,
          isActive: users.isActive,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, req.user.userId))
        .limit(1);

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      return res.status(200).json({ success: true, user });
    } catch (error: any) {
      next(error);
    }
  }

  static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, error: "No image file provided in field 'avatar'" });
      }

      const result = await StorageService.uploadUserAvatar({
        userId: req.user.userId,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const result = await StorageService.deleteUserAvatar(req.user.userId);
      return res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}
