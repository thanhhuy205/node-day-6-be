const postsService = require("../services/posts.service");

class PostController {
  async getPostsByUser(req, res) {
    const posts = await postsService.getPostsByUserId(req.user.id);
    return res.success({ posts });
  }

  async getAllPosts(req, res) {
    const posts = await postsService.getAllPosts();
    return res.success({ posts });
  }

  async createPost(req, res) {
    const { title, content } = req.body;
    const postId = await postsService.createPost({
      title,
      content,
      userId: req.user.id,
    });
    return res.success({ postId }, {}, 201);
  }

  async updatePost(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;
    await postsService.updatePost({
      id,
      title,
      content,
      userId: req.user.id,
    });
    return res.success({ id });
  }
}

module.exports = new PostController();
