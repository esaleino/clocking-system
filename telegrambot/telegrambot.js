const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.token, {
  polling: true,
});

bot.onText(/\/echo (.+)/, function (msg, match) {
  console.log('hello');
  const chatId = msg.chat.id;
  var resp = match[1];
  bot.sendMessage(chatId, resp());
});

bot.on('message', function (msg) {
  console.log('hello');
  console.log(msg);
  const chatId = msg.chat.id;
  console.log(msg.chat.id);
});

module.exports = bot;
