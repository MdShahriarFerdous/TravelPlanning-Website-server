// Import necessary modules and dependencies
const Restaurant = require('../models/RestaurantModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Restaurant Add Controller Function
exports.create = async (req, res) => {
    try {
        // Destructure variables from req.body
        const { name, description, photo, location } = req.body;

        // Required field validation
        const requiredFields = ['name', 'location'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return apiResponse.errorResponse(res, `${field} is required`);
            }
        }

        // Creating a new Restaurant
        const newRestaurant = new Restaurant({
            name,
            description,
            photo,
            location,
        });

        // Save the Restaurant to the database
        const savedRestaurant = await newRestaurant.save();

        // Return success response with the created restaurant data
        return apiResponse.successResponse(res, 'Restaurant created successfully!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from create:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Restaurant List Controller Function
exports.list = async (req, res) => {
    try {

        // Retrieve the list of restaurants
        const restaurants = await Restaurant.find();

        // Return success response with the list of restaurants
        return apiResponse.successResponseWithData(res, 'Restaurant list retrieved successfully!', restaurants);
    } catch (err) {
        // Log and handle errors
        console.error('Error From Read', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Restaurant Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        const restaurantId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(restaurantId)) {
            return apiResponse.errorResponse(res, 'Invalid Restaurant ID');
        }

        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(restaurantId);

        // Check if the restaurant exists
        if (!restaurant) {
            return apiResponse.errorResponse(res, 'Restaurant not found');
        }

        // Return success response with restaurant data
        return apiResponse.successResponseWithData(res, 'Restaurant retrieval by ID successful!', restaurant);
    } catch (err) {
        // Log and handle errors
        console.error('Error from readById:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Restaurant Update Controller Function
exports.update = async (req, res) => {
    try {
        const restaurantId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(restaurantId)) {
            return apiResponse.errorResponse(res, 'Invalid Restaurant ID');
        }

        // Update the restaurant using findByIdAndUpdate
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            req.body,
            { new: true, runValidators: true }
        );

        // Check if the restaurant exists
        if (!updatedRestaurant) {
            return apiResponse.errorResponse(res, 'Restaurant not found');
        }

        // Return success response with updated restaurant data
        return apiResponse.successResponse(res, 'Restaurant update successful!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from Update:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Restaurant Delete Controller Function
exports.remove = async (req, res) => {
    try {
        const restaurantId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(restaurantId)) {
            return apiResponse.errorResponse(res, 'Invalid Restaurant ID');
        }

        // Remove the restaurant using findByIdAndRemove
        const removedRestaurant = await Restaurant.findByIdAndRemove(restaurantId);

        // Check if the restaurant exists and is successfully removed
        if (!removedRestaurant) {
            return apiResponse.errorResponse(res, 'Restaurant not found or could not be deleted');
        }

        // Return success response
        return apiResponse.successResponse(res, 'Restaurant Delete Successful!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from Delete:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


