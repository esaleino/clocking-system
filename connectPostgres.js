const { Pool } = require('pg');
const config = require('./config');
const connection = new Pool({
  user: config.connectionUser,
  host: config.connectionHost,
  database: config.connectionDatabase,
  password: config.connectionPassword,
  port: config.connectionPort,
});

module.exports = connection;
