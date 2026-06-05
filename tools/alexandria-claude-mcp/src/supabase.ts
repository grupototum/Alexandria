import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Config } from "./config.js";

let cached: SupabaseClient | null = null;

export function getSupabase(config: Config): SupabaseClient {
  if (!cached) {
    cached = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/** Apenas para testes — limpa o cache do singleton. */
export function _resetSupabaseClient(): void {
  cached = null;
}
