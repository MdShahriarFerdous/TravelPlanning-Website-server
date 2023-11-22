const Blog = require("../models/blogModel");
const BlogCategory = require("../models/blogCategoryModel");
const { defaultPageSize } = require("../../secrets");
const { updateSrc, deleteSrc } = require("../utilities/updateImage");

const blogController = {
  // Create a Single Blog in Draft Mode
  createBlog: async (req, res, next) => {
    try {
      const { title, details } = req.body;
      const { thumbnailImage, coverImage } = req.files || {};
      const { path: thumbnailImagePath } = thumbnailImage?.[0] || {};
      const { path: coverImagePath } = coverImage?.[0] || {};
      const author = req.user._id;

      // Check if Blog Title exists
      const blogTitle = await Blog.findOne({ title });
      if (blogTitle) {
        return res.json({
          error: "Blog Title must be Unique",
        });
      }

      // Check if Blog Thumbnail is less than 1 mb
      if (thumbnailImage && thumbnailImage.size > 1000000) {
        return res.json({
          error: "Blog Thumbnail should be less than 1 mb in size",
        });
      }

      // Check if Blog Cover Image is less than 10 mb
      if (coverImage && coverImage.size > 10000000) {
        return res.json({
          error: "Blog Cover Image should be less than 10 mb in size",
        });
      }

      // Check if blog details is between 100 - 255 characters
      if (details && (details.length > 255 || details.length < 100)) {
        return res.json({
          error: "Blog Details must be in between 100 - 255 characters",
        });
      }

      // if all validation passed
      const blog = await Blog.create({
        author,
        title,
        details,
        thumbnailImage: thumbnailImagePath,
        coverImage: coverImagePath,
      });

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Please Wait for the Admin to approve your Blog",
        data: blog,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
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
  // List All Blogs
  blogsList: async (req, res, next) => {
    try {
      const pageSize = Number(defaultPageSize); // Number of items per page
      const page = Number(req.query.pageNumber) || 1;

      const keyword = req.query.keyword
        ? {
            $or: [
              { title: { $regex: req.query.keyword, $options: "i" } },
              { details: { $regex: req.query.keyword, $options: "i" } },
            ],
          }
        : {};

      const count = await Blog.countDocuments({ ...keyword });
      const totalPages = Math.ceil(count / pageSize);

      const blogs = await Blog.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      res.status(200).json({
        blogs,
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
  // User Specific Blogs List
  UserSpecificBlogs: async (req, res, next) => {
    try {
      const pageSize = Number(defaultPageSize); // Number of items per page
      const page = Number(req.query.pageNumber) || 1;
      const author = req.user._id;

      const keyword = req.query.keyword
        ? {
            $or: [
              { title: { $regex: req.query.keyword, $options: "i" } },
              { details: { $regex: req.query.keyword, $options: "i" } },
            ],
          }
        : {};

      const count = await Blog.countDocuments({ author, ...keyword });
      const totalPages = Math.ceil(count / pageSize);

      const blogs = await Blog.find({ author, ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      res.status(200).json({
        blogs,
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
  // Update a Blog by Id
  updateBlog: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const {
        title: newTitle,
        details: newDetails,
        status: newStatus,
      } = req.body;
      const { thumbnailImage: newThumbnailImage, coverImage: newCoverImage } =
        req.files || {};
      const updatedBy = req.user._id;

      // Retrieve Old Blog's Info
      const oldBlogInfo = await Blog.findOne({ _id: blogId });
      if (!oldBlogInfo) {
        return res.json({ error: "Blog Not Found" });
      }
      const { author, title, details, thumbnailImage, coverImage, status } =
        oldBlogInfo || {};
      const updatedBlogInfo = {};

      // Blog author update should be by author only
      if (author.toString() !== updatedBy) {
        return res.json({ error: "You are not authorize to update the Blog" });
      }

      // Blog Status validation
      if (newStatus && newStatus !== status) {
        updatedBlogInfo.status = newStatus;
      }

      // Blog Title validation
      const isBlogTitleExist = await Blog.findOne({ title: newTitle });
      if (isBlogTitleExist) {
        return res.json({
          error: "Blog Title must be Unique",
        });
      }
      if (newTitle && newTitle !== title) {
        updatedBlogInfo.title = newTitle;
      }

      // Blog Details validation
      if (details && (details.length > 255 || details.length < 100)) {
        return res.json({
          error: "Blog Details must be in between 100 - 255 characters",
        });
      }
      if (newDetails && newDetails !== details) {
        updatedBlogInfo.details = newDetails;
      }

      // Blog Thumbnail Image Validation
      const isUpdatedThumbnail = await updateSrc(
        newThumbnailImage,
        thumbnailImage,
        1000000
      );
      if (isUpdatedThumbnail.status) {
        updatedBlogInfo.thumbnailImage = isUpdatedThumbnail.path;
      }

      // Blog Cover Image Validation
      const isUpdatedCover = await updateSrc(
        newCoverImage,
        coverImage,
        10000000
      );
      if (isUpdatedCover.status) {
        updatedBlogInfo.coverImage = isUpdatedCover.path;
      }
      // No Chnages made to Update Blog
      if (Object.keys(updatedBlogInfo).length === 0) {
        return res.json({
          error: "No Changes have been made for this blog",
        });
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        updatedBlogInfo,
        { new: true }
      );
      // generate response
      res.status(200).json({
        status: "Success",
        message: "Blog is Updated",
        data: updatedBlog,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Update a Blog Category by Id
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
  // Delete Blog by Id
  deleteBlog: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const deletedBy = req.user._id;

      // Retrieve Old Blog's Info
      const oldBlogInfo = await Blog.findOne({ _id: blogId });
      if (!oldBlogInfo) {
        return res.json({ error: "Blog Not Found" });
      }
      const { author, thumbnailImage, coverImage } = oldBlogInfo || {};

      // Blog author delete should be by author only
      if (author.toString() !== deletedBy) {
        return res.json({ error: "You are not authorize to Delete the Blog" });
      }

      // Deleting the Images from the Location
      await deleteSrc(thumbnailImage);
      await deleteSrc(coverImage);
      await Blog.findByIdAndDelete(blogId);
      res.status(200).json({
        status: "Success",
        message: "Blog is Deleted Successfully",
        data: {
          deletedBlogId: blogId,
        },
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Delete Blog Category by Id
  deleteBlogCategory: async (req, res, next) => {
    try {
      const { blogCategoryId } = req.params;

      // Deleting the Images from the Location
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
  // Update Blog Categories List of a Blog
  updateBlogCategoryRelation: async (req, res, next) => {
    try {
      const { blogId } = req.params;
      const { blogCategoryId } = req.body;

      const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        $addToSet: { categories: blogCategoryId },
      });

      res.status(200).json({
        status: "Success",
        message: "Blog Categories of a Blog is Updated",
        data: updatedBlog,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = blogController;
