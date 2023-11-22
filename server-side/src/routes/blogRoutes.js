const router = require("express").Router();
const {
  createBlog,
  createBlogCategory,
  blogsList,
  blogCategoriesList,
  UserSpecificBlogs,
  updateBlog,
  updateBlogCategory,
  deleteBlog,
  deleteBlogCategory,
  updateBlogCategoryRelation
} = require("../controllers/blogController");
const { requireSignIn } = require("../middlewares/authMiddlewares");
const { Uploads } = require("../middlewares/blogImagesMiddleware");

// Create a Blog
router.post("/blogs", requireSignIn, Uploads, createBlog);

// Create a Blog Category
router.post("/blog-categories", requireSignIn, createBlogCategory);

// View All Blog
router.get("/blogs", blogsList);

// View All Blog Categories
router.get("/blog-categories", blogCategoriesList);

// View Blogs only by user
router.get("/blogs-by-user", requireSignIn, UserSpecificBlogs);

// Update a Single Blog
router.put("/blogs/:blogId", requireSignIn, Uploads, updateBlog);

// Update a Single Blog Category
router.put(
  "/blog-categories/:blogCategoryId",
  requireSignIn,
  updateBlogCategory
);

// Delete a Single Blog
router.delete("/blogs/:blogId", requireSignIn, deleteBlog);

// Delete a Single Blog
router.delete(
  "/blog-categories/:blogCategoryId",
  requireSignIn,
  deleteBlogCategory
);

// Update Blog Category Relation
router.patch("/blogs/:blogId", requireSignIn, updateBlogCategoryRelation);

module.exports = router;
