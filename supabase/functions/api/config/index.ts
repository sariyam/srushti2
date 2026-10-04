import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env, getEnv } from "./env";

// In Supabase, if using transaction pooling (port 6543 / PgBouncer), prepared statements should be disabled
const isPooler = env.DATABASE_URL.includes("6543") || env.DATABASE_URL.includes("pgbouncer");

export const queryClient = postgres(env.DATABASE_URL, {
  prepare: !isPooler,
  ssl: env.DATABASE_URL.includes("localhost") ? false : "require",
  max: env.NODE_ENV === "production" ? 15 : 8,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });

/**
 * Verifies active connectivity to the Supabase PostgreSQL database
 */
export async function checkDbConnection(): Promise<{
  success: boolean;
  database?: string;
  serverTime?: string;
  error?: string;
}> {
  try {
    const [row] = await queryClient`SELECT current_database() as db_name, now() as server_time`;
    return {
      success: true,
      database: row.db_name,
      serverTime: row.server_time,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err),
    };
  }
}

export * from "./schema";
export { schema, env, getEnv };
