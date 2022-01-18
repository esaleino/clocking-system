const connection = require('../connectPostgres');
const clockingQuery = require('./queryvars').clockingQuery;

var clocking = {
  in: 1,
  out: 0,
};
var code = {
  success: 1,
  fail: 0,
};

function clocktoDb(clockStatus, body) {
  return new Promise((resolve, reject) => {
    switch (clockStatus) {
      case clocking.in:
        clockIn(body)
          .then((res) => {
            console.log(res);
            resolve(res);
          })
          .catch((err) => {
            throw Error(err);
          });
        break;
      case clocking.out:
        clockOutInfo(body)
          .then((res) => {
            clockOut(res, body).then((res) => {
              resolve(res);
            });
          })
          .catch((err) => {
            throw Error(err);
          });
        break;
      default:
        break;
    }
  });
}

function clockIn(body) {
  return new Promise((resolve, reject) => {
    connection.query(
      clockingQuery.logClockin,
      [body.username, body.project, body.time_start],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows[0].id);
        }
      }
    );
  });
}

function clockOutInfo(body) {
  return new Promise((resolve, reject) => {
    connection.query(
      clockingQuery.getUserClockId,
      [body.username],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows[0].id);
        }
      }
    );
  });
}

function clockOut(id, body) {
  return new Promise((resolve, reject) => {
    connection.query(
      clockingQuery.logClockout,
      [id, body.time_end],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows[0]);
        }
      }
    );
  }).then((res) => {
    console.log(res);
    return getTime(res.time_end, res.time_start);
  });
}

function getTime(timeEnd, timeStart) {
  let difference = Math.floor((timeEnd - timeStart) / 1000);
  return new Date(difference * 1000).toISOString().substr(11, 8);
}

module.exports = clocktoDb;
