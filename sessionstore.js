var session = require('express-session');
const config = require('./config');
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: config.connectionHost,
  port: config.connectionPort,
  user: config.connectionUser,
  password: config.connectionPassword,
  database: config.connectionDatabase,
  clearExpired: true,
};

var sessionStore = new MySQLStore(options);

module.exports = sessionStore;
