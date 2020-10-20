const fs = require("fs");
const catchAsync = require("../catchAsync");
const catchSync = require("../catchSync");

function asyncTest() {
  return new Promise((resolve, reject) => {
    fs.readFile("not-there", (err, data) => {
      if (err) {
        reject(new Error("NO_FILES"));
      } else {
        resolve("SUCCESS");
      }
    });
  });
}

function syncTest() {
  return "SYNC_WORKED";
  // throw new Error("oh no")
}

module.exports.syncError = catchSync((req, res, next) => {
  // sync error handling
  let result = syncTest();
  res.send(result);
});

module.exports.asyncError = catchAsync(async (req, res, next) => {
  let resp = await asyncTest();
  res.status(200).json({ msg: resp });
});

module.exports.validation = catchAsync(async (req, res, next) => {
  console.log('body: ',req.body)
  res.status(200).json({msg: "Validation is Successful"})
});
