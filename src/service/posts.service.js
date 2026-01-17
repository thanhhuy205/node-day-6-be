const postModel = require("../models/post.model");

class PostsService {
  async getPostsByUserId(userId) {
    return postModel.getPostsByUserId(userId);
  }

  async getAllPosts() {
    return postModel.getAllPosts();
  }

  async createPost({ title, content, userId }) {
    return postModel.createPost({ title, content, userId });
  }

  async updatePost({ id, title, content, userId }) {
    return postModel.updatePost({ id, title, content, userId });
  }
}

module.exports = new PostsService();
