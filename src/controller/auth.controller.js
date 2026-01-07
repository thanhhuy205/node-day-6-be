const authService = require("../service/auth.service");

class AuthController {
  async registerController(req, res) {
    const { email, password } = req.body;
    const result = await authService.register({ email, password });
    console.log(result);

    return res.success(
      { user: result.user },
      {
        accessToken: result.token,
        expiresIn: 7 * 24 * 60 * 60,
      }
    );
  }

  async loginController(req, res) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return res.success(
      { user: result.user },
      {
        accessToken: result.token,
        expiresIn: 7 * 24 * 60 * 60,
      }
    );
  }
}
const authController = new AuthController();
module.exports = authController;
