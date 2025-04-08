import env from "env-var";

export const config = {
    NODE_ENV: env
        .get("NODE_ENV")
        .default("development")
        .asEnum(["production", "test", "development"]),
    BOT_TOKEN: env.get("BOT_TOKEN"),

    LOCK_STORE: env.get("LOCK_STORE").default("memory").asEnum(["memory"]),
};
