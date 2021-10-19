var connection = require('../connectPostgres');

class ViewsCounter {
  doViews(address) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        'SELECT * FROM page_views WHERE visitorip = $1',
        [address],
        function (error, results) {
          console.log(error, results);
          if (results.rowCount > 0) {
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
    connection.query(
      'INSERT INTO page_views (visitorip) VALUES ($1)',
      [address],
      function (error, results) {
        if (error) {
          return console.log(error);
        } else {
          console.log(results);
          return self.postViews();
        }
      }
    );
  }
  postViews() {
    connection.query(
      `SELECT COUNT(*) AS count FROM page_views`,
      function (error, results) {
        console.log(results);
        console.log(
          'Total visitors: ' + results.rows[0].count
        );
      }
    );
  }
}
module.exports = ViewsCounter;
