const connection = require('../connectPostgres');

class Clocking {
  clockIn(username) {
    connection.query(
      'UPDATE persons SET clockedin = true WHERE username = $1',
      [username],
      function (error, result) {
        console.log(username + ' Successfully clocked in!');
      }
    );
  }
  lunch(username) {
    connection.query(
      'UPDATE persons SET onlunch = true WHERE username = $1',
      [username],
      function (error, result) {
        console.log(username + ' Went to lunch!');
      }
    );
  }
  clockOut(username) {
    connection.query(
      'UPDATE persons SET clockedin = false WHERE username = $1',
      [username],
      function (error, result) {
        console.log(
          username + ' Successfully clocked out!'
        );
      }
    );
  }
}

module.exports = Clocking;
