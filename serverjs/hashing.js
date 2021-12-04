const bcrypt = require('bcrypt');

const connection = require('../connectPostgres');
const saltRounds = 10;

function hashPassword(raw) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (error, salt) => {
      bcrypt.hash(raw, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  })
    .then((resolve) => {
      return resolve;
    })
    .catch((err) => {
      throw err;
    });
}
function checkPassword(raw, username) {
  return new Promise((resolve, reject) => {
    connection
      .query('select password from accounts where username = $1', [username])
      .then((resQuery) => {
        bcrypt.compare(raw, resQuery.rows[0].password, (err, resCrypt) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(resCrypt);
          }
        });
      })
      .catch((e) => {
        reject('Error: user not found');
      });
  })
    .then((resolve) => {
      return resolve;
    })
    .catch((reject) => {
      throw new Error(reject);
    });
}

module.exports = { checkPassword, hashPassword };
