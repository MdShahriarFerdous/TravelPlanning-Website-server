const Blog = require("../../models/blogmodel/blogModel");
const BlogCategory = require("../../models/blogmodel/blogCategoryModel");
const BlogTag = require("../../models/blogmodel/blogModel");

const blogRelationController = {
  // Update Blog Categories List of a Blog
  updateBlogCategoryRelation: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const { blogCategoryId } = req.body;

      const { title } = await BlogCategory.findOne({ _id: blogCategoryId });
      if (!title) {
        return res.json({
          error: "Blog Category Title Not Found",
        });
      }
      await Blog.findOneAndUpdate(
        { _id: blogId },
        { $addToSet: { categories: title } },
        { new: true }
      )
        .then((updatedBlog) => {
          if (updatedBlog) {
            return res.status(200).json({
              status: "Success",
              message: "Blog Categories of a Blog is Updated",
              data: updatedBlog,
            });
          } else {
            return res.json({
              error: "Blog Categories of a Blog can not be Updated",
            });
          }
        })
        .catch((error) => {
          return res.json({
            error,
          });
        });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // delete a Blog Category Relation from a specific Blog
  deleteBlogCategoryRelation: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const { blogCategoryId } = req.body;

      const { title } = await BlogCategory.findOne({ _id: blogCategoryId });
      if (!title) {
        return res.json({
          error: "Blog Category Title Not Found",
        });
      }

      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: blogId, categories: title },
        { $pull: { categories: title } },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        message: "Blog Category Removed from a Blog",
        data: updatedBlog,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = blogRelationController;