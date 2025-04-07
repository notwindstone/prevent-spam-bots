import { Bot } from "gramio";
import { LRUCache } from "lru-cache";
import { config } from "./config.ts";

const TypeScriptReply = "typescript~ :3";
const ToReply = "hiiiiii~ :3";
const options = {
    max: 500,
    ttl: 1000 * 60 * 60 * 24,
};
const cache = new LRUCache(options);

export const bot = new Bot(config.BOT_TOKEN)
    .command("typescript", context => context.send(ToReply))
    .command("gif", context => context.sendAnimation("https://media.tenor.com/Y29AXUU6_U0AAAAj/teto-kasane.gif"))
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))
    .on("new_chat_members", async (context) => {
        const userId = context.from?.id.toString() ?? "";

        cache.set(userId, 1);
        await context.send(ToReply);
    })
    .on("message", async (context) => {
        const message = context?.text?.toLowerCase() ?? "";

        if (message.includes("typescript") || message.includes("тайпскрипт")) {
            await context.send(TypeScriptReply);

            return;
        }

        if (message.length <= 20) {
            return;
        }

        if (!message.endsWith("в лс") && !(message.endsWith("в лс.")) && !(message.endsWith("регулярные бонусы"))) {
            return;
        }

        const userId = context.from?.id.toString() ?? "";

        if (cache.get(userId) !== 1) {
            return;
        }

        await bot.api.banChatMember({
            chat_id: context.chat.id,
            user_id: Number(userId),
        });
        await bot.api.unbanChatMember({
            chat_id: context.chat.id,
            user_id: Number(userId),
        });
        await bot.api.deleteMessage({
            chat_id: context.chat.id,
            message_id: context.id,
        });

        await context.sendAnimation("https://media.tenor.com/Y29AXUU6_U0AAAAj/teto-kasane.gif");
    });
