// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Bridge Deno.env to process.env immediately on startup before application loads
declare const Deno: any;
if (typeof Deno !== "undefined" && typeof Deno?.env?.toObject === "function") {
  try {
    const allEnv = Deno.env.toObject();
    for (const [key, val] of Object.entries(allEnv)) {
      if (val !== undefined && typeof val === "string") {
        process.env[key] = val;
      }
    }
  } catch (_e) {
    // ignore
  }
}

// Function's slug in Supabase Edge Functions (matches supabase/functions/<slug>)
if (!process.env.FUNCTION_SLUG && !process.env.SUPABASE_FUNCTION_SLUG) {
  process.env.FUNCTION_SLUG = "api";
  process.env.SUPABASE_FUNCTION_SLUG = "api";
}

import { app } from "./app";

const port = Number(Deno?.env?.get?.("PORT")) || 8000;

// Start Express HTTP listener
// In Supabase Edge Runtime, Deno intercepts app.listen() and routes edge invocations into Express
app.listen(port, () => {
  console.log(`🚀 Srushti AI Express Edge Function running on port ${port} (slug: ${process.env.SUPABASE_FUNCTION_SLUG})`);
});

export default app;
