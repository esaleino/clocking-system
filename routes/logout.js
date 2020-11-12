var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  console.log("Logging out, destroying session.");
  req.session.destroy();
  res.render("logout", {
    title: "Logged out successfully!",
    loggedinUser: "Not logged in.",
  });
});

module.exports = router;
