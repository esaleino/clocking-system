var express = require('express');
var app = express();
var connection = require('../connectPostgres');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var Users = require('../serverjs/users');
var users = new Users();

// POST for registering a new account

app.post('/registerpost', function (req, res) {
  console.log(req.body);
  // Set username as fetched username from client
  var username = req.body.username;
  // Chech that passwords match and are not empty
  if (
    req.body.password == req.body.passwordCheck &&
    req.body.password != '' &&
    req.body.password != undefined
  ) {
    console.log('password ok!');
    // userCheck promise for making a database check for existing username
    var userCheck = new Promise(function (resolve, reject) {
      connection.query(
        'SELECT * FROM accounts WHERE username = $1',
        [username],
        function (error, results, fields) {
          // IF statement for result data

          if (results == undefined) {
            // An error has occured
            console.log(error);
            reject(error);
          } else if (results.length == 0) {
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
  }
});

function checkUser(username, email) {
  return new Promise((reject, resolve) => {
    connection.query('');
  });
}

module.exports = app;
