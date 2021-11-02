var express = require('express');
const connection = require('../connectPostgres');
/* const sessionStore = require('../sessionstore'); */
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  console.log('we must be here');
  console.log(req.session);
  if (req.session.username == 'admin') {
    res.render('admin', {
      title: 'Welcome to the admin panel!',
      subTitle: '',
      loggedinUser: req.session.username,
      currentPage: 'Admin panel',
    });
  } else {
    /* sessionStore.destroy(req.session.id); */
    res.redirect('../login');
  }
});

module.exports = router;
