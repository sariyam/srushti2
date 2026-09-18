import jwt from "jsonwebtoken";
import { env } from "../config";

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
      if (error.name === "TokenExpiredError") {
        throw new Error("Access token expired");
      }
      throw new Error("Invalid access token");
    }
  }

  /**
   * Verifies a Refresh Token
   */
  static verifyRefreshToken(token: string): JwtUserPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtUserPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token expired");
      }
      throw new Error("Invalid refresh token");
    }
  }
}
