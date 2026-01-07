const express = require("express");
const conversationController = require("../controller/conversation.controller");

const conversationRouter = express.Router();

conversationRouter.post("/", conversationController.createConversation);
conversationRouter.get("/", conversationController.getConversations);
conversationRouter.post(
  "/:id/participants",
  conversationController.addParticipant
);
conversationRouter.post("/:id/messages", conversationController.sendMessage);
conversationRouter.get("/:id/messages", conversationController.getMessages);

module.exports = conversationRouter;
