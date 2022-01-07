var express = require('express');
var app = express();
const Clocking = require('../serverjs/clocking.js');
var clocking = new Clocking();
const CheckStatus = require('../serverjs/checkstatus.js');
var checkStatus = new CheckStatus();
var connection = require('../connectPostgres');
var clocktoDb = require('../serverjs/clocktodb');

var clockinState = {
  working: 'clockin',
  onLunch: 'lunch',
  unavailable: 'clockout',
};
var sendState = {
  true: 1,
  false: 0,
};

app.post('/clocking/:id', async function (req, res) {
  console.log(req.session);
  req.session.project = 'placeholder';
  var passingVar = req.params.id;
  console.log('hello' + req.params.id);
  let check = await checkStatus.checkStatus(req.session.username);
  let populatevars = await checkStatus.populate(check);
  console.log(`this is important information: ${check}`);
  console.log(check);
  console.log(populatevars);
  var clockIn = populatevars.clockedin;
  var onLunch = populatevars.onlunch;
  switch (passingVar) {
    case clockinState.working:
      if (req.session.clock === false) {
        console.log('not clocked in, clocking in!...');
        clocking.clockIn(req.session.username);
        req.session.time_start = new Date();
        req.session.clock = true;
        clocktoDb(sendState.true, req.session).then((res) => {
          req.session.id = res;
        });
        clockIn = 'Successfully clocked in!';
      } else {
        clockIn = 'Already clocked in!!';
        console.log('Already clocked in, ignoring.');
      }
      break;
    case clockinState.onLunch:
      if (req.session.lunch === false) {
        clocking.lunch(req.session.username);
        req.session.lunch = true;
        onLunch = 'Went to lunch';
      } else {
        req.session.lunch = false;
        onLunch = 'Returned from lunch';
      }
      break;
    case clockinState.unavailable:
      if (req.session.clock === false) {
        clockIn = 'Already clocked out.';
      } else {
        clocking.clockOut(req.session.username);
        req.session.clock = false;
        req.session.time_end = new Date();
        clocktoDb(sendState.false, req.session).then((res) => {
          console.log('we are here now' + res);
        });
        clockIn = 'Successfully clocked out';
      }
      break;
  }
  console.log('please dont...');
  connection.query(
    'SELECT * FROM projects WHERE username = $1',
    [req.session.username],
    function (err, results, fields) {
      // console.log(results);
      var response = results.rows;
      // console.log(response);
      console.log('connected as id ' + connection.threadId);
      res.render('app', {
        title: 'Welcome back, ' + req.session.username + '!',
        loggedinUser: req.session.username,
        tableData: response,
        clockin: clockIn,
        onlunch: onLunch,
        currentPage: 'App Panel',
      });
    }
  );
});

module.exports = app;
