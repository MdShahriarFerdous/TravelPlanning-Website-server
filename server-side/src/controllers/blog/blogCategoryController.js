const BlogCategory = require("../../models/blogmodel/blogCategoryModel");

const blogCategoryController = {
  // Create a Blog Category
  createBlogCategory: async (req, res, next) => {
    try {
      const { title } = req.body;

      // Check if Blog Title exists
      const blogCategoryTitle = await BlogCategory.findOne({ title });
      if (blogCategoryTitle) {
        return res.json({
          error: "Blog Category Title must be Unique",
        });
      }

      // if all validation passed
      const blogCategory = await BlogCategory.create({ title });

      // generate response
      res.status(200).json({
        status: "Success",
        message: "A New Blog Category is created",
        data: blogCategory,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // List All Blog Categories
  blogCategoriesList: async (req, res, next) => {
    try {
      const pageSize = Number(20); // Number of items per page
      const page = Number(req.query.pageNumber) || 1;

      const keyword = req.query.keyword
        ? {
            $or: [{ title: { $regex: req.query.keyword, $options: "i" } }],
          }
        : {};

      const count = await BlogCategory.countDocuments({ ...keyword });
      const totalPages = Math.ceil(count / pageSize);

      const blogCategories = await BlogCategory.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      res.status(200).json({
        blogCategories,
        page,
        totalPages,
        count,
        itemsPerPage: pageSize,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Update a Blog Category by Blog Category Id
  updateBlogCategory: async (req, res, next) => {
    try {
      const { blogCategoryId } = req.params;
      const { title } = req.body;

      // Check if Blog Category Title exists
      const blogCategoryTitle = await BlogCategory.findOne({ title });
      if (blogCategoryTitle) {
        return res.json({
          error: "Blog Category Title must be Unique",
        });
      }

      const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
        blogCategoryId,
        { title },
        { new: true }
      );

      if (!updatedBlogCategory) {
        return res.json({
          error: "Blog Category Not Updated",
        });
      }

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Blog Category is Updated",
        data: updatedBlogCategory,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Delete Blog Category by Blog Category Id
  deleteBlogCategory: async (req, res, next) => {
    try {
      const { blogCategoryId } = req.params;
      await BlogCategory.findByIdAndDelete(blogCategoryId);
      res.status(200).json({
        status: "Success",
        message: "Blog Category is Deleted Successfully",
        data: {
          deletedBlogCategoryId: blogCategoryId,
        },
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = blogCategoryController;
