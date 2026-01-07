const authModel = require("../models/auth.model");
const jwtService = require("../service/jwt.service");

const authRequire = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.error(404, "Unauthorized");
  }
  await jwtService.verify(token);

  const decode = jwtService.decode(token);

  if (decode.exp < Math.floor(Date.now() / 1000)) {
    return res.error(404, "Unauthorized");
  }

  const user = await authModel.findById(decode.sub);
  req.user = user;
  next();
};

module.exports = authRequire;
