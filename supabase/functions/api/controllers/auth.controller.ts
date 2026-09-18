import { Request, Response } from "express";
import { OtpService } from "../services/otp.service";
import { JwtService } from "../services/jwt.service";
import { StorageService } from "../services/storage.service";
import { db } from "../config";
import { users } from "../config/schema";
import { eq } from "drizzle-orm";
import {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  asyncHandler,
} from "../utils";

export {
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  SendOtpSchema,
  VerifyOtpSchema,
  RefreshTokenSchema,
} from "../schemas/auth.schema";

export class AuthController {
  static sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { identifier, purpose } = req.body;
    const result = await OtpService.sendOtp({ identifier, purpose });
    return res.status(200).json(result);
  });

  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { identifier, code, purpose } = req.body;
    const result = await OtpService.verifyOtp({ identifier, code, purpose });
    return res.status(200).json({
      success: true,
      ...result,
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const payload = JwtService.verifyRefreshToken(refreshToken);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedError("User associated with this token does not exist.", undefined, "USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new ForbiddenError("User account is inactive or has been suspended.", undefined, "ACCOUNT_INACTIVE");
    }

    const tokens = JwtService.generateTokens({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    return res.status(200).json({ success: true, tokens });
  });

  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
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
      throw new NotFoundError("User profile was not found.", undefined, "PROFILE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, user });
  });

  static uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const file = req.file;
    if (!file) {
      throw new BadRequestError("No image file provided in field 'avatar'", undefined, "MISSING_FILE_FIELD");
    }

    const result = await StorageService.uploadUserAvatar({
      userId: req.user.userId,
      fileBuffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    return res.status(200).json(result);
  });

  static deleteAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const result = await StorageService.deleteUserAvatar(req.user.userId);
    return res.status(200).json(result);
  });
}
