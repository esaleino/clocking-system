var connection = require('../connectPostgres');

class CheckStatus {
  checkStatus(username) {
    return new Promise(function (resolve) {
      connection.query(
        'SELECT clockedin, onlunch FROM persons WHERE username = $1',
        [username],
        function (error, results) {
          resolve(results.row[0]);
        }
      );
    });
  }
  populate(passing) {
    var variables = { clockedin: '', onlunch: '' };
    if (passing.clockedin == 1) {
      variables.clockedin = 'Clocked in';
    } else {
      variables.clockedin = 'Not clocked in';
    }
    if (passing.onlunch == 1) {
      variables.onlunch = 'On lunch';
    } else {
      variables.onlunch = 'Not on lunch';
    }
    return variables;
  }
}

module.exports = CheckStatus;
