const express = require("express");
const {
	tourFoodMenu,
	tourDescription,
	tourTips,
	tourIncludeExclude,
	tourPackageOptions,
	tourInfo,
	personPayChart,
	vehiclePayChart,
	tourBooking,
	tourByID,
	tourCard,
	matchedLocationTourLists,
	tourThumbnail,
	listTourThumbnail,
} = require("../controllers/tourControllers");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/create-foodmenu", requireSignIn, isAdmin, tourFoodMenu);
router.post("/create-description", requireSignIn, isAdmin, tourDescription);
router.post("/create-tourTips", requireSignIn, isAdmin, tourTips);
router.post(
	"/create-tourIncludeExclude",
	requireSignIn,
	isAdmin,
	tourIncludeExclude
);
router.post("/create-tourOptions", requireSignIn, isAdmin, tourPackageOptions);
router.post("/create-personPay", requireSignIn, isAdmin, personPayChart);
router.post("/create-vehiclePay", requireSignIn, isAdmin, vehiclePayChart);
router.post("/create-tourInfo", tourInfo);
//create tour thumbnail
router.post("/tour-thumbnail", requireSignIn, isAdmin, tourThumbnail);

//booking a tour
router.post(
	"/create-tourBook/:tourInfoId/:tourId/:adultNo/:childrenNo/:packageName/:vehicleOption",
	requireSignIn,
	tourBooking
);

//tour card list create
router.post("/create-tourCardList", requireSignIn, isAdmin, tourCard);
//show all tour lists
router.get(
	"/show-tourCardList/:tourMatchingCode/:pageNo/:perPage/:searchKeyword",
	requireSignIn,
	matchedLocationTourLists
);
//particular tourInfo by id
router.get("/tour-info/:tourInfoId", tourByID);
//show all tour-thumbnails
router.get("/tour-thumbnails", listTourThumbnail);

module.exports = router;
