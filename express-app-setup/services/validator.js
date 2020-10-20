const { body, validationResult } = require("express-validator");

const existingEmail = "pillisreeja@gmail.com"
const userValidationRules = () => {
  return [
    // username must be an email
    body("email").isEmail().normalizeEmail(),

    // password must be at least 5 chars long
    body("password").isLength({ min: 5 }).trim().escape(),

    //check if email already exists
    body("email").custom((value) => {
      if(value===existingEmail){
        console.log('Email already in use')
        return Promise.reject('Email already in use')
      }
      // Indicates the success of this synchronous custom validator
      return true
    }),

    //check if password confirmation and password match
    body('passwordConfirmation').custom((value, { req }) => {
      if(value){
      if (value !== req.body.password) {
        return Promise.reject('Password confirmation does not match password');
      }}
      return true;
    })
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
};
