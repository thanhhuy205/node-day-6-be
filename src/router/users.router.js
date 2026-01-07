const express = require("express");
const usersController = require("../controller/users.controller");

const userRouter = express.Router();

userRouter.get("/search", usersController.searchUsersByEmail);

module.exports = userRouter;
