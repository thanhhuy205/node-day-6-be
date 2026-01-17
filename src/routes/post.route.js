const express = require("express");
const postController = require("../controllers/post.controller");
const Validator = require("../middlewares/validation");
const authRequire = require("../middlewares/authRequired");

const postRouter = express.Router();
postRouter.get("/", postController.getAllPosts);

postRouter.use(authRequire);
postRouter.get("/me", postController.getPostsByUser);
postRouter.post("/", Validator("post"), postController.createPost);
postRouter.put("/:id", Validator("post"), postController.updatePost);

module.exports = postRouter;
