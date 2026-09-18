import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "./index";

async function runMigrations() {
  console.log("⏳ Running database migrations from ./drizzle...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations applied successfully!");
  } catch (error: any) {
    console.error("❌ Migration error:", error.message || error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

runMigrations();
