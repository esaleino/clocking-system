var express = require('express');
var app = express();
var connection = require('../connectPostgres');
const SessionCheck = require('../serverjs/session');
var sessionCheck = new SessionCheck();
var bcrypt = require('bcrypt');
var hash = require('../serverjs/hashing');

// POST login authentication
app.post('/authpost', function (req, res) {
  var username = req.body.username;
  // Setting user input to variables
  var password = req.body.password;
  // Verifying both fields are filled
  var success = false;
  var validated = false;
  if (username && password) {
    // Make database query for checking login information
    connection.query(
      'SELECT password, validated FROM accounts WHERE username = $1',
      [username],
      async function (error, results) {
        // user exists
        console.log(results);
        if (results.rowCount > 0) {
          results.rows[0].validated;
          var hash = results.rows[0].password;
          console.log('hello world + ' + hash);
          var hashing = new Promise(function (resolve, reject) {
            bcrypt.compare(password, hash, function (err, res) {
              if (res) {
                console.log('Password correct!');
                success = true;
                resolve(success);
              } else {
                console.log('Incorrect password.');
                success = false;
                reject(success);
              }
            });
          });
          hashing
            .then(function (resolve) {
              console.log(resolve);
              sessionCheck.checkForSession(req.body.username, req.session.id);
              if (username == 'admin') {
                req.session.loggedin = true;
                req.session.username = username;
                console.log(req.session.username);
                res.redirect('/admin');
              } else {
                var validation = new Promise(function (resolve, reject) {
                  connection.query(
                    'SELECT validated FROM accounts WHERE username = $1 AND validated = 1',
                    [username],
                    function (error, results) {
                      if (results.rowCount > 0) {
                        validated = true;
                        resolve(validated);
                      } else {
                        validated = false;
                        reject(validated);
                      }
                    }
                  );
                });
                validation
                  .then(function (resolve) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    console.log(resolve);
                    console.log('Validated user.');
                    res.redirect('/app/' + req.session.username);
                  })
                  .catch(async function (reject) {
                    console.log(reject);
                    console.log('User not validated.');
                    res.redirect('/login');
                  });
              }
            })
            .catch(function (reject) {
              console.log(reject);
              res.redirect('/login');
            });
        }
      }
    );
  } else {
    // If both fields are not filled - Do this
    // Temporary incorrect input return
    res.send('Please enter Username and Password!');
    res.end();
  }
});
async function login(username, password) {
  return checkValidation(username)
    .then((validationResult) => {
      if (validationResult === true) {
        return hash
          .checkPassword(password, username)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            throw new Error('Error: hash error');
          });
      } else if (typeof validationResult === 'string') {
        return validationResult;
      }
    })
    .catch((e) => {
      throw new Error(e);
    });
}

function checkValidation(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT validated FROM accounts WHERE username = $1',
      [username],
      (err, res) => {
        if (err) {
          reject(err);
        } else resolve(res);
      }
    );
  })
    .then((res) => {
      if (res.rows[0].validated == 1) {
        return true;
      } else {
        return 'User not validated';
      }
    })
    .catch((err) => {
      return 'User not found';
    });
}

module.exports = { app, login, checkValidation };
