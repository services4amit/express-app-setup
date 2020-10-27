const fs = require("fs");
const catchAsync = require("../catchAsync");
const catchSync = require("../catchSync");
const sanitizeHtml = require("sanitize-html");
const bfj = require("bfj");
const JSONStream = require("JSONStream");
const bigJSON = require("big-json")
var fileSystem = require("fs");

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
  console.log("body: ", req.body);
  res.status(200).json({ msg: "Validation is Successful" });
});

module.exports.sanity = (req, res, next) => {
  const html = "<strong>alert('hello world')</strong>";
  console.log(sanitizeHtml(html));
  console.log(sanitizeHtml("<p>helloo!!!"));
  console.log(sanitizeHtml("console.log('hello world')"));
  console.log(
    sanitizeHtml("<script>alert('hello world')</script>", {
      allowedTags: ["script"],
      allowVulnerableTags: true,
    })
  );
  res.send(html);
};

module.exports.bfjTest = catchAsync(async (req, res, next) => {
  bfj.read("../express-app-setup/public/Catalog.json", {}).then((data) => {
    console.log("BFJ example - ", data);
    res.send(data);
  });
});

module.exports.jsonStream = catchSync((req, res, next) => {
  var records = [
    { id: 1, name: "Terminator" },
    { id: 2, name: "Predator" },
    { id: 3, name: "True Lies" },
    { id: 4, name: "Running Man" },
    { id: 5, name: "Twins" },
  ];

  var transformStream = JSONStream.stringify();
  var outputStream = fileSystem.createWriteStream(__dirname + "/data.json");

  transformStream.pipe(outputStream);

  records.forEach(transformStream.write);

  transformStream.end();
  console.log("json stream", transformStream);
  res.send("done");
});
