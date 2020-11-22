var mysql = require('mysql');
const config = require('./config');

var connection = mysql.createConnection({
  connectionLimit: config.connectionLimit,
  host: config.connectionHost,
  user: config.connectionUser,
  password: config.connectionPassword,
  database: config.connectionDatabase,
  port: config.connectionPort,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
