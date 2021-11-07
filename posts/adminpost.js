var express = require('express');
var app = express();
require('../jest.config');

var connection = require('../connectPostgres');
const adminQuery = require('../serverjs/queryvars');

app.post('/admin/userVerify', function (req, res) {
  adminPostQuery(
    req.session.username,
    req.body.username,
    adminQuery.userVerify
  ).then((result) => {
    switch (result) {
      // Success case
      case 1:
        console.log(req.body);
        res.send(req.body);
        break;
      // User already validated
      case 0:
        var username = req.body.username;
        res.send({ username: `${username} already verified` });
        break;
      // Not admin
      case 2:
        req.session.destroy();
        res.redirect('../login');
        break;
    }
  });
});
app.post('/admin/userRemove', function (req, res) {
  adminPostQuery(
    req.session.username,
    req.body.username,
    adminQuery.userRemove
  ).then((result) => {
    switch (result) {
      // Success case
      case 1:
        console.log(req.body);
        res.send(req.body);
        break;
      // User doesn't exist
      case 0:
        var username = req.body.username;
        res.send({ username: `${username} already deleted` });
        break;
      // Not admin
      case 2:
        req.session.destroy();
        res.redirect('../login');
        break;
    }
  });
});

function adminPostQuery(loggedInUser, userToValidate, query) {
  return new Promise((resolve, reject) => {
    if (loggedInUser == 'admin') {
      connection
        .query(query, [userToValidate])
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve('not admin');
    }
  })
    .then((res) => {
      switch (res.rowCount) {
        // QUERY success returning 1
        case 1:
          return 1;
        // QUERY fail user not found returning 0
        case 0:
          return 0;
        // Not admin user
        default:
          return 2;
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
}

module.exports = app;
