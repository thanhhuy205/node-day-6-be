const notFoundHandler = (req, res) => {
  return res.error(404, "Resource not found", {});
};

module.exports = notFoundHandler;
