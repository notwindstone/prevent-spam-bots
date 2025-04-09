import fs from "node:fs";
import { Bot } from "gramio";
import { config } from "./config.ts";

const TypescriptKeywords = ["typescript", "тайпскрипт"];
const GoKeywords = ["golang", "голанг", "го", "go"];
const Fukkireta = "https://c.tenor.com/iVNCPdNesGUAAAAC/tenor.gif";
const BannedPhrases = [
    "личк",
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
const DataFilePath = "./src/data/users.json";

export const bot = new Bot(config.BOT_TOKEN)
    .command("typescript", context => context.send(TypescriptReply))
    .command("gif", context => context.sendAnimation(Fukkireta))
    .onStart(({ info }) => {
        console.log(`✨ Bot ${info.username} was started!`);
    })
    .on("new_chat_members", async (context) => {
        await context.send(WelcomeReply);
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

        if (context.chat.id !== -1001341543913) {
            return;
        }

        const userId = context.from?.id.toString() ?? "";
        const usersDataFile = fs.readFileSync(DataFilePath, "utf-8");
        const usersData: Array<string> = JSON.parse(usersDataFile);
        const users = new Set(usersData);

        if (users.has(userId)) {
            return;
        }

        const hasBannedPhrases = BannedPhrases.some((phrase: string) => message.includes(phrase));

        if (!hasBannedPhrases) {
            fs.writeFileSync(DataFilePath, JSON.stringify([...usersData, userId]));

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

        const hasLastName = Boolean(context.from?.lastName);

        await context.sendAnimation(Fukkireta, {
            caption: `kicked @${context.from?.username} (${context.from?.firstName}${hasLastName ? ` ${context.from?.lastName}` : ""}) for the next message:\n\n${context.text}`,
        });
    });
