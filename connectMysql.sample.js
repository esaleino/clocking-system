var mysql = require("mysql");

var connection = mysql.createConnection({
  connectionLimit: 10,
  host: "",
  user: "",
  password: "",
  database: "",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
