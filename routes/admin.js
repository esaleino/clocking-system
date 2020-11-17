var express = require('express');
const connection = require('../connectMysql');
const sessionStore = require('../sessionstore');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var adminData = new Promise(function (resolve, reject) {
    connection.query('SELECT username, groupName, FirstName, LastName, clockedin, onlunch, validated FROM persons JOIN accounts USING(username)', function (
      error,
      results,
      fields
    ) {
      console.log(results);
      if (results.length > 0) {
        resolve(results);
      } else {
        reject(error);
      }
    });
  });
  adminData
    .then(function (resolve) {
      if (req.session.username == 'admin') {
        res.render('admin', {
          title: 'Welcome to the admin panel!',
          subTitle: '',
          tableData: resolve,
          loggedinUser: req.session.username,
        });
      } else {
        res.redirect('login');
      }
    })
    .catch(function (reject) {
      console.log(reject);
      sessionStore.destroy(req.session.id);
      res.redirect('login');
    });
});

module.exports = router;
