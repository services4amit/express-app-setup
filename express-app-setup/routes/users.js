var express = require("express");
var router = express.Router();
const service = require("../services/service");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.route("/syncError").get(service.syncError);
router.route("/asyncError").get(service.asyncError);
module.exports = router;
