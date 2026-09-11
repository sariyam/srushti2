import { db, queryClient } from "./index";
import { users } from "./schema";
import { eq, or } from "drizzle-orm";
import { env } from "../config/env";

async function seedSuperAdmin() {
  console.log("🌱 Starting SuperAdmin database seed...");

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.phone, env.SUPERADMIN_PHONE))
      .limit(1);

    if (existing.length > 0) {
      console.log(`ℹ️ SuperAdmin already exists (ID: ${existing[0].id}). Updating role & credits...`);
      const [updated] = await db
        .update(users)
        .set({
          role: "superadmin",
          walletBalance: Math.max(existing[0].walletBalance, env.SUPERADMIN_INITIAL_CREDITS),
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing[0].id))
        .returning();

      console.log("✅ SuperAdmin updated successfully:", {
        id: updated.id,
        phone: updated.phone,
        role: updated.role,
        walletBalance: updated.walletBalance,
      });
    } else {
      console.log(`🚀 Creating new SuperAdmin user for ${env.SUPERADMIN_PHONE}...`);
      const [created] = await db
        .insert(users)
        .values({
          phone: env.SUPERADMIN_PHONE,
          role: "superadmin",
          walletBalance: env.SUPERADMIN_INITIAL_CREDITS,
          isActive: true,
        })
        .returning();

      console.log("🎉 SuperAdmin user seeded successfully:", {
        id: created.id,
        phone: created.phone,
        role: created.role,
        walletBalance: created.walletBalance,
      });
    }
  } catch (error: any) {
    console.error("❌ Failed to seed SuperAdmin:", error.message || error);
    process.exit(1);
  } finally {
    await queryClient.end();
    console.log("🌱 Seed process finished.");
  }
}

seedSuperAdmin();
