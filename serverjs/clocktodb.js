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

main();

function main(clockStatus, body) {
  switch (clockStatus) {
    case clocking.in:
      clockIn(body)
        .then((res) => {
          return code.success;
        })
        .catch((err) => {
          throw Error(err);
        });
      break;
    case clocking.out:
      clockOutInfo(body)
        .then((res) => {
          return code.success;
        })
        .catch((err) => {
          throw Error(err);
        });
      break;
    default:
      break;
  }
}

function clockIn() {
  var startTime = new Date();
  return new Promise((resolve, reject) => {
    connection.query(
      clockingQuery.logClockin,
      [body.username, body.project, startTime],
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
      (err, res) => {}
    );
  });
}

function clockOut(id) {
  var endTime = new Date();
  return new Promise((resolve, reject) => {
    connection.query(testupd, [id, endTime], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0].id);
      }
    });
  }).then((res) => {
    getTime();
  });
}

function getTime(timeEnd, timeStart) {
  let difference = Math.floor((timeEnd - timeStart) / 1000);
  console.log(new Date(difference * 1000).toISOString().substr(11, 8));
  return difference;
}
