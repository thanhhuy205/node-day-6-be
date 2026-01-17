const pool = require("../config/database");
const ApiError = require("../errors/apiError");

class RevokedTokenModel {
  async create(userId, hashRefreshToken, expires_at) {
    try {
      const [result] = await pool.query(
        `
      INSERT INTO revoked_tokens (refresh_token, user_id, expires_at)
      VALUES (?, ?, ?)
      `,
        [hashRefreshToken, userId, expires_at],
      );

      return {
        id: result.insertId,
        refresh_token: hashRefreshToken,
        user_id: userId,
        expires_at,
      };
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async findByRefreshToken(refreshToken) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, refresh_token, revoke_at, user_id, expires_at
        FROM revoked_tokens
        WHERE refresh_token = ?
        LIMIT 1
        `,
        [refreshToken],
      );
      return rows[0] || null;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async isTokenRevoked(refreshToken) {
    try {
      const [rows] = await pool.query(
        `
        SELECT 1 AS is_revoked
        FROM revoked_tokens
        WHERE refresh_token = ?
        LIMIT 1
        `,
        [refreshToken],
      );
      return rows.length > 0;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }
  async revokedTokenByUser(userId, refreshToken) {
    try {
      const [rows] = await pool.query(
        `
        UPDATE revoked_tokens
        SET revoke_at = NOW()
        WHERE  user_id = ?  AND refresh_token = ? 
        LIMIT 1
        `,
        [userId, refreshToken],
      );
      return rows.length > 0;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, refresh_token, revoke_at, user_id
        FROM revoked_tokens
        WHERE user_id = ?
        ORDER BY revoke_at DESC
        `,
        [userId],
      );
      return rows;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }
}
const revokedTokenModel = new RevokedTokenModel();
module.exports = revokedTokenModel;
