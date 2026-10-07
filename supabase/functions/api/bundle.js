const esbuild = require("esbuild");

try {
  console.log("📦 Bundling functions/api for Supabase Edge Functions...");
  esbuild.buildSync({
    entryPoints: ["functions/api/index.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "es2022",
    external: [
      "express",
      "cors",
      "helmet",
      "morgan",
      "dotenv",
      "zod",
      "postgres",
      "drizzle-orm",
      "drizzle-orm/*",
      "jsonwebtoken",
      "bcryptjs",
      "razorpay",
      "multer",
      "@supabase/*",
      "hono",
      "@hono/*",
      "serverless-http",
      "path",
      "node:*",
      "jsr:*",
    ],
    outfile: "functions/api/bundle.ts",
  });
  console.log("✅ Successfully bundled functions/api/bundle.ts");
} catch (err) {
  console.error("❌ Bundling failed:", err);
  process.exit(1);
}
