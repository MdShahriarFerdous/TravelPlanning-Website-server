// Import necessary modules and dependencies
const Flight = require("../models/FlightModel");
const apiResponse = require("../helpers/apiResponse");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment");

// Flight Add Controller Function
exports.create = async (req, res) => {
	try {
		// Destructure variables from req.body
		const {
			plane_id,
			source_destination_id,
			destination_id,
			journey_date,
			fare,
			tax,
			seatLeft,
			departure_time,
			arrival_time,
			flight_class,
			status,
		} = req.body;

		// Required field validation
		const requiredFields = [
			"plane_id",
			"journey_date",
			"source_destination_id",
			"destination_id",
			"fare",
			"tax",
			"seatLeft",
			"departure_time",
			"arrival_time",
			"flight_class",
		];
		for (const field of requiredFields) {
			if (!req.body[field]) {
				return apiResponse.errorResponse(res, `${field} is required`);
			}
		}

		// Create a flight number based on a format (e.g., FL211115)
		const flight_number = `FL${moment().format("YYMMDDHHmmss")}`;

		// Check if the flight number is taken
		const flightExist = await Flight.findOne({ flight_number });

		// Return error if the flight exists
		if (flightExist) {
			return apiResponse.errorResponse(
				res,
				"Flight Number is already taken"
			);
		}

		// Create new Flight
		const flight = await new Flight({
			flight_number,
			plane_id,
			source_destination_id,
			destination_id,
			journey_date,
			fare,
			tax,
			seatLeft,
			departure_time,
			arrival_time,
			flight_class,
			status,
		}).save();

		// Check if flight is created successfully
		if (flight) {
			return apiResponse.successResponse(
				res,
				"Flight created successfully!"
			);
		}
	} catch (err) {
		// Log and handle errors
		console.error("Error from create:", err.message);
		return apiResponse.errorResponse(res, "Something went wrong");
	}
};

// Flight List Controller Function
exports.list = async (req, res) => {
	try {
		// Retrieve all flights with plane and location information
		const flights = await Flight.aggregate([
			{
				$lookup: {
					from: "planes", // Collection name of the Plane model
					localField: "plane_id",
					foreignField: "_id",
					as: "planeInfo",
				},
			},
			{
				$unwind: {
					path: "$planeInfo",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "locations", // Collection name of the Location model
					localField: "source_destination_id",
					foreignField: "_id",
					as: "sourceLocationInfo",
				},
			},
			{
				$unwind: {
					path: "$sourceLocationInfo",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "locations", // Collection name of the Location model
					localField: "destination_id",
					foreignField: "_id",
					as: "destinationLocationInfo",
				},
			},
			{
				$unwind: {
					path: "$destinationLocationInfo",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					plane_id: 1,
					flight_number: 1,
					journey_date: 1,
					source_destination_id: 1,
					destination_id: 1,
					fare: 1,
					tax: 1,
					seatLeft: 1,
					departure_time: 1,
					arrival_time: 1,
					flight_class: 1,
					status: 1,
					"planeInfo.airline_id": 1,
					"planeInfo.plane_model": 1,
					"planeInfo.capacity": 1,
					"planeInfo.manufacturing_year": 1,
					"planeInfo.registration_number": 1,
					"sourceLocationInfo.location_name": 1,
					"sourceLocationInfo.latitude": 1,
					"sourceLocationInfo.longitude": 1,
					"destinationLocationInfo.location_name": 1,
					"destinationLocationInfo.latitude": 1,
					"destinationLocationInfo.longitude": 1,
				},
			},
		]);

		// Check if flights are available
		if (flights.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				"Flight retrieval Successful!",
				flights
			);
		} else {
			return apiResponse.errorResponse(res, "No flight available");
		}
	} catch (err) {
		// Log and handle errors
		console.error("Error From Read", err.message);
		return apiResponse.errorResponse(res, "Something went wrong");
	}
};

// Flight Read by ID Controller Function
exports.readById = async (req, res) => {
	try {
		// Extract flight ID from request parameters
		const flightId = req.params.id;

		// Validate if the provided ID is a valid ObjectId (MongoDB ID)
		if (!ObjectId.isValid(flightId)) {
			return apiResponse.errorResponse(res, "Invalid Flight ID");
		}

		// Perform the aggregation
		const flight = await Flight.aggregate([
			{
				$match: { _id: new ObjectId(flightId) }
			},
			{
				$lookup: {
					from: "locations",
					localField: "source_destination_id",
					foreignField: "_id",
					as: "sourceLocation",
				},
			},
			{
				$lookup: {
					from: "locations",
					localField: "destination_id",
					foreignField: "_id",
					as: "destinationLocation",
				},
			},
			{
				$lookup: {
					from: "planes",
					localField: "plane_id",
					foreignField: "_id",
					as: "planeInfo",
				},
			},
			{
				$lookup: {
					from: "airlines",
					localField: "planeInfo.airline_id",
					foreignField: "_id",
					as: "airlineInfo",
				},
			},
			{
				$unwind: "$airlineInfo",
			},
			{
				$unwind: "$sourceLocation",
			},
			{
				$unwind: "$destinationLocation",
			},
			{
				$unwind: "$planeInfo",
			},
			{
				$project: {
					_id: 1,
					flight_number: 1,
					journey_date: 1,
					fare: 1,
					tax: 1,
					seatLeft: 1,
					departure_time: 1,
					arrival_time: 1,
					flight_class: 1,
					status: 1,
					'sourceLocation.location_name': 1,
					'sourceLocation.latitude': 1,
					'sourceLocation.longitude': 1,
					'destinationLocation.location_name': 1,
					'destinationLocation.latitude': 1,
					'destinationLocation.longitude': 1,
					'planeInfo.plane_model': 1,
					'planeInfo.capacity': 1,
					'planeInfo.manufacturing_year': 1,
					'planeInfo.registration_number': 1,
					'planeInfo.plane_model': 1,
					'airlineInfo.airline_name': 1,
					'airlineInfo.logo': 1,
				},
			},
		]);

		if (flight.length > 0) {
			return apiResponse.successResponseWithData(res, "Flight search successful!", flight[0]);
		} else {
			return apiResponse.errorResponse(res, "No flight found");
		}
	} catch (err) {
		// Log and handle errors
		console.error("Error from ReadById:", err);
		return apiResponse.errorResponse(res, "Something went wrong");
	}
};

