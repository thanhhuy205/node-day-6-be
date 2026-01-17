const express = require("express");
const postController = require("../controller/post.controller");
const Validator = require("../middlewares/validation");
const authRequire = require("../middlewares/authRequire");

const postRouter = express.Router();

postRouter.use(authRequire);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/me", postController.getPostsByUser);
postRouter.post("/", Validator("post"), postController.createPost);
postRouter.put("/:id", Validator("post"), postController.updatePost);

module.exports = postRouter;
