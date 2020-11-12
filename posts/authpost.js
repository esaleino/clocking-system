var express = require("express");
var app = express();
var connection = require("../connectMysql");

// POST login authentication
app.post("/authpost", function (req, res) {
  console.log("are we here?");
  // Setting user input to variables
  var username = req.body.username;
  var password = req.body.password;
  console.log(username, password, req.body.username, req.body.password);
  // Verifying both fields are filled
  if (username && password) {
    console.log("are we even here?");
    // Make database query for checking login information
    connection.query("SELECT * FROM accounts WHERE username = ? AND password = ?", [username, password], function (error, results, fields) {
      if (results.length > 0) {
        // Change session variables for logged in user
        req.session.loggedin = true;
        req.session.username = username;
        //res.redirect("/app");
        if (req.session.username == "admin") {
          // Temporary admin page redirect on admin login
          console.log("Admin login detected, moving to admin page");
          res.redirect("/admin");
        } else {
          // Redirects to users page
          console.log("logged in!");
          res.redirect("/app/" + req.session.username);
        }
      } else {
        // Temporary incorrect login return
        res.send("Incorrect Username and/or Password!");
      }
      //res.end();
    });
  } else {
    // If both fields are not filled - Do this
    // Temporary incorrect input return
    res.send("Please enter Username and Password!");
    res.end();
  }
});

module.exports = app;
