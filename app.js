const { Telegraf } = require("telegraf");
const axios = require("axios");
const server = require("http").createServer();
require("dotenv").config();

// create bot using token
const bot = new Telegraf(process.env.TOKEN);

// listen and replies to -> "/start"
bot.start((ctx) => {
  ctx.reply(
    "Bot started...\nJust send any word to get its meaning.\nTo access some assistance on how to use, type /help."
  );
});

// listen and replies to -> "/help"
bot.help((ctx) => {
  ctx.reply(
    `To get the meaning of any word just send the word and get its meaning.\nThis bot can perform commands :\n/start - Start bot\n/help - Get help/Assistance`
  );
});

// listen and replies to any message recived i.e. gives meaning of word recieved
bot.on("message", async (ctx) => {
  console.log(ctx.message.text);
  try {
    const result = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${ctx.message.text}`
    );

    const data = result.data?.[0];
    const word = data?.word;
    const meaning = data?.meanings[0]?.definitions?.[0]?.definition;
    if (!meaning || !word) throw new Error();
    ctx.reply(`Word: ${word}\nMeaning: ${meaning}`);
  } catch (error) {
    ctx.reply(
      "Invalid Word given. Please correct it or redirect to web for accurate meaning. /help"
    );
  }
});

// launches bot
bot.launch();

server.listen();
