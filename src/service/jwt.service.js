const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { jwtEnv } = require("../config/jwt");
const crypto = require("crypto");
config();

class JwtService {
  constructor() {
    this.secret = jwtEnv.ACCESS_TOKEN_KEY;
  }

  sign(payload, options) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, options || {}, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  }

  verify(token, options) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, options || {}, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }

  signRefreshToken() {
    const token = crypto.randomUUID();
    return crypto
      .createHmac("sha256", jwtEnv.REFRESH_TOKEN_SECRET)
      .update(token)
      .digest("hex");
  }

  hashRefreshToken(token) {
    return crypto
      .createHmac("sha256", jwtEnv.REFRESH_TOKEN_SECRET)
      .update(token)
      .digest("hex");
  }

  decode(token, options) {
    return jwt.decode(token, options || {});
  }
}

module.exports = new JwtService();