// Flight Update Controller Function
exports.update = async (req, res) => {
	try {
		// Extract flight ID from request parameters
		const flightId = req.params.id;

		// Validate if the provided ID is a valid ObjectId (MongoDB ID)
		if (!ObjectId.isValid(flightId)) {
			return apiResponse.errorResponse(res, "Invalid Flight ID");
		}

		// Use findOneAndUpdate to update the flight by its ID
		const updatedFlight = await Flight.findByIdAndUpdate(
			flightId,
			req.body, // Use the request body for the update
			{ new: true, runValidators: true } // Options to return the updated document and run validators
		);

		// Check if the flight is found and updated
		if (updatedFlight) {
			return apiResponse.successResponse(
				res,
				"Flight update successful!"
			);
		} else {
			return apiResponse.errorResponse(
				res,
				"Flight not found or could not be updated"
			);
		}
	} catch (err) {
		// Log and handle errors
		console.error("Error from Update:", err.message);
		return apiResponse.errorResponse(res, "Something went wrong");
	}
};

// Flight Delete Controller Function
exports.remove = async (req, res) => {
	try {
		// Extract flight ID from request parameters
		const flightId = req.params.id;

		// Validate if the provided ID is a valid ObjectId (MongoDB ID)
		if (!ObjectId.isValid(flightId)) {
			return apiResponse.errorResponse(res, "Invalid Flight ID");
		}

		// Use findByIdAndDelete to remove the flight by its ID
		const flight = await Flight.findByIdAndDelete(flightId);

		// Check if the flight is not found
		if (!flight) {
			return apiResponse.notFoundResponse(res, "Flight not found");
		}

		// Return success response for deleted flight
		return apiResponse.successResponse(res, "Flight Delete Successful!");
	} catch (err) {
		// Log and handle errors
		console.error("Error from Delete:", err.message);
		return apiResponse.errorResponse(res, "Something went wrong");
	}
};

// Flight Search Controller Function
exports.searchFlights = async (req, res) => {
	try {
		const {
			source_destination_id,
			destination_id,
			journey_date,
			flight_class,
			total_travellers,
		} = req.body;

		// Convert string to ObjectId
		const sourceDestinationId = new ObjectId(source_destination_id);
		const destinationId = new ObjectId(destination_id);

		// Build the search criteria
		const searchCriteria = {
			source_destination_id: sourceDestinationId,
			destination_id: destinationId,
			journey_date: new Date(journey_date),
			flight_class,
			seatLeft: { $gte: Number(total_travellers) },
		};

		console.log(searchCriteria);

		// Remove fields with null or undefined values
		// Object.keys(searchCriteria).forEach((key) => (searchCriteria[key] == null) && delete searchCriteria[key]);

		// Perform the aggregation
		const flights = await Flight.aggregate([
			{
				$match: searchCriteria,
			},
			{
				$lookup: {
					from: "locations",
					localField: "source_destination_id",
					foreignField: "_id",
					as: "sourceLocation",
				},
			},
			{
				$lookup: {
					from: "locations",
					localField: "destination_id",
					foreignField: "_id",
					as: "destinationLocation",
				},
			},
			{
				$lookup: {
					from: "planes",
					localField: "plane_id",
					foreignField: "_id",
					as: "planeInfo",
				},
			},
			{
				$lookup: {
					from: "airlines",
					localField: "planeInfo.airline_id",
					foreignField: "_id",
					as: "airlineInfo",
				},
			},
			{
				$unwind: "$airlineInfo",
			},
			{
				$unwind: "$sourceLocation",
			},
			{
				$unwind: "$destinationLocation",
			},
			{
				$unwind: "$planeInfo",
			},
			{
				$project: {
					_id: 1,
					flight_number: 1,
					journey_date: 1,
					fare: 1,
					seatLeft: 1,
					departure_time: 1,
					arrival_time: 1,
					flight_class: 1,
					status: 1,
					"sourceLocation.location_name": 1,
					"sourceLocation.latitude": 1,
					"sourceLocation.longitude": 1,
					"destinationLocation.location_name": 1,
					"destinationLocation.latitude": 1,
					"destinationLocation.longitude": 1,
					"planeInfo.plane_model": 1,
					"planeInfo.capacity": 1,
					"planeInfo.manufacturing_year": 1,
					"planeInfo.registration_number": 1,
					"airlineInfo.airline_name": 1,
					"airlineInfo.logo": 1,
				},
			},
		]);

		if (flights.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				"Flight search successful!",
				flights
			);
		} else {
			return apiResponse.errorResponse(res, "No flight found");
		}

		// Return the result
	} catch (err) {
		// Log and handle errors
		console.error("Error from searchFlights:", err.message);
		return apiResponse.errorResponse(res, "Something went wrong");
	}
};
