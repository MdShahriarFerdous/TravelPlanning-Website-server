const Blog = require("../../models/blogmodel/blogModel");
const BlogCategory = require("../../models/blogmodel/blogCategoryModel");
const BlogTag = require("../../models/blogmodel/blogTagModel");

const blogRelationController = {
  // Update Blog Categories List of a Blog
  updateBlogCategoryRelation: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const { blogCategoryId } = req.body;

      // Check if the new category exists
      const categoryExists = await BlogCategory.exists({ _id: blogCategoryId });
      if (!categoryExists) {
        return res.json({
          error: "Blog Category Not Found",
        });
      }

      // Find the blog by ID and update the category
      await Blog.findByIdAndUpdate(
        blogId,
        { $set: { category: blogCategoryId } },
        { new: true }
      )
        .then((updatedBlog) => {
          if (updatedBlog) {
            return res.status(200).json({
              status: "Success",
              message: "Blog Category is Updated",
              data: updatedBlog,
            });
          } else {
            return res.json({
              error: "Blog Category can not be Updated",
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

      const foundCategory = await BlogCategory.findOne({ _id: blogCategoryId });
      if (!foundCategory) {
        return res.json({
          error: "Blog Category Not Found",
        });
      }

      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: blogId, categories: foundCategory.title },
        { $pull: { categories: foundCategory.title } },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        message: "Category Removed from a Blog",
        data: updatedBlog,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Update Blog Tags List of a Blog
  updateBlogTagRelation: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const { blogTagId } = req.body;

      const foundTag = await BlogTag.findOne({ _id: blogTagId });
      if (!foundTag) {
        return res.json({
          error: "Blog Tag Not Found",
        });
      }
      await Blog.findOneAndUpdate(
        { _id: blogId },
        { $addToSet: { tags: foundTag.title } },
        { new: true }
      )
        .then((updatedTag) => {
          if (updatedTag) {
            return res.status(200).json({
              status: "Success",
              message: "Tags of a Blog is Updated",
              data: updatedTag,
            });
          } else {
            return res.json({
              error: "Tag of a Blog can not be Updated",
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
  // delete a Blog Tag Relation from a specific Blog
  deleteBlogTagRelation: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const { blogTagId } = req.body;

      const foundTag = await BlogTag.findOne({ _id: blogTagId });
      if (!foundTag) {
        return res.json({
          error: "Blog Tag Not Found",
        });
      }

      const updatedTag = await Blog.findOneAndUpdate(
        { _id: blogId, tags: foundTag.title },
        { $pull: { tags: foundTag.title } },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        message: "Tag Removed from a Blog",
        data: updatedTag,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = blogRelationController;
