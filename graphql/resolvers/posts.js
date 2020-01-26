const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          console.log('Post not found');
          throw new Error(
            'Post not found: this throw new Error did not work here'
          );
        } else {
          return post;
        }
      } catch (err) {
        // throw new Error(err);
        throw new Error('Post not found');
      }
    }
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      console.log(user);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          console.log('Post deleted successfully');
          return 'Post deleted successfully';
        } else {
          console.log('error while deleting');
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        console.log('error while deleting catch phase');
        throw new Error(err);
      }
    },

    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // post already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    }

    // deletePost: async (_, { postId }, context) => {
    //   const user = checkAuth(context);

    //   errors = {};

    //   try {
    //     const post = await Post.findById(postId);

    //     // if (!post) {
    //     //   errors.post = 'Post not found';
    //     //   throw new UserInputError('Post not Found', {
    //     //     errors
    //     //   });
    //     // }

    //     if (user && user.username === post.username) {
    //       await post.delete();
    //       return 'Post deleted successfully';
    //     } else throw new AuthenticationError('Action not allowed');
    //   } catch (err) {
    //     console.log('Error deleting post');

    //     throw new Error(err);
    //   }
    // }
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
};
