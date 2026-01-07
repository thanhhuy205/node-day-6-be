const ApiError = require("../errors/apiError");
const authModel = require("../models/auth.model");
const jwtService = require("./jwt.service");
const bcrypt = require("bcrypt");

class AuthService {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    return password && password.length >= 6;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, "Sai tài khoản hoặc mật khẩu");
    }

    if (!this.validateEmail(email)) {
      throw new ApiError(400, "Email không hợp lệ");
    }

    const user = await authModel.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }

    const token = await jwtService.sign({ sub: user.id }, { expiresIn: "7d" });

    const safeUser = { id: user.id, email: user.email };

    return {
      user: safeUser,
      token,
    };
  }

  async register({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, "Email và mật khẩu là bắt buộc");
    }

    if (!this.validateEmail(email)) {
      throw new ApiError(400, "Email không hợp lệ");
    }

    if (!this.validatePassword(password)) {
      throw new ApiError(400, "Mật khẩu phải có ít nhất 6 ký tự");
    }

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

    const token = await jwtService.sign({ sub: user.id }, { expiresIn: "7d" });

    return {
      user: { id: user.id, email: user.email },
      token,
    };
  }
}

module.exports = new AuthService();
