const authService = require("../service/auth.service");

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
  async logoutController(req, res) {}
}
const authController = new AuthController();
module.exports = authController;
