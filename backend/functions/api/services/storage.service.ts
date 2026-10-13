import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { db, env } from "../config";
import { users } from "../config/schema";
import { eq } from "drizzle-orm";
import { ExternalServiceError, NotFoundError } from "../utils/errors";

export interface UploadAvatarOptions {
  userId: string;
  fileBuffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface StorageFileStats {
  bucketCount: number;
  totalFiles: number;
  totalSizeBytes: number;
  rootPath: string;
}

export class StorageService {
  private static _storageRoot: string | null = null;

  /**
   * Resolves and verifies the local StorageBucket root directory.
   */
  public static getStorageRoot(): string {
    if (this._storageRoot) return this._storageRoot;

    const envPath = env.STORAGE_BUCKET_PATH || process.env.STORAGE_BUCKET_PATH;
    const candidates = [
      envPath,
      path.resolve(process.cwd(), "StorageBucket"),
      path.resolve(process.cwd(), "../StorageBucket"),
      path.resolve(process.cwd(), "../../StorageBucket"),
      "c:\\srushti2\\StorageBucket",
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        this._storageRoot = path.resolve(candidate);
        return this._storageRoot;
      }
    }

    // Default to candidate 0 or create default
    const fallback = envPath ? path.resolve(envPath) : path.resolve(process.cwd(), "../../StorageBucket");
    if (!fs.existsSync(fallback)) {
      try {
        fs.mkdirSync(fallback, { recursive: true });
      } catch {
        // Handled on file write
      }
    }
    this._storageRoot = fallback;
    return this._storageRoot;
  }

  /**
   * Safely resolves a path within the StorageBucket, preventing path traversal attacks.
   */
  public static resolveSafePath(bucket: string, relativePath: string): string {
    const root = this.getStorageRoot();
    const cleanBucket = bucket.replace(/[^a-zA-Z0-9_-]/g, "");
    const safeSubPath = relativePath.replace(/^(\/|\\)+/, "").replace(/\.\./g, "");
    const fullPath = path.resolve(root, cleanBucket, safeSubPath);

    if (!fullPath.startsWith(root)) {
      throw new ExternalServiceError("StorageBucket", "Invalid file path (path traversal detected)");
    }

    return fullPath;
  }

  /**
   * Uploads or updates a user profile avatar into the local StorageBucket.
   * Access URL is formatted as /api/storage/avatars/profiles/<userId>/avatar.<ext>
   */
  static async uploadUserAvatar({
    userId,
    fileBuffer,
    mimeType,
    originalName,
  }: UploadAvatarOptions) {
    const ext = path.extname(originalName) || (mimeType.includes("png") ? ".png" : ".jpg");
    const relativeSubPath = `profiles/${userId}/avatar${ext}`;
    const destinationPath = this.resolveSafePath("avatars", relativeSubPath);

    try {
      await fsp.mkdir(path.dirname(destinationPath), { recursive: true });
      await fsp.writeFile(destinationPath, fileBuffer);
    } catch (err: any) {
      throw new ExternalServiceError("StorageBucket", `Failed to save avatar to StorageBucket: ${err.message}`);
    }

    // Authenticated API route for retrieving the avatar
    const accessUrl = `/api/storage/avatars/${relativeSubPath}`;

    // Persist avatarUrl in users table
    const [updatedUser] = await db
      .update(users)
      .set({
        avatarUrl: accessUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return {
      success: true,
      avatarUrl: accessUrl,
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl,
      },
    };
  }

  /**
   * Deletes a user avatar from StorageBucket and clears users.avatar_url
   */
  static async deleteUserAvatar(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.avatarUrl) {
      return { success: true, message: "No avatar to delete." };
    }

    try {
      // Find and delete the file from StorageBucket
      const root = this.getStorageRoot();
      const profileDir = path.resolve(root, "avatars", "profiles", userId);
      if (fs.existsSync(profileDir)) {
        await fsp.rm(profileDir, { recursive: true, force: true });
      }
    } catch (err: any) {
      console.warn("StorageBucket avatar deletion warning:", err.message);
    }

    await db
      .update(users)
      .set({
        avatarUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true, message: "Avatar deleted successfully from StorageBucket." };
  }

  /**
   * Saves arbitrary buffer to StorageBucket
   */
  static async saveFile(bucket: string, relativePath: string, buffer: Buffer): Promise<string> {
    const fullPath = this.resolveSafePath(bucket, relativePath);
    await fsp.mkdir(path.dirname(fullPath), { recursive: true });
    await fsp.writeFile(fullPath, buffer);
    return `/api/storage/${bucket}/${relativePath.replace(/^(\/|\\)+/, "")}`;
  }

  /**
   * Deletes a file from StorageBucket
   */
  static async deleteFile(bucket: string, relativePath: string): Promise<boolean> {
    try {
      const fullPath = this.resolveSafePath(bucket, relativePath);
      if (fs.existsSync(fullPath)) {
        await fsp.unlink(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Retrieves file details from StorageBucket
   */
  static async getFile(bucket: string, relativePath: string): Promise<{
    filePath: string;
    mimeType: string;
    size: number;
  }> {
    const fullPath = this.resolveSafePath(bucket, relativePath);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundError(`Requested file not found in StorageBucket (${bucket}/${relativePath})`);
    }

    const stat = await fsp.stat(fullPath);
    if (!stat.isFile()) {
      throw new NotFoundError(`Requested path is not a file in StorageBucket`);
    }

    const ext = path.extname(fullPath).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".json": "application/json",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
    };

    return {
      filePath: fullPath,
      mimeType: mimeMap[ext] || "application/octet-stream",
      size: stat.size,
    };
  }

  /**
   * Calculates storage diagnostics and file statistics
   */
  static async getStorageStats(): Promise<StorageFileStats> {
    const root = this.getStorageRoot();
    let totalFiles = 0;
    let totalSizeBytes = 0;
    let bucketCount = 0;

    async function walk(dir: string, isTopLevel = false) {
      try {
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (isTopLevel) bucketCount++;
            await walk(fullPath, false);
          } else if (entry.isFile()) {
            totalFiles++;
            const s = await fsp.stat(fullPath);
            totalSizeBytes += s.size;
          }
        }
      } catch {
        // Handled silently
      }
    }

    if (fs.existsSync(root)) {
      await walk(root, true);
    }

    return {
      bucketCount,
      totalFiles,
      totalSizeBytes,
      rootPath: root,
    };
  }
}
