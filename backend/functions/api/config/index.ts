import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import net from "node:net";
import * as schema from "./schema";
import { env, getEnv } from "./env";

/**
 * Resolves the active PostgreSQL database connection URL.
 * Automatically chooses between direct local PostgreSQL and PgBouncer pooler.
 */
function resolveDatabaseUrl(): {
  activeUrl: string;
  isPgBouncer: boolean;
  host: string;
  port: number;
  database: string;
  user: string;
} {
  let targetUrl = env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/srushti";
  let isPgBouncer = false;

  // 1. If explicit PgBouncer URL is provided
  if (env.PGBOUNCER_URL && env.PGBOUNCER_URL.trim().length > 0) {
    targetUrl = env.PGBOUNCER_URL.trim();
    isPgBouncer = true;
  } else if (env.USE_PGBOUNCER) {
    // 2. If USE_PGBOUNCER flag is true, route host and port to PgBouncer
    try {
      const parsed = new URL(targetUrl);
      parsed.hostname = env.PGBOUNCER_HOST || "localhost";
      parsed.port = String(env.PGBOUNCER_PORT || 6432);
      if (!parsed.searchParams.has("pgbouncer")) {
        parsed.searchParams.set("pgbouncer", "true");
      }
      targetUrl = parsed.toString();
      isPgBouncer = true;
    } catch {
      // Fallback string manipulation
      targetUrl = targetUrl.replace(/@[^:/]+(:\d+)?\//, `@${env.PGBOUNCER_HOST}:${env.PGBOUNCER_PORT}/`);
      isPgBouncer = true;
    }
  }

  // 3. Detect PgBouncer from port (6432 / 6543) or query parameter
  if (targetUrl.includes(":6432") || targetUrl.includes(":6543") || targetUrl.includes("pgbouncer")) {
    isPgBouncer = true;
  }

  // Extract connection metadata
  let host = "localhost";
  let port = isPgBouncer ? 6432 : 5432;
  let database = "srushti";
  let user = "postgres";

  try {
    const parsed = new URL(targetUrl);
    host = parsed.hostname || host;
    port = parsed.port ? Number(parsed.port) : (isPgBouncer ? 6432 : 5432);
    database = parsed.pathname.replace(/^\//, "") || database;
    user = parsed.username || user;
  } catch {
    // Basic regex extraction if not valid standard URL
    const match = targetUrl.match(/:\/\/([^:]+):?[^@]*@([^:/]+):?(\d+)?\/([^?]+)/);
    if (match) {
      user = match[1] || user;
      host = match[2] || host;
      port = match[3] ? Number(match[3]) : port;
      database = match[4] || database;
    }
  }

  return { activeUrl: targetUrl, isPgBouncer, host, port, database, user };
}

const resolvedConn = resolveDatabaseUrl();

/**
 * Configure postgres driver:
 * - With PgBouncer transaction pooling: prepared statements must be disabled (prepare: false)
 * - With Direct PostgreSQL: prepared statements enabled for optimal query performance
 * - SSL: disabled on localhost / local IP addresses
 */
const poolMaxConnections = env.NODE_ENV === "production" ? 20 : 10;
const idleTimeoutSec = 30;
const connectTimeoutSec = 10;

export const queryClient = postgres(resolvedConn.activeUrl, {
  prepare: !resolvedConn.isPgBouncer,
  ssl: resolvedConn.activeUrl.includes("localhost") || resolvedConn.activeUrl.includes("127.0.0.1") ? false : "require",
  max: poolMaxConnections,
  idle_timeout: idleTimeoutSec,
  connect_timeout: connectTimeoutSec,
});

export const db = drizzle(queryClient, { schema });

/**
 * Quick non-blocking TCP probe to check if a specific port is actively listening.
 */
export async function probePort(host: string, port: number, timeoutMs = 600): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    socket.setTimeout(timeoutMs);

    socket.once("connect", () => {
      settled = true;
      socket.destroy();
      resolve(true);
    });

    socket.once("timeout", () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.once("error", () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });

    try {
      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
}

export interface DbStatusInfo {
  success: boolean;
  database?: string;
  user?: string;
  host?: string;
  port?: number;
  serverTime?: string;
  pgVersion?: string;
  tableCount?: number;
  latencyMs?: number;
  error?: string;
}

export interface PgBouncerStatusInfo {
  isConfigured: boolean;
  isActive: boolean;
  host: string;
  port: number;
  mode: string;
  preparedStatements: boolean;
  maxConnections: number;
  idleTimeoutSec: number;
  connectTimeoutSec: number;
  daemonListening: boolean;
}

/**
 * Retrieves comprehensive DB and PgBouncer diagnostics
 */
export async function getDatabaseAndPoolerInfo(): Promise<{
  dbInfo: DbStatusInfo;
  poolerInfo: PgBouncerStatusInfo;
}> {
  const pgbouncerTargetPort = env.PGBOUNCER_PORT || 6432;
  const pgbouncerTargetHost = env.PGBOUNCER_HOST || "localhost";

  // Check if local PgBouncer port is actively listening
  const daemonListening = await probePort(pgbouncerTargetHost, pgbouncerTargetPort);

  const poolerInfo: PgBouncerStatusInfo = {
    isConfigured: Boolean(env.USE_PGBOUNCER || env.PGBOUNCER_URL),
    isActive: resolvedConn.isPgBouncer,
    host: resolvedConn.isPgBouncer ? resolvedConn.host : pgbouncerTargetHost,
    port: resolvedConn.isPgBouncer ? resolvedConn.port : pgbouncerTargetPort,
    mode: resolvedConn.isPgBouncer ? "Transaction Pooling (PgBouncer)" : "Direct PostgreSQL Session",
    preparedStatements: !resolvedConn.isPgBouncer,
    maxConnections: poolMaxConnections,
    idleTimeoutSec,
    connectTimeoutSec,
    daemonListening,
  };

  try {
    const startTime = Date.now();
    const [row] = await queryClient`
      SELECT 
        current_database() as db_name,
        current_user as user_name,
        version() as pg_version,
        now() as server_time
    `;
    const latencyMs = Date.now() - startTime;

    const [tableCountRow] = await queryClient`
      SELECT count(*)::int as total_tables
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;

    const dbInfo: DbStatusInfo = {
      success: true,
      database: row.db_name,
      user: row.user_name,
      host: resolvedConn.host,
      port: resolvedConn.port,
      serverTime: String(row.server_time),
      pgVersion: row.pg_version,
      tableCount: Number(tableCountRow?.total_tables || 0),
      latencyMs,
    };

    return { dbInfo, poolerInfo };
  } catch (err: any) {
    const dbInfo: DbStatusInfo = {
      success: false,
      database: resolvedConn.database,
      user: resolvedConn.user,
      host: resolvedConn.host,
      port: resolvedConn.port,
      error: err?.message || String(err),
    };

    return { dbInfo, poolerInfo };
  }
}

/**
 * Standard healthcheck verification function
 */
export async function checkDbConnection(): Promise<DbStatusInfo> {
  const { dbInfo } = await getDatabaseAndPoolerInfo();
  return dbInfo;
}

export * from "./schema";
export { schema, env, getEnv, resolveDatabaseUrl };
