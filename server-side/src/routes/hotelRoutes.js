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
  deleteAll: deleteAllRoomCategories,
} = require("../controllers/hotel/roomCategoryController");
const {
  create: createRoomSubCategory,
  update: updateRoomSubCategory,
} = require("../controllers/hotel/roomSubCategoryController");
const {
  list: hotelInfoList,
  create: createHotelInfo,
  updateByHotelId,
  readByHotelId,
} = require("../controllers/hotel/hotelInfoController");
const {
  read: hotelBookingsDetail,
  create: createHotelBooking,
  list: hotelBookingsList,
  userHotelBookingsList,
  listWithoutPaginate: hotelBookingsListWithoutPaginate,
  checkAvailablity,
  cancelBooking,
  failBooking,
  confirmBooking,
} = require("../controllers/hotel/hotelBookingController");

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
router.get("/room-categories", roomCategoriesList);
router.post(
  "/room-categories",
  requireSignIn,
  isAdmin,
  upload("thumbnail", "roomCategory"),
  createRoomCategory
);
router.delete(
  "/room-categories-all",
  requireSignIn,
  isAdmin,
  deleteAllRoomCategories
);

// Routes for Hotel Room Sub Category
router.post(
  "/room-sub-categories",
  requireSignIn,
  isAdmin,
  createRoomSubCategory
);
router.put(
  "/room-sub-categories/:roomSubCategoryId",
  requireSignIn,
  isAdmin,
  updateRoomSubCategory
);

// Routes for Hotel Info
router.get("/hotel-info", hotelInfoList);
router.get("/hotel-info-get", readByHotelId);
router.post(
  "/hotel-info",
  requireSignIn,
  isAdmin,
  upload("thumbnail", "hotelinfo"),
  createHotelInfo
);
router.put(
  "/hotel-info-update",
  requireSignIn,
  isAdmin,
  upload("thumbnail", "hotelinfo"),
  updateByHotelId
);

// Routes for Hotel Bookings
router.get("/hotel-bookings", requireSignIn, isAdmin, hotelBookingsList);
router.get(
  "/user-specific-hotel-bookings",
  requireSignIn,
  userHotelBookingsList
);
router.get(
  "/hotel-bookings/:hotelBookingId",
  requireSignIn,
  hotelBookingsDetail
);
router.get(
  "/hotel-bookings-no-paginate",
  requireSignIn,
  isAdmin,
  hotelBookingsListWithoutPaginate
);
router.post("/hotel-bookings", requireSignIn, createHotelBooking);
router.post("/hotel-available", checkAvailablity);
router.put("/hotel-bookings-fail/:id", failBooking);
router.put("/hotel-bookings-cancel/:id", cancelBooking);
router.post("/hotel-bookings-confirm/:id", confirmBooking);
module.exports = router;
