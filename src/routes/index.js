const express = require("express");
const authRouter = require("./auth.route");
const conversationRouter = require("./conversations.route");
const userRouter = require("./users.route");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/conversations", conversationRouter);
router.use("/users", userRouter);

module.exports = router;
