const authMiddleware = require("./auth.middleware");
const signupMiddleware = require("./verifySignup.middleware");

module.exports = {
  authMiddleware,
  signupMiddleware,
};
