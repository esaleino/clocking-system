var express = require('express');
var app = express();

var connection = require('../connectPostgres');
const adminQuery = require('../serverjs/queryvars');

const resultCode = {
  success: 1,
  fail: 0,
  error: 2,
};

const errorMessage = 'An error has occured, logging out';

const removeMessage = {
  success: ' successfully removed!',
  fail: ' does not exist!',
};

const verifyMessage = {
  success: ' successfully validated!',
  fail: ' has already been validated!',
};

app.post('/admin/userVerify', function (req, res) {
  adminPostQuery(
    req.session.username,
    req.body.username,
    adminQuery.userVerify
  ).then((result) => {
    switch (result) {
      case resultCode.success:
        res.send({ text: req.body.username + verifyMessage.success });
        break;
      case resultCode.fail:
        res.send({ text: req.body.username + verifyMessage.fail });
        break;
      default:
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
    console.log(result);
    switch (result) {
      case resultCode.success:
        res.send({ text: req.body.username + removeMessage.success });
        break;
      case resultCode.fail:
        res.send({ text: req.body.username + removeMessage.fail });
        break;
      default:
        req.session.destroy();
        res.redirect('../login');
        break;
    }
  });
});

function adminPostQuery(loggedInUser, userToQuery, query) {
  return new Promise((resolve, reject) => {
    if (loggedInUser == 'admin') {
      connection
        .query(query, [userToQuery])
        .then((res) => {
          resolve(res.rowCount);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve('error');
    }
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

module.exports = app;
