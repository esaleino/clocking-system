const connection = require('../connectPostgres');
const clockingQuery = require('./queryvars').clockingQuery;
console.log(clockingQuery);

const clockState = {
  true: 1,
  false: 0,
};

class Clocking {
  clockIn(username) {
    connection.query(
      clockingQuery.clock,
      [clockState.true, username],
      (res) => {
        console.log(username + ' has clocked in!');
      }
    );
  }
  lunch(username) {
    connection.query(
      clockingQuery.lunch,
      [clockState.true, username],
      (res) => {
        console.log(username + ' went to lunch!');
      }
    );
  }
  offLunch(username) {
    connection.query(
      clockingQuery.lunch,
      [clockState.false, username],
      (res) => {
        console.log(username + ' returned from lunch!');
      }
    );
  }
  clockOut(username) {
    connection.query(
      clockingQuery.clock,
      [clockState.false, username],
      function (error, result) {
        console.log(username + ' has clocked out!');
      }
    );
  }
}

module.exports = Clocking;
