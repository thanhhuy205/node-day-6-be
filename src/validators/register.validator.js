const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "confirm_password must match password",
    }),
}).unknown(false);
module.exports = registerSchema;
