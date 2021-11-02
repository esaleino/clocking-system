var express = require('express');
var router = express.Router();
/* var sessionStore = require('../sessionstore'); */
var session = require('express-session');
var ViewsCounter = require('../serverjs/viewcounter.js');
var viewsCounter = new ViewsCounter();
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.socket.remoteAddress);
  viewsCounter.doViews(req.socket.remoteAddress);
  //console.log(session.username);
  //console.log(req.session.username);

  if (req.session.loggedin) {
    currentUser = req.session.username;
  } else {
    currentUser = 'Not logged in';
  }
  res.render('index', {
    title: 'Welcome to my website',
    loggedinUser: currentUser,
    currentPage: 'Index',
  });
});

module.exports = router;
