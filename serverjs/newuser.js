var connection = require('../connectMysql');
var makeAccount = `INSERT IGNORE INTO accounts 
                  (username, password, email) 
                  VALUES (?, ?, ?);`;
var makePerson = `INSERT IGNORE INTO persons 
                  (id, username, FirstName, LastName, 
                  groupName) VALUES (?, ?, ?, ?, 
                  (SELECT groupName FROM workgroups 
                  WHERE groupAuthKey = ?));`;

class NewUser {
  insert(hash, body) {
    console.time('newUser');
    connection.query(makeAccount, [body.username, hash, body.email], function (error, results) {
      console.log(results.insertId);
      var id = results.insertId;
      connection.query(makePerson, [id, body.username, body.firstname, body.lastname, body.authkey], function (error, results) {
        console.timeEnd('newUser');
        console.log('Filled database');
      });
    });
  }
}

module.exports = NewUser;
