const express = require("express");
const authRouter = require("./auth.router");
const conversationRouter = require("./conversations.router");
const userRouter = require("./users.router");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/conversations", conversationRouter);
router.use("/users", userRouter);

module.exports = router;
