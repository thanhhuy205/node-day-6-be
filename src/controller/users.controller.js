const userService = require("../service/user.service");

class UserController {
  async searchUsersByEmail(req, res) {
    const query = req.query.q;
    console.log(query);
    const result = await userService.searchUsersByEmail(query);
    return res.success(result);
  }
}
const usersController = new UserController();
module.exports = usersController;
