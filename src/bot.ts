import { Bot } from "gramio";
import { LRUCache } from "lru-cache";
import { config } from "./config.ts";

const TypescriptKeywords = ["typescript", "тайпскрипт"];
const GoKeywords = ["golang", "голанг", "го", "go"];
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
    "огранич",
    "занятост",
    "плат",
    "личка",
    "сообщени",
    "личн",
    "перспектив",
    "рубл",
    "партнер",
    "партнёр",
    "$",
    "бонус",
    "заработ",
    "купл",
    "курс",
    "договор",
    "usdt",
    "бирж",
    "сумм",
    "доллар",
    "доход",
];
const WelcomeReply = "hiiiiii~ :3";
const TypescriptReply = "typescript~ :3";

const options = {
    max: 500,
    ttl: 1000 * 60 * 60 * 24,
};
const cache = new LRUCache(options);

export const bot = new Bot(config.BOT_TOKEN)
    .command("typescript", context => context.send(TypescriptReply))
    .command("gif", context => context.sendAnimation(Fukkireta))
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))
    .on("new_chat_members", async (context) => {
        await context.send(WelcomeReply);
    })
    .on("left_chat_member", (context) => {
        console.log(context);
    })
    .on("message", async (context) => {
        const message = context?.text?.toLowerCase() ?? "";
        const hasTypescriptKeyword = TypescriptKeywords.some((keyword: string) => message.includes(keyword));
        const hasGoKeyword = GoKeywords.some((keyword: string) => message.includes(keyword));

        if (hasTypescriptKeyword) {
            await context.react({
                emoji: "❤‍🔥",
                type: "emoji",
            });

            return;
        }
        else if (hasGoKeyword) {
            await context.react({
                emoji: "❤",
                type: "emoji",
            });

            return;
        }

        if (message.length <= 20 || context.chat.id !== -1001341543913) {
            return;
        }

        console.log(context);

        const userId = context.from?.id.toString() ?? "";
        const messagesCount = cache.get(userId);

        console.log(messagesCount);

        if (messagesCount === undefined) {
            return;
        }

        if (Number(messagesCount) > 3) {
            return;
        }

        cache.set(userId, Number(messagesCount) + 1);

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
