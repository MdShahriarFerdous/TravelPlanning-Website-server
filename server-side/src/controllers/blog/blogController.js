const Blog = require("../../models/blogmodel/blogModel");
const { defaultPageSize } = require("../../../secrets");
const { updateSrc, deleteSrc } = require("../../utilities/updateImage");
const User = require("../../models/usermodel/userModel");
const cloudinary = require("../../helpers/cloudinaryConfig");
const { cloudinaryFolder } = require("../../../secrets");

const blogController = {
  // Create a Single Blog in Draft Mode
  createBlog: async (req, res, next) => {
    try {
      const {
        title,
        details,
        listImage,
        detailsImage,
        galleryListImage,
        isGallery,
      } = req.body;
      const { thumbnailImage, coverImage, galleryImage } = req.files || {};
      const userId = req.user._id;
      const profile = await User.findOne({ _id: userId });

      const author = {
        userId: userId,
        userName: profile.username || "Unknown User",
      };

      // Check if Blog Title exists
      const blogTitle = await Blog.findOne({ title });
      if (blogTitle) {
        return res.json({
          error: "Blog Title must be Unique",
        });
      }

      let thumb = "";
      let cover = "";
      let gallery = "";

      if (isGallery !== "true") {
        // Blog Thumbnail Image Validation
        thumb = listImage;
        if (!thumbnailImage) {
          if (!listImage) {
            return res.json({
              error: "Please Upload a Thumbnail Image or Provide a Link",
            });
          }
        } else {
          if (thumbnailImage.size > 1000000) {
            return res.json({
              error: "Blog Thumbnail should be less than 1 mb in size",
            });
          }
          const { secure_url: thumbnailImagePath } =
            await cloudinary.uploader.upload(thumbnailImage?.[0]?.path, {
              folder: `${cloudinaryFolder}/blog/thumb`,
            });
          thumb = thumbnailImagePath;
        }

        // Blog Cover Image Validation
        cover = detailsImage;
        if (!coverImage) {
          if (!detailsImage) {
            return res.json({
              error: "Please Upload a Cover Image or Provide a Link",
            });
          }
        } else {
          if (coverImage.size > 1000000) {
            return res.json({
              error: "Blog Thumbnail should be less than 1 mb in size",
            });
          }
          const { secure_url: coverImagePath } =
            await cloudinary.uploader.upload(coverImage?.[0]?.path, {
              folder: `${cloudinaryFolder}/blog/cover`,
            });
          cover = coverImagePath;
        }
      }
      if (isGallery === "true") {
        // Blog Gallery Image Validation
        gallery = galleryListImage;
        if (!galleryImage) {
          if (!galleryListImage) {
            return res.json({
              error: "Please Upload a Gallery Image or Provide a Link",
            });
          }
        } else {
          if (galleryImage.size > 1000000) {
            return res.json({
              error: "Blog Thumbnail should be less than 1 mb in size",
            });
          }
          const { secure_url: galleryImagePath } =
            await cloudinary.uploader.upload(galleryImage?.[0]?.path, {
              folder: `${cloudinaryFolder}/blog/gallery`,
            });
          gallery = galleryImagePath;
        }
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
        thumbnailImage: thumb,
        coverImage: cover,
        galleryImage: gallery,
        isGallery: isGallery === "true" ? true : false,
      });

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Please Wait for the Admin to approve your Post",
        data: blog,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // List Blogs (All)
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

      const count = await Blog.countDocuments({ ...keyword, status: true });
      const totalPages = Math.ceil(count / pageSize);

      const blogs = await Blog.find({ ...keyword, status: true })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .select("_id title thumbnailImage author tags details createdAt");

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
  // List Blogs (All)
  blogsListByAdmin: async (req, res, next) => {
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
  // List Blogs (Only featured Ones)
  blogsInHomePage: async (req, res, next) => {
    try {
      const blogs = await Blog.find({ isFeatured: true }).select(
        "_id title thumbnailImage tags  createdAt"
      );
      res.status(200).json({
        blogs,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // List Blogs (Only gallery)
  blogsGallery: async (req, res, next) => {
    try {
      const blogs = await Blog.find({ isGallery: true }).select(
        "_id galleryImage thumbnailImage"
      );
      res.status(200).json({
        blogs,
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
        isFeatured: newIsFeatured,
        isGallery: newIsGallery,
        listImage,
        detailsImage,
      } = req.body;
      const { thumbnailImage: newThumbnailImage, coverImage: newCoverImage } =
        req.files || {};

      // Retrieve Old Blog's Info
      const oldBlogInfo = await Blog.findOne({ _id: blogId });
      if (!oldBlogInfo) {
        return res.json({ error: "Blog Not Found" });
      }
      const {
        author,
        title,
        details,
        thumbnailImage,
        coverImage,
        status,
        isFeatured,
        isGallery,
      } = oldBlogInfo || {};
      const updatedBlogInfo = {};

      // Blog Status validation
      if (newStatus) {
        if (newStatus === "true" && status === false) {
          updatedBlogInfo.status = true;
        }
        if (newStatus === "false" && status === true) {
          updatedBlogInfo.status = false;
        }
      }

      // Blog Featured validation
      if (newIsFeatured) {
        if (newIsFeatured === "true" && isFeatured === false) {
          updatedBlogInfo.isFeatured = true;
        }
        if (newIsFeatured === "false" && isFeatured === true) {
          updatedBlogInfo.isFeatured = false;
        }
      }

      // Blog Gallery validation
      if (newIsGallery) {
        if (newIsGallery === "true" && isGallery === false) {
          updatedBlogInfo.isGallery = true;
        }
        if (newIsGallery === "false" && isGallery === true) {
          updatedBlogInfo.isGallery = false;
        }
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
      } else {
        if (listImage) {
          updatedBlogInfo.thumbnailImage = listImage;
        }
      }

      // Blog Cover Image Validation
      const isUpdatedCover = await updateSrc(
        newCoverImage,
        coverImage,
        10000000
      );
      if (isUpdatedCover.status) {
        updatedBlogInfo.coverImage = isUpdatedCover.path;
      } else {
        if (detailsImage) {
          updatedBlogInfo.coverImage = detailsImage;
        }
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
  // Delete Blog by Id
  deleteBlog: async (req, res, next) => {
    try {
      const { blogId } = req.params;

      // Retrieve Old Blog's Info
      const oldBlogInfo = await Blog.findOne({ _id: blogId });
      if (!oldBlogInfo) {
        return res.json({ error: "Blog Not Found" });
      }
      const { thumbnailImage, coverImage } = oldBlogInfo || {};

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
  // Delete All Blogs
  deleteAllBlogs: async (req, res, next) => {
    try {
      await Blog.deleteMany({});
      res.status(200).json({
        status: "Success",
        message: "All Blogs Deleted",
        data: [],
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = blogController;
