var express = require('express');
var router = express.Router();
var connection = require('../connectPostgres');
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
    console.log(req.session);
    if (
      req.session.loggedin == true &&
      req.session.username == res.locals.id &&
      req.session.username != 'admin'
    ) {
      let check = await checkStatus.checkStatus(req.session.username);
      console.log(check);
      var variables = await checkStatus.populate(check);
      console.log(variables);
      connection.query(
        'SELECT * FROM statushistory WHERE username = $1',
        [req.session.username],
        function (err, results, fields) {
          // console.log(results);
          console.log(results.rows);
          var response = results.rows;
          // console.log(response);
          console.log('connected as id ' + connection.threadId);
          res.render('app', {
            date: req.session.time_start,
            title: 'Welcome back, ' + req.session.username + '!',
            loggedinUser: req.session.username,
            tableData: response,
            clockin: req.session.clock,
            onlunch: req.session.lunch,
            currentPage: 'App Panel',
          });
        }
      );
    } else if (req.session.username == 'admin') {
      res.redirect('../admin');
    } else {
      res.redirect('../login');
    }
  }
);
router.get('/', function (req, res) {
  if (req.session.loggedin == true) {
    res.redirect('/app/' + req.session.username);
  } else {
    res.render('login', {
      status: 'Not logged in, please login first',
      title: 'Login page',
      loggedinUser: 'Not logged in',
      currentPage: 'Login Panel',
    });
  }
});
//router.get("/:id", function (req, res, next) {});

module.exports = router;
