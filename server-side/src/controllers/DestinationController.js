// Import necessary modules and dependencies
const Destination = require('../models/DestinationModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Destination Add Controller Function
exports.create = async (req, res) => {
    try {
        // Destructure variables from req.body
        const { name, description, photo, location, map } = req.body;

        // Required field validation
        const requiredFields = ['name', 'location'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return apiResponse.errorResponse(res, `${field} is required`);
            }
        }

        // Create a new destination
        const newDestination = await new Destination({
            name,
            description,
            photo,
            location,
            map
        }).save();

        // Check if the destination is created successfully
        if (newDestination) {
            return apiResponse.successResponse(res, 'Destination created successfully!');
        } else {
            return apiResponse.errorResponse(res, 'Failed to create destination');
        }
    } catch (err) {
        // Log and handle errors
        console.error("Error from create:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Destination List Controller Function
exports.list = async (req, res) => {
    try {
        // Perform aggregation to get details from the Location table
        const destinations = await Destination.aggregate([
            {
                $lookup: {
                    from: 'locations', // Collection name of the Location model
                    localField: 'location',
                    foreignField: '_id',
                    as: 'locationInfo',
                },
            },
            {
                $unwind: '$locationInfo',
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    photo: 1,
                    'locationInfo.location_name': 1,
                    'locationInfo.latitude': 1,
                    'locationInfo.longitude': 1,
                },
            },
        ]);

        // Check if destinations are available
        if (destinations.length > 0) {
            return apiResponse.successResponseWithData(res, 'Destination retrieval Successful!', destinations);
        } else {
            return apiResponse.errorResponse(res, 'No destinations available');
        }
    } catch (err) {
        // Log and handle errors
        console.error('Error From Read', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Destination Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        const destinationId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(destinationId)) {
            return apiResponse.errorResponse(res, 'Invalid Destination ID');
        }

        // Use aggregation to fetch destination data with location, hotels, places, and restaurants information
        const destination = await Destination.aggregate([
            {
                $match: {
                    _id: new ObjectId(destinationId),
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'locationInfo',
                },
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: 'location',
                    foreignField: 'location',
                    as: 'hotels',
                },
            },
            {
                $lookup: {
                    from: 'places',
                    localField: 'location',
                    foreignField: 'location',
                    as: 'places',
                },
            },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'location',
                    foreignField: 'location',
                    as: 'restaurants',
                },
            },
            {
                $unwind: '$locationInfo',
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    photo: 1,
                    map: 1,
                    'locationInfo.location_name': 1,
                    'locationInfo.latitude': 1,
                    'locationInfo.longitude': 1,
                    hotels: 1,
                    places: 1,
                    restaurants: 1,
                },
            },
        ]);

        // Check if the destination exists
        if (destination.length === 0) {
            return apiResponse.errorResponse(res, 'Destination not found');
        }

        // Return success response with destination data
        return apiResponse.successResponseWithData(res, 'Destination retrieval by ID successful!', destination[0]);
    } catch (err) {
        // Log and handle errors
        console.error('Error from readById:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Destination Update Controller Function
exports.update = async (req, res) => {
    try {
        const destinationId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(destinationId)) {
            return apiResponse.errorResponse(res, 'Invalid Destination ID');
        }

        // Update the destination using findByIdAndUpdate
        const updatedDestination = await Destination.findByIdAndUpdate(
            destinationId,
            req.body,
            { new: true, runValidators: true }
        );

        // Check if the destination exists
        if (!updatedDestination) {
            return apiResponse.errorResponse(res, 'Destination not found');
        }

        // Return success response with updated destination data
        return apiResponse.successResponse(res, 'Destination update successful!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from Update:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Destination Delete Controller Function
exports.remove = async (req, res) => {
    try {
        const destinationId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!mongoose.Types.ObjectId.isValid(destinationId)) {
            return apiResponse.errorResponse(res, 'Invalid Destination ID');
        }

        // Delete the destination using findByIdAndDelete
        const deletedDestination = await Destination.findByIdAndDelete(destinationId);

        // Check if the destination exists
        if (!deletedDestination) {
            return apiResponse.errorResponse(res, 'Destination not found');
        }

        // Return success response with deleted destination data
        return apiResponse.successResponse(res, 'Destination deleted successfully!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from Delete:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Top Destination Controller Function
exports.getTopDestinations = async (req, res) => {
    try {
        const topDestinations = await Destination.aggregate([
            {
                $lookup: {
                    from: 'places',
                    localField: 'location',
                    foreignField: 'location',
                    as: 'places',
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    photo: 1,
                    placeCount: { $size: '$places' },
                },
            },
            {
                $sort: { placeCount: -1 },
            },
            {
                $limit: 10,
            },
        ]);

        // Check if there are top destinations
        if (topDestinations.length === 0) {
            return apiResponse.errorResponse(res, 'No top destinations found');
        }

        // Return success response with top destinations data
        return apiResponse.successResponseWithData(res, 'Top 10 Destinations retrieval successful!', topDestinations);
    } catch (err) {
        // Log and handle errors
        console.error('Error from getTopDestinations:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

