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
router.post(
	"/create-tourBook/:tourInfoId/:tourId/:adultNo/:childrenNo/:packageName/:vehicleOption",
	requireSignIn,
	tourBooking
);

module.exports = router;
