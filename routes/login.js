var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedin) {
    res.redirect("/app/" + req.session.username);
  }
  res.render("login", { title: "Login page", loggedinUser: "Not logged in", status: "" });
});

module.exports = router;
