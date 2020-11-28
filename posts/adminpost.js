var express = require('express');
var app = express();
var connection = require('../connectMysql');
const adminQuery = require('../serverjs/queryvars');
const sessionStore = require('../sessionstore');
var error = {};
error.loggedIn;

app.post('/admin/userVerify', function (req, res) {
  if (req.session.username == 'admin') {
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        adminQuery.userVerify,
        [req.body.username],
        function (error, results) {
          if (error) {
            reject(error);
          } else {
            resolve('verified user');
          }
        }
      );
    });
    promise
      .then(function (resolve) {
        console.log(resolve);
        res.send(req.body);
      })
      .catch(function (reject) {
        console.log(reject);
        res.send(reject);
      });
  } else {
    res.send('error');
  }
});
app.post('/admin/userRemove', function (req, res) {
  if (req.session.username == 'admin') {
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        adminQuery.userRemove,
        [req.body.username],
        function (error, results) {
          if (error) {
            reject(error);
          } else {
            resolve('removed user');
          }
        }
      );
    });
    promise
      .then(function (resolve) {
        console.log(resolve);
        res.send(req.body);
      })
      .catch(function (reject) {
        console.log(reject);
        res.send(req.body);
      });
  } else {
    res.send(req.body);
  }
});

module.exports = app;
