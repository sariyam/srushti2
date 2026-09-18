import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { otps, users } from "../db/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { env } from "../config/env";
import { JwtService } from "./jwt.service";

export interface SendOtpOptions {
  identifier: string; // phone number (e.g. +919876543210)
  purpose?: "login" | "register" | "recharge";
}

export interface VerifyOtpOptions {
  identifier: string;
  code: string;
  purpose?: "login" | "register" | "recharge";
}

export class OtpService {
  /**
   * Generates a cryptographically strong 6-digit OTP
   */
  static generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Normalizes phone numbers (e.g. 9876543210 or 09876543210 -> +919876543210)
   * while preserving email identifiers. Ensures consistent user identity.
   */
  static normalizeIdentifier(identifier: string): string {
    const trimmed = identifier.trim().toLowerCase();
    if (trimmed.includes("@")) {
      return trimmed;
    }
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length >= 10) {
      return `+91${digits.slice(-10)}`;
    }
    return trimmed;
  }

  /**
   * Sends or generates an OTP for a phone number or email
   */
  static async sendOtp({ identifier, purpose = "login" }: SendOtpOptions) {
    const cleanIdentifier = this.normalizeIdentifier(identifier);

    // 1. Check Rate Limit / Cooldown
    const cooldownAgo = new Date(Date.now() - env.OTP_COOLDOWN_SECONDS * 1000);
    const [recentOtp] = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.identifier, cleanIdentifier),
          eq(otps.purpose, purpose),
          gt(otps.createdAt, cooldownAgo)
        )
      )
      .limit(1);

    if (recentOtp) {
      const waitSeconds = Math.ceil(
        (recentOtp.createdAt.getTime() + env.OTP_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000
      );
      throw new Error(`Please wait ${waitSeconds}s before requesting a new OTP.`);
    }

    // 2. Generate and hash OTP
    const plainCode = this.generateCode();
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(plainCode, salt);

    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    // 3. Save OTP record in Database
    await db.insert(otps).values({
      identifier: cleanIdentifier,
      codeHash,
      purpose,
      expiresAt,
      isUsed: false,
      attempts: 0,
    });

    // 4. Dispatch OTP via chosen Gateway provider
    await this.dispatchOtpToGateway(cleanIdentifier, plainCode);

    return {
      success: true,
      identifier: cleanIdentifier,
      expiresInMinutes: env.OTP_EXPIRY_MINUTES,
    };
  }

  /**
   * Verifies an OTP and authenticates/registers the user
   */
  static async verifyOtp({ identifier, code, purpose = "login" }: VerifyOtpOptions) {
    const cleanIdentifier = this.normalizeIdentifier(identifier);
    const cleanCode = code.trim();

    // 1. Fetch latest active OTP record for identifier
    const [otpRecord] = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.identifier, cleanIdentifier),
          eq(otps.purpose, purpose),
          eq(otps.isUsed, false),
          gt(otps.expiresAt, new Date())
        )
      )
      .orderBy(desc(otps.createdAt))
      .limit(1);

    if (!otpRecord) {
      throw new Error("Invalid or expired OTP. Please request a new one.");
    }

    // 2. Check max failed attempts
    if (otpRecord.attempts >= env.OTP_MAX_ATTEMPTS) {
      await db
        .update(otps)
        .set({ isUsed: true })
        .where(eq(otps.id, otpRecord.id));
      throw new Error("Too many failed attempts. This OTP has been invalidated.");
    }

    // 3. Verify bcrypt hash
    const isValid = await bcrypt.compare(cleanCode, otpRecord.codeHash);

    if (!isValid) {
      await db
        .update(otps)
        .set({ attempts: otpRecord.attempts + 1 })
        .where(eq(otps.id, otpRecord.id));
      throw new Error(`Incorrect OTP. ${env.OTP_MAX_ATTEMPTS - (otpRecord.attempts + 1)} attempts remaining.`);
    }

    // 4. Invalidate OTP to prevent replay
    await db
      .update(otps)
      .set({ isUsed: true })
      .where(eq(otps.id, otpRecord.id));

    // 5. Look up or auto-register user by phone
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.phone, cleanIdentifier))
      .limit(1);

    if (!user) {
      // Register new user with 10 default free credits
      const [newUser] = await db
        .insert(users)
        .values({
          phone: cleanIdentifier,
          walletBalance: 10,
          role: cleanIdentifier === env.SUPERADMIN_PHONE ? "superadmin" : "user",
          isActive: true,
        })
        .returning();
      user = newUser;
    }

    if (!user.isActive) {
      throw new Error("Your account has been deactivated. Please contact support.");
    }

    // 6. Issue JWT Tokens
    const tokens = JwtService.generateTokens({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance,
        avatarUrl: user.avatarUrl,
      },
      tokens,
    };
  }

  /**
   * Helper to dispatch SMS / Notification
   */
  private static async dispatchOtpToGateway(identifier: string, code: string) {
    // 1. Console / Mock mode
    if (env.SMS_GATEWAY_PROVIDER === "console") {
      console.log("==========================================");
      console.log(`📱 [CUSTOM OTP SERVICE] Mock SMS to ${identifier}`);
      console.log(`🔑 Verification Code: [ ${code} ] (Expires in ${env.OTP_EXPIRY_MINUTES} min)`);
      console.log("==========================================");
      return;
    }

    // 2. Colourmoon SMS Gateway Integration (Username Always = Srushti)
    if (env.SMS_GATEWAY_PROVIDER === "colourmoon") {
      // Normalize mobile to standard 10 digits
      const rawDigits = identifier.replace(/\D/g, "");
      const mobile = rawDigits.length > 10 ? rawDigits.slice(-10) : rawDigits;

      // Username is always Srushti
      const username = env.COLOURMOON_USERNAME || "Srushti";
      const messageText = `Dear ${username} your one time password (OTP) ${code} Regards CMTOTP`;
      const encodedMessage = encodeURIComponent(messageText);
      const userId = encodeURIComponent(env.COLOURMOON_USER_ID || "invtechnologies");
      const baseUrl = env.COLOURMOON_SMS_URL || "http://colourmoontraining.com/otp_sms/sendsms";
      const requestUrl = `${baseUrl}?user_id=${userId}&mobile=${mobile}&message=${encodedMessage}`;

      console.log("==========================================");
      console.log(`📡 [COLOURMOON SMS] Dispatching OTP SMS:`);
      console.log(`   • Mobile:   ${mobile}`);
      console.log(`   • Username: ${username}`);
      console.log(`   • OTP:      ${code}`);
      console.log(`   • Request:  ${requestUrl}`);

      try {
        const response = await fetch(requestUrl, {
          method: "GET",
          redirect: "follow",
        });
        const responseBody = await response.text();
        console.log(`📱 [COLOURMOON SMS] Gateway Response Status: ${response.status}`);
        console.log(`📱 [COLOURMOON SMS] Gateway Response Body:`, responseBody);
      } catch (err: any) {
        console.error(`❌ [COLOURMOON SMS] Failed to dispatch SMS to ${mobile}:`, err.message);
      }
      console.log("==========================================");
      return;
    }

    // 3. Fast2SMS Provider
    if (env.SMS_GATEWAY_PROVIDER === "fast2sms" && env.FAST2SMS_API_KEY) {
      try {
        const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: env.FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "otp",
            variables_values: code,
            numbers: identifier.replace("+91", "").trim(),
          }),
        });
        const resData = await response.json();
        console.log("Fast2SMS Response:", resData);
      } catch (err: any) {
        console.error("Failed to send OTP via Fast2SMS:", err.message);
      }
    }
  }
}
