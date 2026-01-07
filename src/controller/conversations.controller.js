const ConversationService = require("../service/conversation.service");
const conversationService = new ConversationService();

class ConversationController {
  async createConversation(req, res) {
    const currentUserId = req.user.id;
    const data = await conversationService.createConversation({
      name: req.body.name,
      type: req.body.type,
      participant_ids: req.body.participant_ids,
      current_user_id: currentUserId,
    });

    return res.success(data, {}, 201);
  }

  async getConversations(req, res) {
    const current_user_id = req.user.id;

    const data = await conversationService.getConversations(current_user_id);

    return res.success(data);
  }

  async addParticipant(req, res) {
    const conversation_id = req.params.id;
    const user_id = req.body?.user_id;

    const data = await conversationService.addParticipant({
      conversation_id,
      user_id,
    });

    return res.success(undefined, { message: "Thêm thành công" }, 201);
  }

  async sendMessage(req, res) {
    const conversation_id = req.params.id;
    const content = req.body?.content;
    const current_user_id = req.user.id;

    const data = await conversationService.sendMessage({
      conversation_id,
      content,
      current_user_id,
    });

    return res.success(data, {}, 201);
  }

  async getMessages(req, res) {
    const conversation_id = req.params.id;
    const current_user_id = req.user.id;

    const data = await conversationService.getMessages({
      conversation_id,
      current_user_id,
    });

    return res.success(data, {}, 200);
  }
}

module.exports = new ConversationController();
