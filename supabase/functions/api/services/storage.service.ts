import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { db, env } from "../config";
import { users } from "../config/schema";
import { eq } from "drizzle-orm";
import path from "node:path";
import { ServiceUnavailableError, ExternalServiceError } from "../utils/errors";

export interface UploadAvatarOptions {
  userId: string;
  fileBuffer: Buffer;
  mimeType: string;
  originalName: string;
}

export class StorageService {
  private static supabase: SupabaseClient;

  private static getClient(): SupabaseClient {
    if (!this.supabase) {
      if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new ServiceUnavailableError(
          "Supabase storage credentials missing. Please define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables."
        );
      }
      this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          persistSession: false,
        },
      });
    }
    return this.supabase;
  }

  /**
   * Uploads or updates a user profile avatar in Supabase Storage bucket and updates the users table
   */
  static async uploadUserAvatar({
    userId,
    fileBuffer,
    mimeType,
    originalName,
  }: UploadAvatarOptions) {
    const supabase = this.getClient();
    const bucket = env.SUPABASE_STORAGE_BUCKET || "avatars";

    // Extract file extension or default to jpg
    const ext = path.extname(originalName) || (mimeType.includes("png") ? ".png" : ".jpg");
    const filePath = `profiles/${userId}/avatar${ext}`;

    // Upload to Supabase Storage with upsert
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw new ExternalServiceError("SupabaseStorage", `Avatar file upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // Persist avatar_url in the database
    const [updatedUser] = await db
      .update(users)
      .set({
        avatarUrl: publicUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return {
      success: true,
      avatarUrl: publicUrl,
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl,
      },
    };
  }

  /**
   * Deletes a user avatar from Supabase Storage and clears users.avatar_url
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
      const supabase = this.getClient();
      const bucket = env.SUPABASE_STORAGE_BUCKET || "avatars";
      // Extract relative path from URL if possible
      const urlParts = user.avatarUrl.split(`${bucket}/`);
      if (urlParts.length > 1) {
        const storagePath = urlParts[1];
        await supabase.storage.from(bucket).remove([storagePath]);
      }
    } catch (err: any) {
      console.warn("Storage deletion warning:", err.message);
    }

    await db
      .update(users)
      .set({
        avatarUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true, message: "Avatar deleted successfully." };
  }
}
