var express = require("express");
var router = express.Router();

/* GET home page. */
router.use(
  "/:valid",
  function (req, res, next) {
    res.locals.valid = req.params.valid;
    console.log(res.locals.valid);
    next();
  },
  function (req, res) {
    console.log(res.locals.valid);
    if (res.locals.valid == "falseuser") {
      res.render("register", {
        title: "Welcome to the register page.",
        errormessage1: "User already exists.",
        errormessage2: "Email already in use.",
      });
    }
  }
);
router.get("/", function (req, res, next) {
  res.render("register", {
    title: "Welcome to the register page.",
    errormessage1: "",
    errormessage2: "",
  });
});

module.exports = router;
