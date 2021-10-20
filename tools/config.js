var config = {};

// Auth token for telegram bot, required for bot functions.
config.TelegramAuthToken = '';

// ------ Database configuration ------
config.connectionLimit = 10;
config.connectionHost = '';
config.connectionUser = '';
config.connectionPassword = '';
config.connectionDatabase = '';
config.connectionPort = 3306;

// ------ Database Preset Builder ------
config.runBuilder = false;

module.exports = config;
