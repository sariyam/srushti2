import { db, queryClient } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { env } from "./env";
import path from "path";
import fs from "fs";

async function runSeed() {
  console.log("🌱 Starting database seeding process...");

  try {
    // 1. Locate and run seed.sql if present
    const possibleSeedSqlPaths = [
      path.resolve(process.cwd(), "seed.sql"),
      path.resolve(process.cwd(), "supabase/seed.sql"),
      path.resolve(__dirname, "../../../seed.sql"),
    ];

    const seedSqlPath = possibleSeedSqlPaths.find((p) => fs.existsSync(p));

    if (seedSqlPath) {
      console.log(`📜 Found SQL seed script at: ${seedSqlPath}`);
      console.log("⏳ Applying seed.sql to database...");
      const sqlContent = fs.readFileSync(seedSqlPath, "utf-8");
      
      // Execute seed.sql queries safely
      await queryClient.unsafe(sqlContent);
      console.log("✅ seed.sql executed successfully!");
    } else {
      console.log("ℹ️ No seed.sql found. Proceeding with ORM SuperAdmin seed...");
    }

    // 2. Ensure SuperAdmin from current .env is upserted
    console.log(`🔐 Verifying SuperAdmin for ${env.SUPERADMIN_PHONE}...`);
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
    console.error("❌ Failed to complete database seeding:", error.message || error);
    process.exit(1);
  } finally {
    await queryClient.end();
    console.log("🌱 Seed process finished successfully.");
  }
}

runSeed();
