var connection = require('../connectPostgres');
var makeAccount = `INSERT INTO accounts 
                  (username, password, email) 
                  VALUES ($1,$2,$3)ON CONFLICT DO NOTHING;`;
var makePerson = `INSERT INTO persons 
                  ( username, FirstName, LastName, 
                  groupName) VALUES ($1,$2,$3,$4, 
                  (SELECT groupName FROM workgroups 
                  WHERE groupAuthKey = ?))ON CONFLICT DO NOTHING;`;

var buildAccount = `INSERT INTO accounts(username, password, email, validated, forgotpassword, changepassword) VALUES ($1,$2,$3,$4,$5,$6)ON CONFLICT DO NOTHING;`;
var buildPerson = `INSERT INTO persons(id, username, FirstName, LastName, groupName) VALUES ($1,$2,$3,$4, (SELECT groupName FROM workgroups WHERE groupAuthKey = $5))ON CONFLICT DO NOTHING;`;

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
          [
            id,
            body.username,
            body.firstname,
            body.lastname,
            body.authkey,
          ],
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
      (err, res) => {
        var promise = new Promise(function (
          resolve,
          reject
        ) {
          connection.query(
            `SELECT id from ACCOUNTS where username = $1`,
            [body.username],
            (err, res) => {
              if (err) {
                reject();
              } else {
                resolve(res);
              }
            }
          );
        });
        promise.then((res) => {
          var id = res.rows[0].id;
          connection.query(
            buildPerson,
            [
              id,
              body.username,
              body.firstname,
              body.lastname,
              body.authkey,
            ],
            (err, res) => {
              console.log(err, res);
              console.log(
                `user ${body.username} successfully created with hash ${hash}`
              );
            }
          );
        });
      }
    );
  }
}

module.exports = Users;
