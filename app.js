var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
var connection = require("./connectMysql");
const logErrors = require("express-log-errors");
require("./telegrambot/telegrambot");

// DEFINE ROUTERS
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");
var adminRouter = require("./routes/admin");
var appRouter = require("./routes/app");
var logoutRouter = require("./routes/logout");

// DEFINE POSTS
var registerPost = require("./registerpost");

var cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.post("/authPost", function (req, res) {
  console.log("are we here?");
  var username = req.body.username;
  var password = req.body.password;
  console.log(username, password, req.body.username, req.body.password);
  if (username && password) {
    console.log("are we even here?");
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          //res.redirect("/app");
          if (req.session.username == "admin") {
            console.log("Admin login detected, moving to admin page");
            res.redirect("/admin");
          } else {
            console.log("logged in!");
            res.redirect("/app/" + req.session.username);
          }
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        //res.end();
      }
    );
  } else {
    res.send("Please enter Username and Password!");
    res.end();
  }
});

app.post("/userpost", function (req, res) {
  // populating variables from body
  var username = req.body.username;
  var project = req.body.project;
  var hours = parseInt(req.body.hours);
  var info = req.body.info;
  var id = parseInt(req.body.id);
  console.log(req.session.username + "Hello me");
  console.log(id, username, project, hours, info);
  console.log("Verifying user login...");
  // When adding new data ID value is not specified - when parsed = NaN
  // Checks for login, also checks that logged in user and the data being input is applied to the same user
  if (req.session.loggedin == true && req.session.username == username) {
    // If the ID value is not specified then continue with adding data
    if (isNaN(id)) {
      console.log("Not modifying pre-existing data...");
      // Query database and insert user input values
      connection.query(
        "INSERT INTO projects (username, hours, project, info) VALUES (?, ?, ?, ?)",
        [username, hours, project, info],
        function (fields, results, error) {
          console.log(results);
          console.log("Complete! Redirecting...");
          res.redirect("./app/" + req.session.username);
          res.end();
        }
      );
    }
    // If ID is given, fields are being edited in this statement
    else {
      console.log("Fetching username from database");
      // Make Promise for checking the existing database entry based on ID
      var userCheck = new Promise(function (resolve, reject) {
        // Query to database where ID and password match
        connection.query(
          "SELECT username FROM projects WHERE id = ? AND username = ?",
          [id, req.session.username],
          function (error, result, fields) {
            // If query returns results, the field is being edited by correct user
            if (result.length > 0) {
              console.log("Everything is okay my friend!");
              // Resolves the promise for username in query result
              resolve(result[0].username);
            } else {
              // If no results return, user is attemping to edit a field not belonging to said user - Reject promise
              reject();
            }
          }
        );
      });
      // On successful query, continue with modifying the data
      userCheck
        .then(function (result) {
          console.log(result);
          console.log("Modifying pre-existing data...");
          // Query for updating user input data in to the database
          connection.query(
            "UPDATE projects SET hours = ?, project = ?, info = ? WHERE id = ?",
            [hours, project, info, id],
            function (error, results, fields) {
              console.log(results);
              console.log("Complete! Redirecting...");
              // Successful update, redirecting back to the app page
              res.redirect("./app/" + req.session.username);
            }
          );
        })
        // Catch for rejected query, cancels modify operations
        .catch(function () {
          console.log(
            "Attempting to change other user data, killing session..."
          );
          // Kills the session, forcing user logout and returns the client back to the login page
          req.session.destroy();
          res.redirect("../login");
        });
    }
  }
  // Else when attempting to modify data while either not logged in, or the passed username differs from session username
  else {
    console.log("Error, invalid user login, redirecting to login page!");
    // Kills the session, forcing user logout and returns the client back to the login page
    req.session.destroy();
    res.redirect("../login");
  }
});
// set the views directory
app.set("views", path.join(__dirname, "views"));
// set the view engine to ejs
app.set("view engine", "ejs");
//app.get("/test", (req, res, next) => {
//next(new Error("Test error message"));
//});

app.use(logErrors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Use routers
app.use("/", indexRouter);
app.use("/index", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);
app.use("/app", appRouter);
app.use("/logout", logoutRouter);

// Use POSTS
app.use("", registerPost);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  console.log(err.status);
  res.status(err.status || 500);

  res.render("error");
});

module.exports = app;
