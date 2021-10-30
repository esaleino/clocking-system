var session = require('express-session');
var pg = require('pg');
var pgSession = require('express-pg-session')(session);

var pgPool = new pg.Pool({
  host: process.env.database_host,
  port: process.env.database_port,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database_name,
  clearExpired: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

let columnNames = {
  session_id: 'session_id',
  session_data: 'data',
  expire: 'expires',
};

let sessionStore = new pgSession({
  pool: pgPool,
  tableName: 'sessions',
  columns: columnNames,
});

module.exports = sessionStore;
