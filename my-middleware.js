module.exports = function (options) {
  if (options.option2) {
    return function (req, res, next) {
      console.log("Option 1");
      next();
    };
  } else if (options.option2) {
    return function (req, res, next) {
      console.log("Option 2");
      next();
    };
  }
};
