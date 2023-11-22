const TourDescription = require("../models/tourmodel/tourDescriptionModel");
const TourFood = require("../models/tourmodel/tourFoodModel");
const TourTip = require("../models/tourmodel/tourTipsModel");
const { convertStringToArray } = require("../helpers/stringToArray");
const IncluAndExclu = require("../models/tourmodel/includeExcludeModel");
const PackageOption = require("../models/tourmodel/packageOptionModel");
const TourInfo = require("../models/tourmodel/tourInfoModel");
const TourPersonPrice = require("../models/tourmodel/tourPriceModel");
const VehiclePrice = require("../models/tourmodel/vehiclePriceModel");
const TourBooking = require("../models/tourmodel/tourBookingModel");

//create foodmenu for particular tour
exports.tourFoodMenu = async (req, res, next) => {
	try {
		const { tourId, dayNo, breakfast, lunch, dinner } = req.body;

		// Convert the string inputs to arrays
		const breakfastArray = convertStringToArray(breakfast);
		const lunchArray = convertStringToArray(lunch);
		const dinnerArray = convertStringToArray(dinner);

		const createFoodMenu = await new TourFood({
			tourId,
			dayNo,
			breakfast: breakfastArray,
			lunch: lunchArray,
			dinner: dinnerArray,
		}).save();
		res.status(201).json({
			status: "Success",
			message: "Tour food menu created",
			createFoodMenu,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour description for paticular tour
exports.tourDescription = async (req, res, next) => {
	try {
		const {
			tourId,
			details,
			coveredLocations,
			premiumResorts,
			economyResorts,
		} = req.body;

		// Convert the string inputs to arrays
		const coveredLocationsArray = convertStringToArray(coveredLocations);

		const createDescriptions = await new TourDescription({
			tourId,
			details,
			coveredLocations: coveredLocationsArray,
			premiumResorts,
			economyResorts,
		}).save();

		//find food menu related to tourId
		const tourFoodMenu = await TourFood.aggregate([
			{ $match: { tourId: { $eq: `${tourId}` } } },
		]);

		res.status(201).json({
			status: "Success",
			message: "Tour description created",
			createDescriptions,
			tourFoodMenu,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour tips for paticular tour
exports.tourTips = async (req, res, next) => {
	try {
		const { tourId, thingsCandDo, thingsToAvoid } = req.body;

		const thingsCandDoArray = convertStringToArray(thingsCandDo);
		const thingsToAvoidArray = convertStringToArray(thingsToAvoid);

		const createdTourTips = await new TourTip({
			tourId,
			thingsCandDo: thingsCandDoArray,
			thingsToAvoid: thingsToAvoidArray,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "Tour tips created",
			createdTourTips,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour include and exclude features
exports.tourIncludeExclude = async (req, res, next) => {
	try {
		const { tourId, inclusions, exclusions } = req.body;

		const inclusionArray = convertStringToArray(inclusions);
		const exclusionsArray = convertStringToArray(exclusions);

		const createdIncludeExclude = await new IncluAndExclu({
			tourId,
			inclusions: inclusionArray,
			exclusions: exclusionsArray,
		}).save();
		res.status(201).json({
			status: "Success",
			message: "Tour description created",
			createdIncludeExclude,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour package options
exports.tourPackageOptions = async (req, res, next) => {
	try {
		const {
			tourId,
			packageName,
			packageDetails,
			packagePrice,
			vehicleDetails,
		} = req.body;

		const vehicleDetailsArray = convertStringToArray(vehicleDetails);

		const createdPackageOption = await new PackageOption({
			tourId,
			packageName,
			packageDetails,
			packagePrice,
			vehicleDetails: vehicleDetailsArray,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "Tour description created",
			createdPackageOption,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.tourInfo = async (req, res, next) => {
	try {
		const {
			tourId,
			title,
			typeOfTour,
			about,
			city,
			locations,
			duration,
			distance,
			images,
			price,
			tourDate,
			additionalInfo,
			maxGroupSize,
		} = req.body;

		const locationsArray = convertStringToArray(locations);
		const imageArray = convertStringToArray(images);
		const additionalInfoArray = convertStringToArray(additionalInfo);

		const createdTourInfo = await new TourInfo({
			tourId,
			title,
			typeOfTour,
			about,
			city,
			locations: locationsArray,
			duration,
			distance,
			images: imageArray,
			price,
			tourDate,
			additionalInfo: additionalInfoArray,
			maxGroupSize,
		}).save();

		const description = await TourDescription.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);
		const foodmenu = await TourFood.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);
		const packages = await PackageOption.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);
		const includeExclude = await IncluAndExclu.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);
		const tourTips = await TourTip.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);

		res.status(201).json({
			status: "Success",
			message: "Tour description created",
			createdTourInfo,
			description,
			foodmenu,
			packages,
			includeExclude,
			tourTips,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.personPayChart = async (req, res, next) => {
	try {
		const { tourId, packageName, adultPay, childrenPay } = req.body;

		const adultPayment = adultPay ? adultPay : 0;
		const childrenPayment = childrenPay ? childrenPay : 0;

		const createdPersonPayment = await new TourPersonPrice({
			tourId,
			packageName,
			adultPay: adultPayment,
			childrenPay: childrenPayment,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "Persons payment age wise chart created",
			createdPersonPayment,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.vehiclePayChart = async (req, res, next) => {
	try {
		const {
			tourId,
			vehicle1Name,
			vehicle1Price,
			vehicle2Name,
			vehicle2Price,
			vehicle3Name,
			vehicle3Price,
		} = req.body;

		const vehicle1NameValue = vehicle1Name || "N/A";
		const vehicle2NameValue = vehicle2Name || "N/A";
		const vehicle3NameValue = vehicle3Name || "N/A";
		const vehicle1PriceValue = vehicle1Price || 0;
		const vehicle2PriceValue = vehicle2Price || 0;
		const vehicle3PriceValue = vehicle3Price || 0;

		const createdVehiclePriceData = await new VehiclePrice({
			tourId,
			vehicle1Name: vehicle1NameValue,
			vehicle1Price: vehicle1PriceValue,
			vehicle2Name: vehicle2NameValue,
			vehicle2Price: vehicle2PriceValue,
			vehicle3Name: vehicle3NameValue,
			vehicle3Price: vehicle3PriceValue,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "Tour description created",
			createdVehiclePriceData,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.tourBooking = async (req, res, next) => {
	try {
		const userId = req.user;
		const {
			tourInfoId,
			tourId,
			adultNo,
			childrenNo,
			packageName,
			vehicleOption,
		} = req.params;
		const adultPersonCount = Number(adultNo) || 1;
		const childrenCount = Number(childrenNo) || 0;

		const personPayChart = await TourPersonPrice.aggregate([
			{ $match: { tourId: { $eq: `${tourId}` } } },
			{ $match: { packageName: { $eq: `${packageName}` } } },
			{
				$project: {
					_id: 0,
					adultPay: {
						$cond: [
							{ $gt: [adultPersonCount, 0] },
							"$adultPay",
							null,
						],
					},
					childrenPay: {
						$cond: [
							{ $gt: [childrenCount, 0] },
							"$childrenPay",
							null,
						],
					},
				},
			},
		]);

		const vehiclePayChart = await VehiclePrice.aggregate([
			{ $match: { tourId: `${tourId}` } },
			{
				$project: {
					_id: 0,
					vehiclePrice: {
						$cond: {
							if: { $eq: [`$vehicle1Name`, vehicleOption] },
							then: "$vehicle1Price",
							else: {
								$cond: {
									if: {
										$eq: [`$vehicle2Name`, vehicleOption],
									},
									then: "$vehicle2Price",
									else: "$vehicle3Price",
								},
							},
						},
					},
				},
			},
		]);
		const targetVehiclePrice = vehiclePayChart[0]?.vehiclePrice;

		const selectedPackagePrice = await PackageOption.aggregate([
			{ $match: { tourId: { $eq: `${tourId}` } } },
			{ $match: { packageName: { $eq: `${packageName}` } } },
			{
				$project: {
					_id: 0,
					packagePrice: 1,
				},
			},
		]);

		// Calculate total cost
		const totalCost =
			adultPersonCount * (personPayChart[0]?.adultPay || 0) +
			childrenCount * (personPayChart[0]?.childrenPay || 0) +
			(selectedPackagePrice[0]?.packagePrice || 0) +
			(targetVehiclePrice || 0);

		// Get tourInfoId's tourDate
		const tourInfo = await TourInfo.findById(tourInfoId);
		const tourDate = new Date(tourInfo.tourDate);

		const createdBooking = await new TourBooking({
			userId,
			tourInfoId,
			tourId,
			packageName,
			bookingDate: new Date(),
			journeyDate: tourDate,
			adultParticipants: adultPersonCount,
			childrenParticipants: childrenCount,
			vehicleOption,
			totalToPay: totalCost,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "Tour description created",
			createdBooking,
			totalCost,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
