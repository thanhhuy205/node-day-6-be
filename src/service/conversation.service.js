const ApiError = require("../errors/apiError");
const authModel = require("../models/auth.model");
const conversationModel = require("../models/conversation.model");

class ConversationService {
  async createConversation({ name, type, participant_ids, current_user_id }) {
    if (!type || !["group", "direct"].includes(type)) {
      throw new ApiError(400, "type không hợp lệ");
    }

    if (type === "group" && !name) {
      throw new ApiError(400, "group chat cần name");
    }

    if (!Array.isArray(participant_ids)) {
      throw new ApiError(400, "participant_ids phải là mảng");
    }
    const uniqueParticipants = Array.from(
      new Set([current_user_id, ...participant_ids])
    );
    console.log(uniqueParticipants);
    const conversation_id = await conversationModel.createConversation({
      name,
      type,
      created_by: current_user_id,
    });

    if (!conversation_id) {
      throw new ApiError(500, "Tạo conversation thất bại");
    }

    for (const user_id of uniqueParticipants) {
      await conversationModel.addParticipant({
        conversation_id,
        user_id,
      });
    }

    return {
      conversation_id,
    };
  }

  async getConversations(current_user_id) {
    const result = await conversationModel.findConversationsByUserId(
      current_user_id
    );

    return result;
  }

  async addParticipant(payload) {
    const user = await authModel.findById(payload.user_id);
    if (!user) throw new ApiError(404, "Người dùng không tồn tại");

    const cov = await conversationModel.findConversationById(
      payload.conversation_id
    );
    if (!cov) throw new ApiError(404, "Hội thoại không tồn tại");

    const isPt = await conversationModel.isParticipant({
      conversation_id: payload.conversation_id,
      user_id: payload.user_id,
    });
    if (isPt) throw new ApiError(404, "Đã tham gia vào hội thoại");

    const result = await conversationModel.addParticipant({
      conversation_id: payload.conversation_id,
      user_id: payload.user_id,
    });

    return result;
  }

  async sendMessage({ conversation_id, content, current_user_id }) {
    if (!content) throw new ApiError(400, "content không được để trống");

    const cov = await conversationModel.findConversationById(conversation_id);
    if (!cov) throw new ApiError(404, "Hội thoại không tồn tại");

    const message_id = await conversationModel.createMessage({
      conversation_id,
      sender_id: current_user_id,
      content,
    });

    if (!message_id) throw new ApiError(500, "Gửi tin nhắn thất bại");

    return { message_id };
  }

  async getMessages({ conversation_id, current_user_id }) {
    const cov = await conversationModel.findConversationById(conversation_id);
    if (!cov) throw new ApiError(404, "Hội thoại không tồn tại");

    const isPt = await conversationModel.isParticipant({
      conversation_id,
      user_id: current_user_id,
    });
    if (!isPt) throw new ApiError(403, "Bạn không thuộc hội thoại này");

    const messages =
      await conversationModel.getMessagesWithSenderByConversationId(
        conversation_id
      );

    return messages;
  }
}

module.exports = ConversationService;
