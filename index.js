console.log("Aaron Hunter code started!");
const {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Aaron Hunter configuration
const SERVER_ID = "1550365493884616788";
const REPORT_CHANNEL_ID = "1550713798703325315";
const STAFF_ROLE_ID = "1554054627560001617";

const activeReports = new Map();

client.once("ready", () => {
  console.log(`Aaron Hunter is online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ===== SERVER COMMANDS =====
  if (message.guild) {
    if (message.guild.id !== SERVER_ID) return;

    if (message.content.toLowerCase() === "!report") {
      try {
        await message.reply("📩 I'll help you submit a report. Check your DMs.");
        await startReport(message.author);
      } catch (error) {
        console.error(error);
      }
    }

    if (message.content.toLowerCase() === "!aaron") {
      await message.reply(
        "Hello! I'm **Aaron Hunter**. You can use `!report` to submit a report through DM."
      );
    }

    return;
  }

  // ===== DM REPORT SYSTEM =====
  if (message.channel.type !== ChannelType.DM) return;

  const userId = message.author.id;
  const session = activeReports.get(userId);

  if (!session) {
    await message.reply(
      "Hello! I'm **Aaron Hunter**. If you want to submit a report, type `report`."
    );

    if (message.content.toLowerCase() === "report") {
      await startReport(message.author);
    }
    return;
  }

  await handleAnswer(message);
});

async function startReport(user) {
  const userId = user.id;

  if (activeReports.has(userId)) {
    await user.send("You already have an active report. Please finish it first.");
    return;
  }

  activeReports.set(userId, {
    step: 1,
    answers: {}
  });

  try {
    await user.send(
      "📩 **Aaron Hunter — Report System**\n\n" +
      "I'll ask you a few questions. Please answer each one clearly.\n\n" +
      "**1/3 — Who are you reporting?**\n" +
      "Send their username or user ID."
    );
  } catch {
    activeReports.delete(userId);
  }
}

async function handleAnswer(message) {
  const userId = message.author.id;
  const session = activeReports.get(userId);
  const answer = message.content.trim();

  if (!answer) {
    await message.reply("Please send a text answer.");
    return;
  }

  if (answer.toLowerCase() === "cancel") {
    activeReports.delete(userId);
    await message.reply("❌ Your report has been cancelled.");
    return;
  }

  if (session.step === 1) {
    session.answers.reportedUser = answer;
    session.step = 2;

    await message.reply(
      "**2/3 — What happened?**\n" +
      "Please explain the situation clearly."
    );
    return;
  }

  if (session.step === 2) {
    session.answers.reason = answer;
    session.step = 3;

    await message.reply(
      "**3/3 — Do you have evidence?**\n" +
      "Send the evidence/details, or type `none` if you don't have any."
    );
    return;
  }

  if (session.step === 3) {
    session.answers.evidence = answer;

    const reportChannel = await client.channels.fetch(REPORT_CHANNEL_ID);

    if (!reportChannel || !reportChannel.isTextBased()) {
      await message.reply(
        "⚠️ I couldn't find the report channel. Please contact the staff team."
      );
      activeReports.delete(userId);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("📩 New Report — Aaron Hunter")
      .setDescription(
        `<@&${STAFF_ROLE_ID}>\n\nA new report has been submitted.`
      )
      .addFields(
        {
          name: "Reporter",
          value: `${message.author} (${message.author.tag})\nID: ${message.author.id}`
        },
        {
          name: "Reported User",
          value: session.answers.reportedUser
        },
        {
          name: "What Happened",
          value: session.answers.reason
        },
        {
          name: "Evidence",
          value: session.answers.evidence
        }
      )
      .setTimestamp();

    await reportChannel.send({
      content: `<@&${STAFF_ROLE_ID}>`,
      embeds: [embed],
      allowedMentions: { roles: [STAFF_ROLE_ID] }
    });

    await message.reply(
      "✅ **Your report has been submitted successfully.**\n\n" +
      "Thank you for reporting the issue. The staff team will review it."
    );

    activeReports.delete(userId);
  }
}

client.login(process.env.DISCORD_TOKEN);
