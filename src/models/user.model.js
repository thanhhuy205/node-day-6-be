const pool = require("../config/database");
const ApiError = require("../errors/apiError");

class UserModel {
  async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, email
        FROM users
        WHERE email LIKE CONCAT('%', ?, '%')
        `,
        [email]
      );
      return rows || [];
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }
}
const userModel = new UserModel();
module.exports = userModel;
