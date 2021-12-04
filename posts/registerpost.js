var express = require('express');
var app = express();
var connection = require('../connectPostgres');
const serverdbQuery = require('../serverjs/queryvars').serverdbQuery;
var hashing = require('../serverjs/hashing').hashPassword;
const response = {
  success: 1,
  accountfailure: 0,
  personfailure: 2,
};

const userResponse = {
  success: 1,
  userExists: 2,
  emailExists: 3,
};

const errormessage = {
  userError: 'user already exists',
  emailError: 'email already exists',
};
// POST for registering a new account

app.post('/registerpost', function (req, res) {
  var username = req.body.username;
  if (
    req.body.password == req.body.passwordCheck &&
    req.body.password != '' &&
    req.body.password != undefined
  ) {
    let body = req.body;
    checkUser(body.username, body.email).then((checkRes) => {
      switch (checkRes) {
        case userResponse.success:
          hashing(body.password).then((hashRes) => {
            registerUser(hashRes, body).then((regRes) => {
              switch (regRes) {
                case response.success:
                  res.redirect('../login');
                  break;
                case response.personfailure:
                  break;
                case response.accountfailure:
                  break;
                default:
                  console.error(regRes);
                  break;
              }
            });
          });
          break;
        case userResponse.userExists:
          break;
        case userResponse.emailExists:
          break;
        default:
          break;
      }
    });
  }
  /* console.log(req.body);
  // Set username as fetched username from client
  
  // Chech that passwords match and are not empty
  i {
    console.log('password ok!');
    // userCheck promise for making a database check for existing username
    var userCheck = new Promise(function (resolve, reject) {
      connection.query(
        'SELECT * FROM accounts WHERE username = $1',
        [username],
        function (error, results) {
          // IF statement for result data

          if (results == undefined) {
            // An error has occured
            console.log(error);
            reject(error);
          } else if (results.rowCount == 0) {
            // IF no results returned => resolve
            resolve('OK!');
          } else {
            // IF returns results, user already exists => reject
            reject('User already exists.');
          }
        }
      );
    });
    userCheck
      .then(function () {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            console.log(hash);
            users.registerUser(hash, req.body);
          });
          res.redirect('../login');
        });
      })
      .catch(function () {
        // Encode error message for sending it to register router
        var errormessage = encodeURIComponent('falseuser');
        console.log(decodeURIComponent(errormessage));
        // Redirect to register router with errormessage
        res.redirect('/register/' + errormessage);
      });
  } */
});

function registerUser(hash, body) {
  return createAccount(hash, body)
    .then((res) => {
      let id = res;
      return connection
        .query(serverdbQuery.makePerson, [
          id,
          body.username,
          body.firstname,
          body.lastname,
          body.authkey,
        ])
        .then((result) => {
          return response.success;
        })
        .catch(() => {
          return response.personfailure;
        });
    })
    .catch((err) => {
      return err;
    });
}

function createAccount(hash, body) {
  return new Promise((resolve, reject) => {
    connection.query(
      serverdbQuery.makeAccount,
      [body.username, hash, body.email],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows[0].id);
        }
      }
    );
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw response.accountfailure;
    });
}

function checkUser(username, email) {
  return new Promise((resolve, reject) => {
    connection
      .query('select username from accounts where username = $1', [username])
      .then((res) => {
        if (res.rowCount == 1) {
          resolve(userResponse.userExists);
        } else {
          connection
            .query('select email from accounts where email = $1', [email])
            .then((res) => {
              if (res.rowCount == 1) {
                resolve(userResponse.emailExists);
              } else {
                resolve(userResponse.success);
              }
            });
        }
      });
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = app;
