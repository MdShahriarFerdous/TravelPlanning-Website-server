const router = require("express").Router();
const {
  createBlog,
  blogsList,
  blogsListByAdmin,
  blogsInHomePage,
  blogsGallery,
  UserSpecificBlogs,
  updateBlog,
  deleteBlog,
  deleteAllBlogs,
} = require("../controllers/blog/blogController");
const {
  createBlogCategory,
  blogCategoriesList,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/blog/blogCategoryController");
const {
  createBlogTag,
  blogTagsList,
  updateBlogTag,
  deleteBlogTag,
} = require("../controllers/blog/blogTagController");
const {
  updateBlogCategoryRelation,
  deleteBlogCategoryRelation,
} = require("../controllers/blog/blogRelationController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewares");
const { Uploads } = require("../middlewares/blogImagesMiddleware");

// Blog Admin Routes
router.get("/admin/blogs", requireSignIn, isAdmin, blogsListByAdmin);

// Blog Routes
router.post("/blogs", requireSignIn, Uploads, createBlog);
router.get("/blogs", blogsList);
router.get("/blogs-home", blogsInHomePage);
router.get("/blogs-gallery", blogsGallery);
router.get("/blogs-by-user", requireSignIn, UserSpecificBlogs);
router.put("/blogs/:blogId", requireSignIn, Uploads, updateBlog);
router.delete("/blogs/:blogId", requireSignIn, deleteBlog);
router.delete("/blogs", requireSignIn, deleteAllBlogs);

// Blog Category Routes
router.post("/blog-categories", requireSignIn, createBlogCategory);
router.get("/blog-categories", blogCategoriesList);
router.put(
  "/blog-categories/:blogCategoryId",
  requireSignIn,
  updateBlogCategory
);
router.delete(
  "/blog-categories/:blogCategoryId",
  requireSignIn,
  deleteBlogCategory
);

// Blog Tag Routes
router.post("/blog-tags", requireSignIn, createBlogTag);
router.get("/blog-tags", blogTagsList);
router.put("/blog-tags/:blogTagId", requireSignIn, updateBlogTag);
router.delete("/blog-tags/:blogTagId", requireSignIn, deleteBlogTag);

// Blog Relations Routes
router.post(
  "/blog-category-relation/:blogId",
  requireSignIn,
  updateBlogCategoryRelation
);
router.delete(
  "/blog-category-relation/:blogId",
  requireSignIn,
  deleteBlogCategoryRelation
);

module.exports = router;
