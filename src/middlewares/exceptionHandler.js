const ApiError = require("../errors/apiError");

const exceptionHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.error(err.status, err.message);
  }
  return res.error(500, String(err));
};

module.exports = exceptionHandler;
