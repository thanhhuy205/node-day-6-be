const authService = require("../services/auth.service");

class AuthController {
  async registerController(req, res) {
    const { email, password } = req.body;
    const result = await authService.register({ email, password });
    return res.success(
      { user: result.user },
      {
        ...result.token,
      },
    );
  }

  async loginController(req, res) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return res.success(
      { user: result.user },
      {
        ...result.token,
      },
    );
  }
  async logoutController(req, res) {
    const userId = req.user.id;
    const refreshToken = req.body.refresh_token;
    const accessToken = req?.headers?.authorization?.split(" ")[1];

    await authService.logout(userId, refreshToken, accessToken);
    return res.success(null, { message: "Đăng xuất thành công" });
  }
  async refreshTokenController(req, res) {
    const userId = req.user.id;
    const refreshToken = req.body.refresh_token;
    const result = await authService.refreshToken(userId, refreshToken);
    return res.success({ result });
  }
}
const authController = new AuthController();
module.exports = authController;
