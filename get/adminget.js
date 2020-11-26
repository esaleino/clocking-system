const { promiseImpl } = require('ejs');
var express = require('express');
var app = express();
var connection = require('../connectMysql');
const adminQuery = require('../serverjs/queryvars');

app.get('/admin/getUsers', function (req, res) {
  if (req.session.username == 'admin') {
    console.log(adminQuery.getUsers);
    connection.query(adminQuery.getUsers, function (error, results) {
      console.log(results);
      return res.send(results);
    });
  } else {
    res.redirect('../login', { status: 'Not logged in, please login first', title: 'Login page', loggedinUser: 'Not logged in' });
  }
});

module.exports = app;
