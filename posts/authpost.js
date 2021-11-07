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
  login(username, password)
    .then((loginResult) => {
      /* 
      console.error('the result of this login request is: ' + loginResult); */
      if (loginResult === true) {
        // login successful - logging in
        req.session.loggedin = true;
        req.session.username = username;
        if (username == 'admin') {
          res.redirect('/admin');
        } else {
          res.redirect('/app/' + req.session.username);
        }
      } else {
        // login unsuccessful - redirecting
        res.redirect('/login');
      }
    })
    .catch((e) => {
      throw new Error(e);
    });
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
