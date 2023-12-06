const BlogTag = require("../../models/blogmodel/blogTagModel");

const blogTagController = {
  // Create a Blog Tag
  createBlogTag: async (req, res, next) => {
    try {
      const { title } = req.body;

      // Check if Blog Tag Title exists
      const blogTagTitle = await BlogTag.findOne({ title });
      if (blogTagTitle) {
        return res.json({
          error: "Blog Tag Title must be Unique",
        });
      }

      // if all validation passed
      const blogTag = await BlogTag.create({ title });

      // generate response
      res.status(200).json({
        status: "Success",
        message: "A New Blog Tag is created",
        data: blogTag,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // List All Blog Tags
  blogTagsList: async (req, res, next) => {
    try {
      const keyword = {};
      const blogTags = await BlogTag.find({ ...keyword })
      res.status(200).json({
        blogTags
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Update a Blog Tag  by Blog Tag ID
  updateBlogTag: async (req, res, next) => {
    try {
      const { blogTagId } = req.params;
      const { title } = req.body;

      // Check if Blog Tag Title exists
      const blogTagTitle = await BlogTag.findOne({ title });
      if (blogTagTitle) {
        return res.json({
          error: "Blog Tag Title must be Unique",
        });
      }

      const updatedBlogTag = await BlogTag.findByIdAndUpdate(
        blogTagId,
        { title },
        { new: true }
      );

      if (!updatedBlogTag) {
        return res.json({
          error: "Blog Tag Not Updated",
        });
      }

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Blog Tag is Updated",
        data: updatedBlogTag,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Delete Blog Tag by Blog Tag Id
  deleteBlogTag: async (req, res, next) => {
    try {
      const { blogTagId } = req.params;
      await BlogTag.findByIdAndDelete(blogTagId);
      res.status(200).json({
        status: "Success",
        message: "Blog Tag is Deleted Successfully",
        data: {
          deletedBlogTagId: blogTagId,
        },
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = blogTagController;
