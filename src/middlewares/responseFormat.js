const responseFormat = (req, res, next) => {
  res.success = (data, prop = {}, status = 200) => {
    return res.status(status).json({
      status: "success",
      data,
      ...prop,
    });
  };
  res.pagination = ({ rows, pagination }) => {
    return res.success(rows, { pagination });
  };
  res.error = (status, message, error) => {
    return res.status(error?.status ?? status).json({
      status: "error",
      ...(error?.status ? {} : error),
      message,
    });
  };
  next();
};

module.exports = responseFormat;
