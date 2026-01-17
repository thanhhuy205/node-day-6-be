const verifyRefresh = async (req, res, next) => {
  try {
    req.user = user;
    next();
  } catch (error) {
    return res.error(401, "Unauthorized");
  }
};

module.exports = verifyRefresh;
