const router = require("express").Router();
const {
  createBlog,
  blogsList,
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
// router.get("/blogs", blogsList);

// Update a Single Blog
// router.post("/blogs/:id", requireSignIn, updateBlog);

// Delete a Single Blog
// router.post("/blogs/:id", requireSignIn, deleteBlog);

module.exports = router;
