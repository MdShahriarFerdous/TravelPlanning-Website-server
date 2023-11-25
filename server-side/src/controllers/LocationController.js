// Import necessary modules and dependencies
const Location = require('../models/LocationModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Location Add Controller Function
exports.create = async (req, res) => {
    try {
        // Destructure variables from req.body
        const { location_name, latitude, longitude, status } = req.body;

        // Required field validation
        const requiredFields = ['location_name', 'latitude', 'longitude'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return apiResponse.errorResponse(res, `${field} is required`);
            }
        }

        // Check if the location name is taken
        const locationExist = await Location.findOne({ location_name });

        // Return error if the location exists
        if (locationExist) {
            return apiResponse.errorResponse(res, "Location name is already taken");
        }

        // Create new Location
        const location = await new Location({
            location_name,
            latitude,
            longitude,
            status
        }).save();

        // Check if location is created successfully
        if (location) {
            return apiResponse.successResponse(res, 'Location created successfully!');
        }

    } catch (err) {
        // Log and handle errors
        console.error("Error from create:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Location List Controller Function
exports.list = async (req, res) => {
    try {
        // Retrieve all airlines
        const locations = await Location.find();

        // Check if airlines are available
        if (locations.length > 0) {
            return apiResponse.successResponseWithData(res, 'Location retrieval Successful!', locations);
        } else {
            return apiResponse.errorResponse(res, "No flight available");
        }
    } catch (err) {
        // Log and handle errors
        console.error("Error From Read", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Location Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        // Retrieve location by ID
        const locationId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(locationId)) {
            return apiResponse.errorResponse(res, 'Invalid Flight ID');
        }

        // Use findById to retrieve the location by its ID
        const location = await Location.findById(locationId);

        // Check if the location is found
        if (!location) {
            return apiResponse.errorResponse(res, "Location not found");
        }

        // Return success response with location data
        return apiResponse.successResponseWithData(res, 'Location retrieval by ID successful!', location);
    } catch (err) {
        // Log and handle errors
        console.error("Error from ReadById:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Location Update Controller Function
exports.update = async (req, res) => {
    try {
        // Extract the location ID from the request parameters
        const locationId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(locationId)) {
            return apiResponse.errorResponse(res, 'Invalid Location ID');
        }

        // Find the location by ID and update it
        const updatedLocation = await Location.findByIdAndUpdate(
            locationId,
            req.body, // Use the request body for the update
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        // Check if the location is not found
        if (!updatedLocation) {
            return apiResponse.errorResponse(res, 'Location not found');
        }

        // Return success response with updated location data
        return apiResponse.successResponse(res, 'Location update successful!');
    } catch (err) {
        // Log and handle errors
        console.error("Error from Update:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Location Delete Controller Function
exports.remove = async (req, res) => {
    try {
        // Extract the location ID from the request parameters
        const locationId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(locationId)) {
            return apiResponse.errorResponse(res, 'Invalid Location ID');
        }

        // Find the location by ID and remove it
        const deletedLocation = await Location.findByIdAndRemove(locationId);

        // Check if the location is not found
        if (!deletedLocation) {
            return apiResponse.errorResponse(res, 'Location not found');
        }

        // Return success response for the deleted location
        return apiResponse.successResponse(res, 'Location Delete Successful!');
    } catch (err) {
        // Log and handle errors
        console.error("Error from Delete:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};
