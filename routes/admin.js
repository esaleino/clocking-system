var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.username == "admin") {
    res.render("index", {
      title: "Welcome to the admin panel!",
      subTitle:
        "This panel is only meant for modifying data or removing data - not for adding new data",
    });
  } else {
    res.redirect("login");
  }
});

module.exports = router;
