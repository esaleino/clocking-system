const TelegramBot = require("node-telegram-bot-api");
var config = require("../config");

const token = config.TelegramAuthToken;
const bot = new TelegramBot(token, {
  polling: true,
});

bot.onText(/\/echo (.+)/, function (msg, match) {
  const chatId = msg.chat.id;
  var resp = match[1];
  bot.sendMessage(chatId, resp());
});

bot.on("message", function (msg) {
  const chatId = msg.chat.id;
  console.log(chatId + " I am alive. " + msg.chat.username);
  //bot.sendMessage(chatId, "Received your message");
});

module.exports = bot;
