var connection = require('../connectMysql');

class ViewsCounter {
  doViews(address) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        'SELECT * FROM page_views WHERE visitorip = ?',
        [address],
        function (error, results) {
          if (results.length > 0) {
            reject('already visited.');
          } else {
            resolve('count visitor =>');
          }
        }
      );
    });
    promise
      .then(function (resolve) {
        console.log(resolve);
        return self.pushViews(address);
      })
      .catch(function (reject) {
        console.log(reject);
        return self.postViews();
      });
  }
  pushViews(address) {
    var self = this;
    connection.query('INSERT INTO page_views (visitorip) VALUES (?)', [
      address,
      function (error, results) {
        if (error) {
          return console.log(error);
        } else {
          console.log(results);
          return self.postViews();
        }
      },
    ]);
  }
  postViews() {
    connection.query(
      `SELECT COUNT(*) AS count FROM page_views WHERE id != 'null'`,
      function (error, results) {
        console.log('Total visitors: ' + results[0].count);
      }
    );
  }
}
module.exports = ViewsCounter;
