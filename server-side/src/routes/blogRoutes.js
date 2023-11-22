const router = require("express").Router();
const {
  createBlog,
  blogsList,
  UserSpecificBlogs,
  updateBlog,
  deleteBlog,
  createBlogCategory,
} = require("../controllers/blogController");
const { requireSignIn } = require("../middlewares/authMiddlewares");
const { Uploads } = require("../middlewares/blogImagesMiddleware");

// Create a Blog
router.post(
  "/blogs",
  requireSignIn,
  Uploads,
  createBlog
);

// Create a Blog Category
router.post("/blog-category", requireSignIn, createBlogCategory);

// View All Blog
router.get("/blogs", blogsList);

// View Blogs only by user
router.get("/blogs-by-user", requireSignIn, UserSpecificBlogs);

// Update a Single Blog
router.put(
  "/blogs/:blogId",
  requireSignIn,
  Uploads,
  updateBlog
);

// Delete a Single Blog
router.delete("/blogs/:blogId", requireSignIn, deleteBlog);

module.exports = router;
