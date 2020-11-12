var mysql = require("mysql");
var config = require("config.js");

var connection = mysql.createConnection({
  connectionLimit: config.connectionLimit,
  host: config.connectionHost,
  user: config.connectionUser,
  password: config.connectionPassword,
  database: config.connectionDatabase,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
