import { app } from "./app";
import { env } from "./config/env";
import { queryClient, checkDbConnection } from "./db";

const PORT = env.PORT || 4000;

const server = app.listen(PORT, async () => {
  console.log("==========================================");
  console.log(`🚀 Srushti AI Backend is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🌱 Environment: ${env.NODE_ENV}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);

  // Verify database connection on server start
  const dbStatus = await checkDbConnection();
  if (dbStatus.success) {
    console.log(`✅ Supabase Database connected successfully! (DB: ${dbStatus.database})`);
  } else {
    console.error(`❌ Supabase Database connection failed: ${dbStatus.error}`);
  }

  console.log("==========================================");
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("🔌 Closed HTTP server connections.");
    try {
      await queryClient.end();
      console.log("📦 Supabase database connection pool closed.");
    } catch (err: any) {
      console.error("Error during DB shutdown:", err.message);
    }
    process.exit(0);
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    console.error("⚠️ Forceful shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Global process-level safety handlers to prevent silent crashes
process.on("unhandledRejection", (reason: any) => {
  console.error("🔥 [FATAL] Unhandled Promise Rejection:", reason?.message || reason);
  if (reason?.stack) console.error(reason.stack);
});

process.on("uncaughtException", (error: Error) => {
  console.error("🔥 [FATAL] Uncaught Exception:", error.message);
  console.error(error.stack);
});
