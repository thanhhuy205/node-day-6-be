const revokeAccessTokenModel = require("../models/refreshAccessToken.model");
const authModel = require("../models/user.model");
const jwtService = require("../services/jwt.service");

const authRequire = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.error(401, "Unauthorized");
    }

    await jwtService.verify(token);
    const decode = jwtService.decode(token);

    if (decode.exp < Math.floor(Date.now() / 1000)) {
      return res.error(401, "Unauthorized");
    }

    const checkTk = await revokeAccessTokenModel.findByAccessToken(token);

    if (checkTk.revoke_at) return res.error(401, "Unauthorized");

    const user = await authModel.findById(decode.sub);
    if (!user) {
      return res.error(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.error(401, "Unauthorized");
  }
};

module.exports = authRequire;
