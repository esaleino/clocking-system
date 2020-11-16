var express = require('express');
var app = express();
const Clocking = require('../serverjs/clocking.js');
var clocking = new Clocking();
const CheckStatus = require('../serverjs/checkStatus.js');
var checkStatus = new CheckStatus();
var connection = require('../connectMysql');

app.post('/clocking/:id', async function (req, res) {
  var passingVar = req.params.id;
  let check = await checkStatus.checkStatus(req.session.username);
  let populatevars = await checkStatus.populate(check);
  console.log(check);
  console.log(populatevars);
  var clockIn = populatevars.clockedin;
  var onLunch = populatevars.onlunch;
  switch (passingVar) {
    case 'clockin':
      if (check.clockedin == 0) {
        console.log('not clocked in, clocking in!...');
        clocking.clockIn(req.session.username);
        clockin = 'Successfully clocked in!';
      } else {
        clockIn = 'Already clocked in!!';
        console.log('Already clocked in, ignoring.');
      }
      break;
    case 'lunch':
      if (check.onlunch == 0) {
        clocking.lunch(req.session.username);
        onLunch = 'Went to lunch';
      } else {
        onLunch = 'Already on lunch';
      }
      break;
    case 'clockout':
      if (check.clockedin == 0) {
        clockin = 'Already clocked out.';
      } else {
        clocking.clockOut(req.session.username);
        clockin = 'Successfully clocked out';
      }
      break;
  }
  console.log('please dont...');
  connection.query('SELECT * FROM projects WHERE username = ?', [req.session.username], function (err, results, fields) {
    // console.log(results);
    var response = results;
    // console.log(response);
    console.log('connected as id ' + connection.threadId);
    res.render('app', {
      title: 'Welcome back, ' + req.session.username + '!',
      loggedinUser: req.session.username,
      tableData: response,
      clockin: clockIn,
      onlunch: onLunch,
    });
  });
});

module.exports = app;
