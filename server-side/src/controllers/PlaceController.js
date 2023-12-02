// Import necessary modules and dependencies
const Place = require('../models/PlaceModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Place Add Controller Function
exports.create = async (req, res) => {
    try {
        // Required field validation
        const requiredFields = ['name', 'location'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return apiResponse.errorResponse(res, `${field} is required`);
            }
        }

        // Destructure variables from req.body
        const { name, description, photo, location } = req.body;

        // Create a new place
        const newPlace = await new Place({
            name,
            description,
            photo,
            location,
        }).save();

        // Check if the place is created successfully
        if (newPlace) {
            return apiResponse.successResponse(res, 'Place created successfully!');
        }

    } catch (err) {
        // Log and handle errors
        console.error("Error from create:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Place List Controller Function
exports.list = async (req, res) => {
    try {
        // Retrieve all places from the database
        const places = await Place.find();

        // Return the list of places
        return apiResponse.successResponseWithData(res, 'Places retrieval successful!', places);

    } catch (err) {
        // Log and handle errors
        console.error('Error From Read', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Place Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        // Extract place ID from the request parameters
        const { id } = req.params;

        // Validate if the ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return apiResponse.errorResponse(res, 'Invalid place ID');
        }

        // Retrieve the place by ID from the database
        const place = await Place.findById(id);

        // Check if the place is found
        if (!place) {
            return apiResponse.errorResponse(res, 'Place not found');
        }

        // Return the place data
        return apiResponse.successResponseWithData(res, 'Place retrieval by ID successful!', place);

    } catch (err) {
        // Log and handle errors
        console.error('Error from readById:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Place Update Controller Function
exports.update = async (req, res) => {
    try {
        // Extract the place ID from the request parameters
        const placeId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(placeId)) {
            return apiResponse.errorResponse(res, 'Invalid Place ID');
        }

        // Update the place using findByIdAndUpdate
        // The { new: true, runValidators: true } options ensure that the updated document is returned,
        // and validators (if defined in the schema) are run during the update.
        const updatedPlace = await Place.findByIdAndUpdate(
            placeId,
            req.body,
            { new: true, runValidators: true }
        );

        // Check if the place exists
        if (!updatedPlace) {
            return apiResponse.errorResponse(res, 'Place not found');
        }

        // Return success response with updated place data
        return apiResponse.successResponse(res, 'Place update successful!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from Update:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Place Delete Controller Function
exports.remove = async (req, res) => {
    try {
        // Extract the place ID from the request parameters
        const placeId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(placeId)) {
            return apiResponse.errorResponse(res, 'Invalid Place ID');
        }

        // Remove the place using findByIdAndRemove
        const removedPlace = await Place.findByIdAndRemove(placeId);

        // Check if the place exists
        if (!removedPlace) {
            return apiResponse.errorResponse(res, 'Place not found');
        }

        // Return success response with a message
        return apiResponse.successResponse(res, 'Place delete successful!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from Delete:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

