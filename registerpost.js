var express = require("express");
var app = express();

app.post("/registerpost", function (req, res) {
  console.log(req.body);
  var username = req.body.username;
  if (req.body.password == req.body.passwordCheck && req.body.password != "") {
    console.log("password ok!");
    console.log(username);
    var userCheck = new Promise(function (resolve, reject) {
      connection.query(
        "SELECT * FROM accounts WHERE username = ?",
        [username],
        function (error, results, fields) {
          if (results.length > 0) {
            console.log("We seem to have a problem here :(");
            reject();
          } else {
            console.log("Everything seems to be ok");
            resolve();
          }
        }
      );
    });
    userCheck
      .then(function () {
        connection.query(
          "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)",
          [req.body.username, req.body.password, req.body.email],
          function (error, results, fields) {
            console.log(results);
            console.log("Account creation complete! Redirecting to login...");
            res.redirect("../login");
          }
        );
      })
      .catch(function () {
        console.log("This user already exists.");
        var errormessage = encodeURIComponent("falseuser");
        console.log(decodeURIComponent(errormessage));
        res.redirect("/register/" + errormessage);
      });
  }
});

module.exports = app;
