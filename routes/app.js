var express = require('express');
var router = express.Router();
var connection = require('../connectMysql');
const CheckStatus = require('../serverjs/checkstatus.js');
var checkStatus = new CheckStatus();

router.use(
  '/:id',
  function (req, res, next) {
    res.locals.id = req.params.id;
    //console.log("User not logged in, => loginerror");
    next();
  },
  async function (req, res, next) {
    if (req.session.loggedin == true && req.session.username == res.locals.id) {
      let check = await checkStatus.checkStatus(req.session.username);
      console.log(check);
      var variables = await checkStatus.populate(check);
      console.log(variables);
      connection.query('SELECT * FROM projects WHERE username = ?', [req.session.username], function (err, results, fields) {
        // console.log(results);
        var response = results;
        // console.log(response);
        console.log('connected as id ' + connection.threadId);
        res.render('app', {
          title: 'Welcome back, ' + req.session.username + '!',
          loggedinUser: req.session.username,
          tableData: response,
          clockin: variables.clockedin,
          onlunch: variables.onlunch,
        });
      });
    } else {
      res.render('loginerror.ejs');
    }
  }
);
router.get('/', function (req, res) {
  if (req.session.loggedin == true) {
    res.redirect('/app/' + req.session.username);
  } else {
    res.render('login', { status: 'Not logged in, please login first', title: 'Login page', loggedinUser: 'Not logged in' });
  }
});
//router.get("/:id", function (req, res, next) {});

module.exports = router;
