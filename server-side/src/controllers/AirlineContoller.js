// Import necessary modules and dependencies
const Airline = require('../models/AirlineModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Airline Add Controller Function
exports.create = async (req, res) => {
    try {
        // Destructure variables from req.body
        const {
            airline_name,
            airline_code,
            email,
            phone,
            address
        } = req.body;

        // Check if any of the fields already exist
        const existingAirline = await Airline.findOne({
            $or: [
                { airline_name },
                { airline_code },
                { email },
                { phone },
            ]
        });

        // Return error if any field already exists
        if (existingAirline) {
            return apiResponse.errorResponse(res, "The airline already exist!");
        }

        // Create new Airline
        const airline = await new Airline({
            airline_name,
            airline_code,
            email,
            phone,
            address
        }).save();

        // Check if airline is created successfully
        if (airline) {
            return apiResponse.successResponse(res, 'Airline created successfully!');
        }

    } catch (err) {
        // Log and handle errors
        console.error("Error from create:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Airline List Controller Function
exports.list = async (req, res) => {
    try {
        // Retrieve all airlines
        const airlines = await Airline.find();

        // Check if airlines are available
        if (airlines.length > 0) {
            return apiResponse.successResponseWithData(res, 'Airline retrieval Successful!', airlines);
        } else {
            return apiResponse.errorResponse(res, "No flight available");
        }
    } catch (err) {
        // Log and handle errors
        console.error("Error From Read", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Airline Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        // Extract the airline ID from the request parameters
        const airlineId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(airlineId)) {
            return apiResponse.errorResponse(res, 'Invalid Airline ID');
        }

        // Find the airline by ID
        const airline = await Airline.findById(airlineId);

        // Check if the airline is not found
        if (!airline) {
            return apiResponse.errorResponse(res, 'Airline not found');
        }

        // Return success response with airline data
        return apiResponse.successResponseWithData(res, 'Airline retrieval by ID successful!', airline);
    } catch (err) {
        // Log and handle errors
        console.error("Error from ReadById:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Airline Update Controller Function
exports.update = async (req, res) => {
    try {
        // Extract the airline ID from the request parameters
        const airlineId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(airlineId)) {
            return apiResponse.errorResponse(res, 'Invalid Airline ID');
        }

        // Find the airline by ID and update its data
        const updatedAirline = await Airline.findByIdAndUpdate(
            airlineId,
            req.body, // Use the request body for the update
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        // Check if the airline is not found
        if (!updatedAirline) {
            return apiResponse.errorResponse(res, 'Airline not found');
        }

        // Return success response with updated airline data
        return apiResponse.successResponse(res, 'Airline update successful!');
    } catch (err) {
        // Log and handle errors
        console.error("Error from Update:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Airline Delete Controller Function
exports.remove = async (req, res) => {
    try {
        // Extract the airline ID from the request parameters
        const airlineId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(airlineId)) {
            return apiResponse.errorResponse(res, 'Invalid Airline ID');
        }

        // Find the airline by ID and remove it
        const deletedAirline = await Airline.findByIdAndRemove(airlineId);

        // Check if the airline is not found
        if (!deletedAirline) {
            return apiResponse.errorResponse(res, 'Airline not found');
        }

        // Return success response for deleted airline
        return apiResponse.successResponse(res, 'Airline Delete Successful!');
    } catch (err) {
        // Log and handle errors
        console.error("Error from Delete:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};
