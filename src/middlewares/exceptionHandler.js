const exceptionHandler = (err, req, res, next) => {
  return res.error(500, String(err.message), err);
};

module.exports = exceptionHandler;
