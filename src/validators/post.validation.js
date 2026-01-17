const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().required(),
}).unknown(false);

module.exports = postSchema;
