const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.ACCESS_TOKEN_TIME);
const jwtEnv = {
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME,
};

module.exports = { jwtEnv };
