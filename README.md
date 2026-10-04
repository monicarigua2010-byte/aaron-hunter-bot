# Aaron Hunter Discord Bot

A simple Discord bot that lets members submit reports through DM.

## Features
- `!report` starts the DM report system.
- Members can also DM Aaron Hunter and type `report`.
- The bot asks:
  1. Who are you reporting?
  2. What happened?
  3. Do you have evidence?
- Completed reports are sent to the configured `#bots` channel.
- The configured staff role is mentioned when a report arrives.
- `!aaron` shows the bot's basic help message.
- Members can type `cancel` during a report to stop it.

## Server configuration
- Server ID: 1550365493884616788
- Report channel ID: 1550713798703325315
- Staff role ID: 1554054627560001617

## Before starting
1. Install dependencies with `npm install`.
2. Create an environment variable named `DISCORD_TOKEN`.
3. Put your Discord bot token into `DISCORD_TOKEN`.
4. In Discord Developer Portal, enable **Message Content Intent**.
5. Invite the bot with permissions to view/send messages in the server and report channel.

Never publish your bot token or put it into public source code.

## Start
npm install
npm start
