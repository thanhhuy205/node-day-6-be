const pool = require("../config/database");

class UserModel {
  async findByEmailWithPassword(email) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, email, password
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
      );
      return rows[0] || null;
    } catch {
      return null;
    }
  }

  async createUser({ email, password }) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO users (email, password)
        VALUES (?, ?)
        `,
        [email, password]
      );

      return result.insertId;
    } catch {
      return null;
    }
  }

  async findById(id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      return null;
    }
  }
}
const authModel = new UserModel();
module.exports = authModel;
