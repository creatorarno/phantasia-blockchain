// ═══════════════════════════════════════════════════════════════
//  CONFIG — Centralized env config with validation
// ═══════════════════════════════════════════════════════════════

import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // API keys (maintainer secrets)
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  PINATA_JWT: z.string().min(1, "PINATA_JWT is required"),

  // Security
  API_SECRET_KEY: z.string().optional().default(""),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(30),

  // CORS
  CORS_ORIGINS: z.string().optional().default(""),
});

export type Config = z.infer<typeof envSchema>;

let _config: Config | null = null;

export function loadConfig(): Config {
  if (_config) return _config;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  _config = result.data;
  return _config;
}

export function getConfig(): Config {
  if (!_config) return loadConfig();
  return _config;
}
