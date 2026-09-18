import jwt from "jsonwebtoken";
import { env } from "../config";
import { UnauthorizedError } from "../utils/errors";

export interface JwtUserPayload {
  userId: string;
  phone: string;
  role: "user" | "admin" | "superadmin";
}

export class JwtService {
  /**
   * Generates both Access and Refresh tokens for a user
   */
  static generateTokens(payload: JwtUserPayload) {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  /**
   * Verifies an incoming Bearer Access Token
   */
  static verifyAccessToken(token: string): JwtUserPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new UnauthorizedError(
          "Access token has expired. Please refresh your session using /auth/refresh.",
          undefined,
          "TOKEN_EXPIRED"
        );
      }
      throw new UnauthorizedError(
        "Invalid, malformed, or signature-mismatched access token.",
        undefined,
        "INVALID_TOKEN"
      );
    }
  }

  /**
   * Verifies a Refresh Token
   */
  static verifyRefreshToken(token: string): JwtUserPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtUserPayload;
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new UnauthorizedError(
          "Refresh token has expired. Please log in again via OTP.",
          undefined,
          "REFRESH_TOKEN_EXPIRED"
        );
      }
      throw new UnauthorizedError(
        "Invalid or malformed refresh token.",
        undefined,
        "INVALID_REFRESH_TOKEN"
      );
    }
  }
}
