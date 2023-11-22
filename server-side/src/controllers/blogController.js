const Blog = require("../models/blogModel");
const BlogCategory = require("../models/blogCategoryModel");

// Blog Create
exports.createBlog = async (req, res, next) => {
  try {
    const { title, details } = req.body;
	const { thumbnailImage, coverImage } = req.files || {};
    const { path: thumbnailImagePath } = thumbnailImage?.[0] || {};
    const { path: coverImagePath } = coverImage?.[0] || {};
    const author = req.user._id;

    // Check if Blog Title exists
	const blogTitle = await Blog.findOne({ title });
    if(blogTitle){
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
        return res.json({ error: "Blog Details must be in between 100 - 255 characters" });
    }

    // if all validation passed
    const blog = await Blog.create({
        author,
        title, 
        details,
        thumbnailImage: thumbnailImagePath,
        coverImage: coverImagePath
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
};

// Blog Category Create
exports.createBlogCategory = async (req, res, next) => {
  try {
    const { title } = req.body;
	
    // Check if Blog Title exists
	const blogCategoryTitle = await BlogCategory.findOne({ title });
    if(blogCategoryTitle){
        return res.json({
            error: "Blog Category Title must be Unique",
        });
    }

    // if all validation passed
    const blogCategory = await BlogCategory.create({title});

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
};


// List All Blogs
exports.blogsList = async (req, res, next) => {
    res.status(200).json({success: true});
};

// Update a blog by Id
exports.updateBlog = async (req, res, next) => {
    res.status(200).json({success: true});
};

// Delete blog by Id
exports.deleteBlog = async (req, res, next) => {
    res.status(200).json({success: true});
};
