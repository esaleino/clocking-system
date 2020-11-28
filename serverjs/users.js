var connection = require('../connectMysql');
var makeAccount = `INSERT IGNORE INTO accounts 
                  (username, password, email) 
                  VALUES (?, ?, ?);`;
var makePerson = `INSERT IGNORE INTO persons 
                  (id, username, FirstName, LastName, 
                  groupName) VALUES (?, ?, ?, ?, 
                  (SELECT groupName FROM workgroups 
                  WHERE groupAuthKey = ?));`;

var buildAccount = `INSERT IGNORE INTO accounts(username, password, email, validated, forgotpassword, changepassword) VALUES (?,?,?,?,?,?)`;
var buildPerson = `INSERT IGNORE INTO persons(id, username, FirstName, LastName, groupName) VALUES (?,?,?,?, (SELECT groupName FROM workgroups WHERE groupAuthKey = ?));`;

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
            console.log('user created');
          }
        );
      }
    );
  }
  registerBuilder(hash, body) {
    connection.query(
      buildAccount,
      [
        body.username,
        hash,
        body.email,
        body.validated,
        body.forgotpassword,
        body.changepassword,
      ],
      function (error, results) {
        var id = results.insertId;
        connection.query(
          buildPerson,
          [id, body.username, body.firstname, body.lastname, body.authkey],
          function (error, results) {
            console.log(
              `user ${body.username} successfully created with hash ${hash}`
            );
          }
        );
      }
    );
  }
}

module.exports = Users;
