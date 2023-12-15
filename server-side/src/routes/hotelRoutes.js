const router = require("express").Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewares");
const { upload } = require("../middlewares/singleImageMiddleware");
const {
  read,
  list,
  create,
  update,
  delete: deleteByID,
  deleteAll,
} = require("../controllers/hotel/hotelController");
const {
  create: createRoomCategory,
  list: roomCategoriesList,
} = require("../controllers/hotel/roomCategoryController");

// Routes for hotels
router.get("/hotels/:hotelId", read);
router.get("/hotels", list);
router.post(
  "/hotels",
  requireSignIn,
  isAdmin,
  upload("thumbnail", "hotels"),
  create
);
router.put(
  "/hotels/:hotelId",
  requireSignIn,
  isAdmin,
  upload("thumbnail", "hotels"),
  update
);
router.delete("/hotels/:hotelId", requireSignIn, isAdmin, deleteByID);
router.delete("/hotels-all", requireSignIn, isAdmin, deleteAll);

// Routes for Hotel Room Category
router.get("/roomCategories", roomCategoriesList);
router.post(
  "/roomCategories",
  requireSignIn,
  isAdmin,
  upload("thumbnail", "roomCategory"),
  createRoomCategory
);

module.exports = router;
