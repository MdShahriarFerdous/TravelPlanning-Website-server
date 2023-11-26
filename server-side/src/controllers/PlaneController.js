// Import necessary modules and dependencies
const Plane = require('../models/PlaneModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Plane Add Controller Function
exports.create = async (req, res) => {
    try {
        // Destructure variables from req.body
        const {
            airline_id,
            plane_model,
            capacity,
            manufacturing_year,
            registration_number,
            thumbnail,
            status
        } = req.body;

        // Required field validation
        const requiredFields = ['airline_id', 'plane_model', 'capacity', 'manufacturing_year', 'registration_number'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return apiResponse.errorResponse(res, `${field} is required`);
            }
        }

        // Check if the plane model and registration number are taken
        const planeExist = await Plane.findOne({ $or: [{ plane_model }, { registration_number }] });

        // Return error if the plane already exists
        if (planeExist) {
            return apiResponse.errorResponse(res, "Plane model or registration number is already taken");
        }

        // Create new Plane
        const plane = await new Plane({
            airline_id,
            plane_model,
            capacity,
            manufacturing_year,
            registration_number,
            thumbnail,
            status
        }).save();

        // Check if plane is created successfully
        if (plane) {
            return apiResponse.successResponse(res, 'Plane created successfully!');
        }

    } catch (err) {
        // Log and handle errors
        console.error("Error from create:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Plane List Controller Function
exports.list = async (req, res) => {
    try {

        // Retrieve all Planes
        // Retrieve all Planes with airline information
        const planes = await Plane.aggregate([
            {
                $lookup: {
                    from: 'airlines', // Collection name of the Plane model
                    localField: 'airline_id',
                    foreignField: '_id',
                    as: 'airlineInfo'
                }
            },
            {
                $unwind: {
                    path: '$airlineInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    plane_model: 1,
                    capacity: 1,
                    manufacturing_year: 1,
                    registration_number: 1,
                    thumbnail: 1,
                    status: 1,
                    'airlineInfo.airline_name': 1,
                    'airlineInfo.airline_code': 1,
                    'airlineInfo.email': 1,
                    'airlineInfo.phone': 1,
                    'airlineInfo.address': 1,
                }
            }
        ]);

        // Check if planes are available
        if (planes.length > 0) {
            return apiResponse.successResponseWithData(res, 'Plane retrieval Successful!', planes);
        } else {
            return apiResponse.errorResponse(res, "No plane available");
        }
    } catch (err) {
        // Log and handle errors
        console.error("Error From Read", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Plane Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        const planeId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(planeId)) {
            return apiResponse.errorResponse(res, 'Invalid Plane ID');
        }

        // Use aggregation to fetch plane data with airline information
        const plane = await Plane.aggregate([
            {
                $match: {
                    _id: new ObjectId(planeId)
                }
            },
            {
                $lookup: {
                    from: 'airlines', // Collection name of the Plane model
                    localField: 'airline_id',
                    foreignField: '_id',
                    as: 'airlineInfo'
                }
            },
            {
                $unwind: {
                    path: '$airlineInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    plane_model: 1,
                    capacity: 1,
                    manufacturing_year: 1,
                    registration_number: 1,
                    thumbnail: 1,
                    status: 1,
                    'airlineInfo.airline_name': 1,
                    'airlineInfo.airline_code': 1,
                    'airlineInfo.email': 1,
                    'airlineInfo.phone': 1,
                    'airlineInfo.address': 1,
                }
            }
        ]);

        // Check if the plane exists
        if (plane.length === 0) {
            return apiResponse.errorResponse(res, 'Plane not found');
        }

        // Return success response with plane data
        return apiResponse.successResponseWithData(res, 'Plane retrieval by ID successful!', plane[0]);
    } catch (err) {
        // Log and handle errors
        console.error('Error from readById:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Plane Update Controller Function
exports.update = async (req, res) => {
    try {
        const planeId = req.params.id; // Assuming the route parameter is named 'id'

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(planeId)) {
            return apiResponse.errorResponse(res, 'Invalid Plane ID');
        }

        // Update the plane using findByIdAndUpdate
        const updatedPlane = await Plane.findByIdAndUpdate(
            planeId,
            req.body, // Use the request body for the update
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        // Check if the plane is found and updated
        if (updatedPlane) {
            return apiResponse.successResponse(res, 'Plane update successful!');
        } else {
            return apiResponse.errorResponse(res, 'Plane not found or could not be updated');
        }
    } catch (err) {
        // Log and handle errors
        console.error('Error from Update:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Plane Delete Controller Function
exports.remove = async (req, res) => {
    try {
        const planeId = req.params.id; // Assuming the route parameter is named 'id'

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(planeId)) {
            return apiResponse.errorResponse(res, 'Invalid Plane ID');
        }

        // Remove the plane using findByIdAndRemove
        const removedPlane = await Plane.findByIdAndRemove(planeId);

        // Check if the plane is found and removed
        if (removedPlane) {
            return apiResponse.successResponse(res, 'Plane Delete Successful!');
        } else {
            return apiResponse.errorResponse(res, 'Plane not found or could not be deleted');
        }
    } catch (err) {
        // Log and handle errors
        console.error('Error from Delete:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};
