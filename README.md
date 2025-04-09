## How it works?

It's really simple and stupid, but it works like a charm for me. When a new message appears, a bot will check its sender ID. If the sender ID is in ./src/data/users.json, it will not do any checks because this file stores verified users. If the sender ID is NOT in the file, the bot will check message content if it has some "banned keywords". If it doesn't, the sender ID will be written to the file. If it does, the user will be kicked out of the chat, and the message will be deleted.

## Why does it use a shitty strategy to detect bots?

Unfortunately, the telegram bot api doesn't fire `new_chat_member` events in supergroups. And somehow this shitty api doesn't even provide a method to fetch all chat members. I was too lazy to write a workaround for this.

### Stack
- Telegram Bot API framework - [GramIO](https://gramio.dev/)
- Linter - [ESLint](https://eslint.org/)

## Setup

Create `.env` file based on `.env.example` and paste your bot token there.

## Development

Start the bot:

```bash
pnpm run dev
```

## Production

Run project in `production` mode on **Linux**:

```bash
pnpm run deploy
```

Run project in `production` mode on **Windows**:

```bash
pnpm run start
```
