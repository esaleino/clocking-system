const connection = require('../connectMysql');

class Clocking {
  clockIn(username) {
    connection.query('UPDATE persons SET clockedin = true WHERE username = ?', [username], function (error, result) {
      console.log(username + ' Successfully clocked in!');
    });
  }
  lunch(username) {
    connection.query('UPDATE persons SET onlunch = true WHERE username = ?', [username], function (error, result) {
      console.log(username + ' Went to lunch!');
    });
  }
  clockOut(username) {
    connection.query('UPDATE persons SET clockedin = false WHERE username = ?', [username], function (error, result) {
      console.log(username + ' Successfully clocked out!');
    });
  }
}

module.exports = Clocking;
