var express = require("express");
var app = express();
var connection = require("../connectMysql");

// POST for registering a new account

app.post("/registerpost", function (req, res) {
  console.log(req.body);
  // Set username as fetched username from client
  var username = req.body.username;
  // Chech that passwords match and are not empty
  if (req.body.password == req.body.passwordCheck && req.body.password != "" && req.body.password != undefined) {
    console.log("password ok!");
    // userCheck promise for making a database check for existing username
    var userCheck = new Promise(function (resolve, reject) {
      connection.query("SELECT * FROM accounts WHERE username = ?", [username], function (error, results, fields) {
        // IF statement for result data

        if (results == undefined) {
          // An error has occured, moving to index
          console.log(error);
          reject("An error has occured.");
        } else if (results.length == 0) {
          // IF no results returned, resolve promise
          console.log("Everything seems to be ok");
          resolve("OK!");
        } else {
          // IF returns results, user already exists so reject promise
          console.log("We seem to have a problem here :(");
          reject("User already exists.");
        }
      });
    });
    // After promise, continue with register accordingly
    userCheck
      .then(function () {
        // When promise is resolved successfully, insert registered information to database
        connection.query("INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)", [req.body.username, req.body.password, req.body.email], function (
          results
        ) {
          console.log(results);
          console.log("Account creation complete! Redirecting to login...");
          // Redirect to login page
          res.redirect("../login");
        });
      })
      .catch(function () {
        // When promise is rejected, move to catch block
        console.log("This user already exists.");
        // Encode error message for sending it to register router
        var errormessage = encodeURIComponent("falseuser");
        console.log(decodeURIComponent(errormessage));
        // Redirect to register router with errormessage
        res.redirect("/register/" + errormessage);
      });
  }
});

module.exports = app;
