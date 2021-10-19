var express = require('express');
var app = express();
var connection = require('../connectPostgres');

// POST for posting user data to database
app.post('/userpost', (req, res) => {
  // populating variables from body
  var username = req.body.username;
  var project = req.body.project;
  var hours = parseInt(req.body.hours);
  var info = req.body.info;
  var id = parseInt(req.body.id);
  console.log(req.session.username + 'Hello me');
  console.log(id, username, project, hours, info);
  console.log('Verifying user login...');
  // When adding new data ID value is not specified - when parsed = NaN
  // Checks for login, also checks that logged in user and the data being input is applied to the same user
  if (
    req.session.loggedin == true &&
    req.session.username == username
  ) {
    // If the ID value is not specified then continue with adding data
    if (isNaN(id)) {
      console.log('Not modifying pre-existing data...');
      // Query database and insert user input values
      connection.query(
        'INSERT INTO projects (username, hours, project, info) VALUES (?, ?, ?, ?)',
        [username, hours, project, info],
        function (fields, results, error) {
          console.log(results);
          console.log('Complete! Redirecting...');
          res.redirect('./app/' + req.session.username);
          res.end();
        }
      );
    }
    // If ID is given, fields are being edited in this statement
    else {
      console.log('Fetching username from database');
      // Make Promise for checking the existing database entry based on ID
      var userCheck = new Promise(function (
        resolve,
        reject
      ) {
        // Query to database where ID and password match
        connection.query(
          'SELECT username FROM projects WHERE id = ? AND username = ?',
          [id, req.session.username],
          function (error, result, fields) {
            // If query returns results, the field is being edited by correct user
            if (result.length > 0) {
              console.log('Everything is okay my friend!');
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
          console.log('Modifying pre-existing data...');
          // Query for updating user input data in to the database
          connection.query(
            'UPDATE projects SET hours = ?, project = ?, info = ? WHERE id = ?',
            [hours, project, info, id],
            function (error, results, fields) {
              console.log(results);
              console.log('Complete! Redirecting...');
              // Successful update, redirecting back to the app page
              res.redirect('./app/' + req.session.username);
            }
          );
        })
        // Catch for rejected query, cancels modify operations
        .catch(function () {
          console.log(
            'Attempting to change other user data, killing session...'
          );
          // Kills the session, forcing user logout and returns the client back to the login page
          req.session.destroy();
          res.redirect('../login');
        });
    }
  }
  // Else when attempting to modify data while either not logged in, or the passed username differs from session username
  else {
    console.log(
      'Error, invalid user login, redirecting to login page!'
    );
    // Kills the session, forcing user logout and returns the client back to the login page
    req.session.destroy();
    res.redirect('../login');
  }
});

module.exports = app;
