const pool = require("../config/database");
const ApiError = require("../errors/apiError");

class PostModel {
  async getPostsByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, title, content, created_at, updated_at, user_id
        FROM posts
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async getAllPosts() {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, title, content, created_at, updated_at, user_id
        FROM posts
        ORDER BY created_at DESC
        `
      );
      return rows;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async createPost({ title, content, userId }) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO posts (title, content, user_id)
        VALUES (?, ?, ?)
        `,
        [title, content, userId]
      );
      return result.insertId;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async updatePost({ id, title, content, userId }) {
    try {
      const [result] = await pool.query(
        `
        UPDATE posts
        SET title = ?, content = ?
        WHERE id = ? AND user_id = ?
        `,
        [title, content, id, userId]
      );
      return result.affectedRows;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }
}

module.exports = new PostModel();
