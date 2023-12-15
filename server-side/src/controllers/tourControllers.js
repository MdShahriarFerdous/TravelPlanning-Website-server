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
const TourListCard = require("../models/tourmodel/tourListCardModel");
const TourThumbnail = require("../models/tourmodel/tourThumbnailModel");
const TourTypeCard = require("../models/tourmodel/tourTypeCardModel");

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
			message: "Tour inclusion and exclusion created",
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
			message: "Tour Package created",
			createdPackageOption,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour info
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

		res.status(201).json({
			status: "Success",
			message: "Tour info created",
			createdTourInfo,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create persons payment chart by ages
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

//create vehicles payment chart
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
			message: "Tour vehicle price chart created",
			createdVehiclePriceData,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//booking a tour
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
			userId: userId,
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
			message: "Tour booking submitted",
			createdBooking,
			totalCost,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.calculateTotalCost = async (req, res, next) => {
	try {
		const { tourId, adultNo, childrenNo, packageName, vehicleOption } =
			req.params;

		// Default values
		const isDefaultValues =
			Number(adultNo) === 1 &&
			Number(childrenNo) === 0 &&
			packageName === "Economy Package" &&
			vehicleOption === "No";

		if (isDefaultValues) {
			const defaultAdultPay = await TourPersonPrice.aggregate([
				{
					$match: {
						tourId: `${tourId}`,
						packageName: "Economy Package",
					},
				},
				{
					$project: {
						_id: 0,
						adultPay: {
							$cond: [{ $gt: [1, 0] }, "$adultPay", null],
						},
					},
				},
			]);

			res.status(200).json({
				status: "Success",
				message: "Adult Pay for Default Values",
				totalCost: defaultAdultPay[0]?.adultPay || 0,
			});
		} else if (
			packageName &&
			adultNo &&
			childrenNo === 0 &&
			vehicleOption === "No"
		) {
			// Handle scenario with packageName and adultNo only
			const personPayChart = await TourPersonPrice.aggregate([
				{
					$match: {
						tourId: `${tourId}`,
						packageName: `${packageName}`,
					},
				},
				{
					$project: {
						_id: 0,
						adultPay: {
							$cond: [
								{ $gt: [Number(adultNo), 0] },
								"$adultPay",
								null,
							],
						},
					},
				},
			]);

			// Calculate total cost by multiplying adultNo with adultPay
			const totalCost =
				(personPayChart[0]?.adultPay || 0) * Number(adultNo);

			res.status(200).json({
				status: "Success",
				message: "Adult Pay for Package and Adult Count",
				totalCost: totalCost,
			});
		} else if (
			packageName &&
			adultNo &&
			childrenNo &&
			vehicleOption === "No"
		) {
			// Handle scenario with packageName, adultNo, and childrenNo
			const personPayChart = await TourPersonPrice.aggregate([
				{
					$match: {
						tourId: `${tourId}`,
						packageName: `${packageName}`,
					},
				},
				{
					$project: {
						_id: 0,
						adultPay: {
							$cond: [
								{ $gt: [Number(adultNo), 0] },
								"$adultPay",
								null,
							],
						},
						childrenPay: {
							$cond: [
								{ $gt: [Number(childrenNo), 0] },
								"$childrenPay",
								null,
							],
						},
					},
				},
			]);

			// Calculate total cost by adding up adultPay and childrenPay
			const totalCost =
				(personPayChart[0]?.adultPay || 0) * Number(adultNo) +
				(personPayChart[0]?.childrenPay || 0) * Number(childrenNo);

			res.status(200).json({
				status: "Success",
				message: "Adult and Children Pay for Package",
				totalCost: totalCost,
			});
		} else if (
			packageName &&
			adultNo &&
			childrenNo === "0" &&
			vehicleOption
		) {
			const personPayChart = await TourPersonPrice.aggregate([
				{
					$match: {
						tourId: `${tourId}`,
						packageName: `${packageName}`,
					},
				},
				{
					$project: {
						_id: 0,
						adultPay: {
							$cond: [
								{ $gt: [Number(adultNo), 0] },
								"$adultPay",
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
											$eq: [
												`$vehicle2Name`,
												vehicleOption,
											],
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

			const totalCost =
				(personPayChart[0]?.adultPay || 0) * Number(adultNo) +
				targetVehiclePrice;

			res.status(200).json({
				status: "Success",
				message: "Cost",
				totalCost: totalCost,
			});
		} else {
			// Handle the existing calculation logic for other scenarios
			const adultPersonCount = Number(adultNo) || 1;
			const childrenCount = Number(childrenNo) || 0;

			const personPayChart = await TourPersonPrice.aggregate([
				{
					$match: {
						tourId: `${tourId}`,
						packageName: `${packageName}`,
					},
				},
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
											$eq: [
												`$vehicle2Name`,
												vehicleOption,
											],
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

			// Calculate total cost
			const totalCost =
				adultPersonCount * (personPayChart[0]?.adultPay || 0) +
				childrenCount * (personPayChart[0]?.childrenPay || 0) +
				(targetVehiclePrice || 0);

			res.status(200).json({
				status: "Success",
				message: "Total Cost",
				totalCost,
			});
		}
	} catch (error) {
		console.error("Error in calculateTotalCost:", error);
		res.status(500).json({
			status: "Error",
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

//get a tourInfo by id or single tour
exports.tourByID = async (req, res, next) => {
	try {
		const { tourInfoId } = req.params;

		const getTourInfo = await TourInfo.findOne({ tourId: tourInfoId });
		const tourId = getTourInfo.tourId;

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

		const tourVehiclePrice = await VehiclePrice.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);

		const tourPersonPay = await TourPersonPrice.aggregate([
			{
				$match: { tourId: { $eq: `${tourId}` } },
			},
		]);

		res.status(200).json({
			status: "Success",
			message: "Here is a tour overview",
			tourDetails: {
				getTourInfo,
				description: description || {},
				foodmenu: foodmenu || {},
				packages: packages || {},
				includeExclude: includeExclude || {},
				tourTips: tourTips || {},
				tourVehiclePrice: tourVehiclePrice || {},
				tourPersonPay: tourPersonPay || {},
			},
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour card
exports.tourCard = async (req, res, next) => {
	try {
		const {
			tourInfoId,
			tourType,
			title,
			image,
			locationName,
			startingPrice,
			durations,
			maxPeople,
			notes,
		} = req.body;

		const createdTourCard = await new TourListCard({
			tourInfoId,
			tourType,
			title,
			image,
			locationName,
			startingPrice,
			durations,
			maxPeople,
			notes,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "Tour list card created",
			createdTourCard,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour type card
// exports.tourTypeCard = async (req, res, next) => {
// 	try {
// 		const { tourType, image } = req.body;

// 		const createdTourTypeCard = await new TourTypeCard({
// 			tourType,
// 			image,
// 		}).save();

// 		res.status(201).json({
// 			status: "Success",
// 			message: "Tour type card created",
// 			createdTourTypeCard,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		next(error);
// 	}
// };

//show all matching code tour cards after clicking on thumbnail
exports.matchedLocationTourLists = async (req, res, next) => {
	try {
		const { searchKeyword, pageNo, perPage } = req.params;
		const pageNumber = Number(pageNo) || 1;
		const perPageNumber = Number(perPage) || 10;
		const skipRows = (pageNumber - 1) * perPageNumber;

		const { checked } = req.body;

		// Build the search query
		let searchQuery = {};
		if (searchKeyword !== "0") {
			const searchRegex = { $regex: searchKeyword, $options: "i" };
			searchQuery.$or = [
				{ title: searchRegex },
				{ locationName: searchRegex },
				{ durations: searchRegex },
			];
		}

		// Combine search query with price range condition
		const combinedQuery = {
			$and: [
				searchQuery,
				checked.length > 0
					? {
							startingPrice: {
								$gte: checked[0],
								$lte: checked[1],
							},
					  }
					: {},
			],
		};

		// Execute aggregation pipeline
		const toursCardLists = await TourListCard.aggregate([
			{ $match: combinedQuery },
			{ $skip: skipRows },
			{ $limit: perPageNumber },
		]);

		// Get total count for pagination
		const totalCount = await TourListCard.countDocuments(combinedQuery);

		res.status(200).json({
			total: totalCount,
			tourCardData: toursCardLists,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//tour list by tour types
exports.tourListsByType = async (req, res, next) => {
	try {
		const { tourType } = req.params;

		// Match query for tourMatchingCode
		const matchQuery = { tourType: { $eq: tourType } };

		const tourLists = TourListCard.aggregate([{ $match: matchQuery }]);

		res.status(200).json({
			status: "Success",
			message: "Tour type lists",
			tourLists,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//create tour thumbnail by admin
exports.tourThumbnail = async (req, res, next) => {
	try {
		const {
			tourInfoId,
			image,
			locationName,
			tourTitle,
			durations,
			peopleSize,
			ratings,
			reviewsCount,
		} = req.body;

		const existTourId = await TourThumbnail.findOne({ tourInfoId });
		if (existTourId) {
			return res.json({ error: "Tour Info Id already exist!" });
		}

		switch (true) {
			case !tourInfoId.trim():
				return res.json({ error: "Tour Info Id is required" });
			case !image.trim():
				return res.json({ error: "Image is required" });
			case !ratings:
				return res.json({ error: "Rating number is required" });
			case !locationName.trim():
				return res.json({ error: "LocationName is required" });
			case !reviewsCount:
				return res.json({ error: "Reviews count is required" });
			case !tourTitle.trim():
				return res.json({ error: "Title is required" });
			case !durations.trim():
				return res.json({ error: "Duration is required" });
			case !peopleSize:
				return res.json({ error: "People size is required" });
		}

		const createTourThumbnail = await new TourThumbnail({
			...req.body,
		}).save();
		res.status(201).json({
			status: "Success",
			message: "Tour thumbnail created",
			thumbnailDetails: createTourThumbnail,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//get all tour thumbnails
exports.listTourThumbnail = async (req, res, next) => {
	try {
		const allThumbnailsList = await TourThumbnail.find({});

		if (!allThumbnailsList) {
			return res.json({ error: "Tour thumbnails showing failed!" });
		}

		res.status(200).json({
			status: "Success",
			message: "All tour thumbnails",
			tourPackageLists: allThumbnailsList,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//get tour-booking-info by id
exports.getTourBookingInfo = async (req, res, next) => {
	const { bookingId } = req.params;
	try {
		const tourBookingInfo = await TourBooking.findById(bookingId);

		if (!tourBookingInfo) {
			return res.json({ error: "No tour booking info by this id!" });
		}

		res.status(200).json({
			status: "Success",
			message: "Here is the booking info",
			tourBookingInfo,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
//get Vehicle pay chart by tourId
exports.getVehicleData = async (req, res, next) => {
	const { tourId } = req.params;

	try {
		const vehicleData = await VehiclePrice.findOne({ tourId });

		if (!vehicleData) {
			return res.json({ error: "No tour booking info by this id!" });
		}

		res.status(200).json({
			status: "Success",
			message: "Here is the vehicle data",
			vehicleData,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//get package data by tourId and packageName
exports.getPackageData = async (req, res, next) => {
	const { tourId, packageName } = req.params;
	try {
		const packageData = await PackageOption.findOne({
			tourId: tourId,
			packageName: packageName,
		});

		if (!packageData) {
			return res.json({ error: "No package info by this id!" });
		}

		res.status(200).json({
			status: "Success",
			message: "Particular package data",
			packageData,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//get person pay data by tourId and packageName
exports.getPersonPayData = async (req, res, next) => {
	const { tourId, packageName } = req.params;
	try {
		const personPayData = await TourPersonPrice.findOne({
			tourId: tourId,
			packageName: packageName,
		});

		if (!personPayData) {
			return res.json({ error: "No data info by this id!" });
		}

		res.status(200).json({
			status: "Success",
			message: "Person pay data",
			personPayData,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//get only tourInfo by id without details
exports.tourInfoByID = async (req, res, next) => {
	try {
		const { tourInfoId } = req.params;

		const getTourInfo = await TourInfo.findOne({ tourId: tourInfoId });

		res.status(200).json({
			status: "Success",
			message: "Here is a tour info",
			getTourInfo,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

//delete Tourbooking
exports.deleteTourBooking = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deletedBooking = await TourBooking.findByIdAndDelete({ _id: id });
		if (!deletedBooking) {
			return res.status(404).json({
				status: "Error",
				message: "Booking not found",
			});
		}

		res.status(200).json({
			status: "Success",
			message: "Booking is deleted",
			deletedBooking,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
