const pool = require("../config/database");
const ApiError = require("../errors/apiError");

class RevokeAccessTokenModel {
  async create(userId, accessToken, revokeAt) {
    try {
      const [result] = await pool.query(
        `
      INSERT INTO revoked_access_tokens (access_token, user_id, revoke_at)
      VALUES (?, ?, ?)
      `,
        [accessToken, userId, revokeAt],
      );

      return {
        id: result.insertId,
        access_token: accessToken,
        user_id: userId,
        revoke_at: revokeAt,
      };
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async findByAccessToken(accessToken) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, access_token, revoke_at, user_id
        FROM revoked_access_tokens
        WHERE access_token = ?
        LIMIT 1
        `,
        [accessToken],
      );
      return rows[0] || null;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async isTokenRevoked(accessToken) {
    try {
      const [rows] = await pool.query(
        `
        SELECT 1 AS is_revoked
        FROM revoked_access_tokens
        WHERE access_token = ?
        LIMIT 1
        `,
        [accessToken],
      );
      return rows.length > 0;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async revokedTokenByUser(userId, accessToken) {
    try {
      const [rows] = await pool.query(
        `
        UPDATE revoked_access_tokens
        SET revoke_at = NOW()
        WHERE  user_id = ?  AND access_token = ?
        LIMIT 1
        `,
        [userId, accessToken],
      );
      return rows.length > 0;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async revokedTokenAllByUser(userId) {
    try {
      const [rows] = await pool.query(
        `
        UPDATE revoked_access_tokens
        SET revoke_at = NOW()
        WHERE  user_id = ?
        `,
        [userId],
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
        SELECT id, access_token, revoke_at, user_id
        FROM revoked_access_tokens
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

const revokeAccessTokenModel = new RevokeAccessTokenModel();
module.exports = revokeAccessTokenModel;
