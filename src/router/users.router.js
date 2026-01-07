const express = require("express");
const usersController = require("../controller/users.controller");
const authRequire = require("../middlewares/authRequire");

const userRouter = express.Router();
userRouter.use(authRequire);
userRouter.get("/search", usersController.searchUsersByEmail);

module.exports = userRouter;
