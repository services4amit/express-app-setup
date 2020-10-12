var express = require("express");
var router = express.Router();
const service = require("../services/service");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get('/compression', (req, res) => {
  const animal = 'alligator';
  // Send a text/html file back with the word 'alligator' repeated 1000 times
  res.send(animal.repeat(1000));
});

router.route("/syncError").get(service.syncError);
router.route("/asyncError").get(service.asyncError);
module.exports = router;
