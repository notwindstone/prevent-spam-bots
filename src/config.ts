import env from "env-var";
import { config as denoConfig } from 'https://deno.land/x/dotenv/mod.ts';
await denoConfig({ export: true });

export const config = {
    NODE_ENV: env
        .get("NODE_ENV")
        .default("development")
        .asEnum(["production", "test", "development"]),
    BOT_TOKEN: Deno.env.get("BOT_TOKEN"),

    LOCK_STORE: env.get("LOCK_STORE").default("memory").asEnum(["memory"]),
};
