const userModel = require("../models/user.model");

class UserService {
  async searchUsersByEmail(email) {
    const result = await userModel.findByEmail(email);
    return result;
  }
}
const userService = new UserService();
module.exports = userService;
