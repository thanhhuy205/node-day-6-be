const { jwtEnv } = require("../config/jwt");
const ApiError = require("../errors/apiError");
const authModel = require("../models/auth.model");
const jwtService = require("./jwt.service");
const bcrypt = require("bcrypt");

class AuthService {
  async login({ email, password }) {
    const user = await authModel.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }

    const safeUser = { id: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      jwtService.sign(
        { sub: user.id },
        { expiresIn: jwtEnv.ACCESS_TOKEN_TIME },
      ),
      jwtService.signRefreshToken(),
    ]);
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

    const safeUser = { id: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      jwtService.sign(
        { sub: user.id },
        { expiresIn: jwtEnv.ACCESS_TOKEN_TIME },
      ),
      jwtService.signRefreshToken(),
    ]);

    return {
      user: safeUser,
      token: {
        access_token,
        refresh_token,
      },
    };
  }
}

module.exports = new AuthService();
