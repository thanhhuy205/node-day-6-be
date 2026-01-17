const register = require("./register.validator");
const login = require("./login.validator");
const post = require("./post.validation");
const refreshToken = require("./refresh-token.validator");

module.exports = {
  register,
  login,
  post,
  refreshToken,
};
