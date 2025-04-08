import { Bot } from "gramio";
import { LRUCache } from "lru-cache";
import { config } from "./config.ts";

const Fukkireta = "https://c.tenor.com/iVNCPdNesGUAAAAC/tenor.gif";
const BannedPhrases = [
    "в личку",
    "в лс",
    "1O",
    "2O",
    "3O",
    "4O",
    "5O",
    "6O",
    "7O",
    "8O",
    "9O",
    "места ограничены",
    "занятость",
    "оплат",
    "личка",
    "личные сообщения",
    "личных сообщениях",
    "перспективы",
    "рублей",
    "партнер",
    "партнёр",
    "$",
    "регулярные бонусы",
    "заработ",
    "куплю",
    "курс",
    "договор",
    "usdt",
    "бирж",
    "сумм",
];
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
            await context.react({
                emoji: "❤",
                type: "emoji",
            });

            return;
        }

        if (message.length <= 20) {
            return;
        }

        const userId = context.from?.id.toString() ?? "";
        const messagesCount = cache.get(userId);

        if (messagesCount === undefined) {
            return;
        }

        cache.set(userId, Number(messagesCount) + 1);

        if (Number(messagesCount) > 5) {
            return;
        }

        const hasBannedPhrases = BannedPhrases.some((phrase: string) => message.includes(phrase));

        if (!hasBannedPhrases) {
            return;
        }

        await bot.api.deleteMessage({
            chat_id: context.chat.id,
            message_id: context.id,
        });
        await bot.api.banChatMember({
            chat_id: context.chat.id,
            user_id: Number(userId),
        });
        await bot.api.unbanChatMember({
            chat_id: context.chat.id,
            user_id: Number(userId),
        });

        await context.sendAnimation(Fukkireta);
    });
