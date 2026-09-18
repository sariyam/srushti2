import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "./index";
import path from "path";
import fs from "fs";

async function runMigrations() {
  const possiblePaths = [
    path.resolve(process.cwd(), "migrations"),
    path.resolve(process.cwd(), "supabase/migrations"),
    path.resolve(__dirname, "../../../migrations"),
  ];
  const migrationsFolder = possiblePaths.find((p) => fs.existsSync(p)) || path.resolve(__dirname, "../../../migrations");

  console.log(`⏳ Running database migrations from: ${migrationsFolder}...`);
  try {
    const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
    if (fs.existsSync(journalPath)) {
      await migrate(db, { migrationsFolder });
      console.log("✅ Drizzle migrations applied successfully!");
    } else {
      const files = fs.readdirSync(migrationsFolder)
        .filter((f) => f.endsWith(".sql"))
        .sort();

      for (const file of files) {
        const filePath = path.join(migrationsFolder, file);
        console.log(`📜 Applying migration file: ${file}...`);
        const sql = fs.readFileSync(filePath, "utf-8");
        await queryClient.unsafe(sql);
      }
      console.log(`✅ Applied ${files.length} SQL migration(s) successfully!`);
    }
  } catch (error: any) {
    console.error("❌ Migration error:", error.message || error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

runMigrations();
