var express = require('express');
var app = express();
var connection = require('../connectPostgres');
const adminQuery = require('../serverjs/queryvars');

app.post('/admin/userVerify', function (req, res) {
  if (req.session.username == 'admin') {
    var promise = new Promise((resolve, reject) => {
      connection.query(
        adminQuery.userVerify,
        [req.body.username],
        function (err, results) {
          if (err) {
            reject(err);
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
        function (err, results) {
          if (err) {
            reject(err);
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

function validate(loggedInUser, userToValidate) {
  return new Promise((resolve, reject) => {
    if (loggedInUser == 'admin') {
      resolve('User validated');
    } else {
      reject('not admin');
    }
  })
    .then((resolve) => {
      return resolve;
    })
    .catch((reject) => {
      return reject;
    });
}

module.exports = { app, validate };
