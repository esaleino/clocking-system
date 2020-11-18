var config = {};

// Auth token for telegram bot, required for bot functions.
config.TelegramAuthToken = '';

// ------ Database configuration ------
config.connectionLimit = '';
config.connectionHost = '';
config.connectionUser = '';
config.connectionPassword = '';
config.connectionDatabase = '';
config.connectionPort = 3306;

// ------ Builds a preset database ------
config.runBuilder = true;

module.exports = config;
