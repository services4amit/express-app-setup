module.exports = (fn) => {
  return (req, res, next) => {
    try {
      console.log("inside 55");
      fn(req, res, next);

      next();
    } catch (e) {
      // console.log("inside 57",e);
      throw e;
    }
  };
};
