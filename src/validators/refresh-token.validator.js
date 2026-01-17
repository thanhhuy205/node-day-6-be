const Joi = require("joi");

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().lowercase().required(),
}).unknown(false);
module.exports = refreshTokenSchema;
