var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.session.username);
  currentUser = "Not logged in";
  res.render("index", {
    title: "Welcome to my website",
    loggedinUser: currentUser,
  });
});

module.exports = router;
