const { Pool } = require('pg');
const connection = new Pool({
  user: process.env.database_user,
  host: process.env.database_host,
  database: process.env.database_name,
  password: process.env.database_password,
  port: process.env.database_port,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = connection;
