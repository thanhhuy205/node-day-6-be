const ApiError = require("../errors/apiError");
const revokedTokenModel = require("../models/revokedToken.model");
const { hashRefreshToken } = require("../services/jwt.service");

const verifyRefresh = async (req, res, next) => {
  try {
    const token = req.body.refresh_token;
    if (!token) throw new ApiError(401, "Unauthorized");
    const hashTk = hashRefreshToken(token);
    const refresh = await revokedTokenModel.findByRefreshToken(hashTk);
    if (refresh.revoke_at || !refresh.expires_at)
      throw new ApiError(401, "Unauthorized");
    if (new Date(refresh.expires_at) < new Date())
      throw new ApiError(401, "Unauthorized");

    req.user = req.user || {};
    req.user.id = refresh.user_id;
    next();
  } catch (error) {
    return res.error(401, String(error));
  }
};

module.exports = verifyRefresh;
