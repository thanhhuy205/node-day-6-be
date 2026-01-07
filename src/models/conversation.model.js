const pool = require("../config/database");

class ConversationModel {
  async createConversation({ name, type, created_by }) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO conversations (name, type, created_by)
        VALUES (?, ?, ?)
        `,
        [type === "direct" ? String(Date.now()) : name, type, created_by]
      );

      return result.insertId || null;
    } catch {
      return null;
    }
  }

  async findConversationById(conversation_id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT *
        FROM conversations
        WHERE id = ?
        `,
        [conversation_id]
      );

      return rows[0] || null;
    } catch {
      return null;
    }
  }

  async findConversationsByUserId(user_id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT 
          c.id AS conversation_id,
          c.name,
          c.type,
          c.created_by,
          c.created_at,
          u.id AS user_id,
          u.email
        FROM conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id
        JOIN users u ON u.id = cp.user_id
        WHERE c.created_by = ?
        ORDER BY c.created_at DESC
    `,
        [user_id]
      );

      return rows || [];
    } catch {
      return [];
    }
  }

  async addParticipant({ conversation_id, user_id }) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (?, ?)
        `,
        [conversation_id, user_id]
      );
      return result.insertId || null;
    } catch (error) {
      return null;
    }
  }

  async isParticipant({ conversation_id, user_id }) {
    try {
      const [rows] = await pool.query(
        `
        SELECT 1
        FROM conversation_participants
        WHERE conversation_id = ? AND user_id = ?
        LIMIT 1
        `,
        [conversation_id, user_id]
      );

      return rows.length > 0;
    } catch {
      return false;
    }
  }

  async getParticipants(conversation_id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT u.id, u.email
        FROM conversation_participants cp
        JOIN users u ON u.id = cp.user_id
        WHERE cp.conversation_id = ?
        `,
        [conversation_id]
      );

      return rows || [];
    } catch {
      return [];
    }
  }

  async createMessage({ conversation_id, sender_id, content }) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO messages (conversation_id, sender_id, content)
        VALUES (?, ?, ?)
        `,
        [conversation_id, sender_id, content]
      );

      return result.insertId || null;
    } catch {
      return null;
    }
  }

  async getMessagesByConversationId(conversation_id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, conversation_id, sender_id, content, created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        `,
        [conversation_id]
      );

      return rows || [];
    } catch {
      return [];
    }
  }

  async getMessagesWithSenderByConversationId(conversation_id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT 
          m.id,
          m.conversation_id,
          m.sender_id,
          m.content,
          m.created_at
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
        `,
        [conversation_id]
      );

      return rows || [];
    } catch {
      return [];
    }
  }
}
const conversationModel = new ConversationModel();
module.exports = conversationModel;
