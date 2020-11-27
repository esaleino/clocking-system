var connection = require('../connectMysql');
var makeAccount = `INSERT IGNORE INTO accounts 
                  (username, password, email) 
                  VALUES (?, ?, ?);`;
var makePerson = `INSERT IGNORE INTO persons 
                  (id, username, FirstName, LastName, 
                  groupName) VALUES (?, ?, ?, ?, 
                  (SELECT groupName FROM workgroups 
                  WHERE groupAuthKey = ?));`;

class Users {
  registerUser(hash, body) {
    connection.query(
      makeAccount,
      [body.username, hash, body.email],
      function (error, results) {
        //console.log(results.insertId);
        var id = results.insertId;
        connection.query(
          makePerson,
          [id, body.username, body.firstname, body.lastname, body.authkey],
          function (error, results) {
            console.log('User ' + body.username + ' created with id: ' + id);
          }
        );
      }
    );
  }
}

module.exports = Users;
