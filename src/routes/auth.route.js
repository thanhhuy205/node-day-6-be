const express = require("express");
const authController = require("../controller/auth.controller");

const authRouter = express.Router();
const Validator = require("../middlewares/validation");
const authRequire = require("../middlewares/authRequire");
authRouter.post(
  "/register",
  Validator("register"),
  authController.registerController,
);
authRouter.post("/login", Validator("login"), authController.loginController);

authRouter.use(authRequire);
authRouter.post("/logout", authController.logoutController);

module.exports = authRouter;
