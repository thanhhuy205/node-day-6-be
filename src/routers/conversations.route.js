const express = require("express");
const conversationsController = require("../controller/conversations.controller");
const authRequire = require("../middlewares/authRequire");

const conversationRouter = express.Router();
conversationRouter.use(authRequire);
conversationRouter.post("/", conversationsController.createConversation);
conversationRouter.get("/", conversationsController.getConversations);
conversationRouter.post(
  "/:id/participants",
  conversationsController.addParticipant
);
conversationRouter.post("/:id/messages", conversationsController.sendMessage);
conversationRouter.get("/:id/messages", conversationsController.getMessages);

module.exports = conversationRouter;
