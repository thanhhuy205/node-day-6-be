const { jwtEnv } = require("../config/jwt");
const ApiError = require("../errors/apiError");
const authModel = require("../models/auth.model");
const revokedTokenModel = require("../models/revokedToken.model");
const jwtService = require("./jwt.service");
const bcrypt = require("bcrypt");
const ms = require("ms");
class AuthService {
  async signFlowAuth(user) {
    const safeUser = { id: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      jwtService.sign(
        { sub: user.id },
        { expiresIn: jwtEnv.ACCESS_TOKEN_TIME },
      ),
      jwtService.signRefreshToken(),
    ]);
    await revokedTokenModel.create(
      user.id,
      jwtService.hashRefreshToken(refresh_token),
      new Date(Date.now() + ms(jwtEnv.REFRESH_TOKEN_TIME)),
    );
    return {
      safeUser,
      access_token,
      refresh_token,
    };
  }

  async revokeHashRefreshToken(userId, refreshToken) {
    const hashTk = jwtService.hashRefreshToken(refreshToken);
    const result = await revokedTokenModel.revokedTokenByUser(userId, hashTk);
    return result;
  }
  async login({ email, password }) {
    const user = await authModel.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }
    const { safeUser, access_token, refresh_token } =
      await this.signFlowAuth(user);

    return {
      user: safeUser,
      token: {
        access_token,
        refresh_token,
      },
    };
  }

  async register({ email, password }) {
    const existed = await authModel.findByEmailWithPassword(email);
    if (existed) {
      throw new ApiError(409, "Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await authModel.createUser({
      email,
      password: hashedPassword,
    });

    const user = await authModel.findById(userId);
    const { safeUser, access_token, refresh_token } =
      await this.signFlowAuth(user);

    return {
      user: safeUser,
      token: {
        access_token,
        refresh_token,
      },
    };
  }

  async logout(userId, refreshToken) {
    const result = this.revokeHashRefreshToken(userId, refreshToken);

    return result;
  }

  async refreshToken(userId, refreshToken) {
    const user = await authModel.findById(userId);
    await this.revokeHashRefreshToken(userId, refreshToken);

    const { access_token, refresh_token } = await this.signFlowAuth(user);
    return {
      access_token,
      refresh_token,
    };
  }
}

module.exports = new AuthService();
