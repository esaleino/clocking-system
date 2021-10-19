const { Pool } = require('pg');
const config = require('./config');
const connection = new Pool({
  user: process.env.database_user,
  host: process.env.database_host,
  database: process.env.database_name,
  password: process.env.database_password,
  port: process.env.database_port,
});

/* connection.query('SELECT * FROM accounts', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res);
  }
}); */
module.exports = connection;
