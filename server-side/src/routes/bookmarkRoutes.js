const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const { requireSignIn } = require("../middlewares/authMiddlewares");
const router = express.Router();

// add hotel bookmark
router.post(
  "/add-hotel-bookmark/:hotelId",
  requireSignIn,
  bookmarkController.addToHotelBookmark
);

// add tour bookmark
router.post(
  "/add-tour-bookmark/:tourId",
  requireSignIn,
  bookmarkController.addToTourBookmark
);

// get bookmark list
router.get(
  "/get-all-bookmarks",
  requireSignIn,
  bookmarkController.getAllBookmarks
);

// delete hotel bookmark
router.delete(
  "/remove-hotel-bookmark/:hotelId",
  requireSignIn,
  bookmarkController.removeHotelBookmark
);

// delete tour bookmark
router.delete(
  "/remove-tour-bookmark/:tourId",
  requireSignIn,
  bookmarkController.removeTourBookmark
);

module.exports = router;
