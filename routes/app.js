var express = require("express");
var router = express.Router();
var connection = require("../connectMysql");

router.use(
  "/:id",
  function (req, res, next) {
    console.log(req.session.username + "this is first");
    res.locals.id = req.params.id;
    console.log("User not logged in, => loginerror");
    next();
  },
  function (req, res, next) {
    console.log("this is last");
    if (req.session.loggedin == true && req.session.username == res.locals.id) {
      connection.query("SELECT * FROM projects WHERE username = ?", [req.session.username], function (err, results, fields) {
        //console.log(results);
        var response = results;
        console.log("connected as id " + connection.threadId);
        res.render("app", {
          title: "Welcome back, " + req.session.username + "!",
          loggedinUser: req.session.username,
          tableData: response,
        });
      });
    } else {
      res.render("loginerror.ejs");
    }
  }
);
//router.get("/:id", function (req, res, next) {});

module.exports = router;
