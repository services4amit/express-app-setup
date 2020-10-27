var express = require("express");
var router = express.Router();
const service = require("../services/service");
const { userValidationRules, validate } = require("../services/validator.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/compression", (req, res) => {
  const animal = "alligator";
  // Send a text/html file back with the word 'alligator' repeated 1000 times
  res.send(animal.repeat(1000));
});

router.post("/validation", userValidationRules(), validate, service.validation);
router.route("/syncError").get(service.syncError);
router.route("/asyncError").get(service.asyncError);
router.route("/sanitizeHTML").get(service.sanity);
router.route("/bfjTest").get(service.bfjTest);
router.route("/jsonStream").get(service.jsonStream);
module.exports = router;
