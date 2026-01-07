const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

class JwtService {
  constructor() {
    this.secret = process.env.ACCESS_TOKEN_KEY;
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

  decode(token, options) {
    return jwt.decode(token, options || {});
  }
}

module.exports = new JwtService();
