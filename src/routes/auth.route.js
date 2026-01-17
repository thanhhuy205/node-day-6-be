const express = require("express");
const authController = require("../controller/auth.controller");

const authRouter = express.Router();
const Validator = require("../middlewares/validation");
const authRequire = require("../middlewares/authRequire");
const verifyRefresh = require("../middlewares/verifyRefresh");
authRouter.post(
  "/register",
  Validator("register"),
  authController.registerController,
);
authRouter.post("/login", Validator("login"), authController.loginController);
authRouter.post(
  "/refresh-token",
  Validator("refreshToken"),
  verifyRefresh,
  authController.refreshTokenController,
);
authRouter.use(authRequire);
authRouter.post(
  "/logout",
  Validator("refreshToken"),
  authController.logoutController,
);

module.exports = authRouter;
