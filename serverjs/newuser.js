var connection = require('../connectMysql');

class NewUser {
  insert(hash, username, email) {
    connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, hash, email], function (error, results) {
      console.log(results.insertId);
      var id = results.insertId;
      connection.query("INSERT INTO persons (id, username, FirstName, LastName, groupName) VALUES (?, ?, 'undefined', 'undefined', 'undefined')", [
        id,
        username,
      ]);
      console.log('Filled database');
    });
  }
}

module.exports = NewUser;
