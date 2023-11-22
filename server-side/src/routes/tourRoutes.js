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
const { requireSignIn } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/create-foodmenu", tourFoodMenu);
router.post("/create-description", tourDescription);
router.post("/create-tourTips", tourTips);
router.post("/create-tourIncludeExclude", tourIncludeExclude);
router.post("/create-tourOptions", tourPackageOptions);
router.post("/create-personPay", personPayChart);
router.post("/create-vehiclePay", vehiclePayChart);

router.post("/create-tourInfo", tourInfo);
router.post(
	"/create-tourBook/:tourInfoId/:tourId/:adultNo/:childrenNo/:packageName/:vehicleOption",
	requireSignIn,
	tourBooking
);

module.exports = router;
