// Import necessary modules and dependencies
const FlightBooking = require('../models/FlightBookingModel');
const apiResponse = require('../helpers/apiResponse');
const { ObjectId } = require('mongoose').Types;

// Flight Booking Add Controller Function
exports.create = async (req, res) => {
    try {

        // Destructure variables from req.body
        const {
            flight_id,
            created_by,
            first_name,
            last_name,
            phone,
            nationality,
            seats
        } = req.body;

        // Required field validation
        const requiredFields = ['flight_id', 'created_by', 'first_name', 'last_name', 'phone', 'nationality', 'seats'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return apiResponse.errorResponse(res, `${field} is required`);
            }
        }

        // Create a new flight booking
        const newBooking = await new FlightBooking({
            flight_id,
            created_by,
            first_name,
            last_name,
            phone,
            nationality,
            seats
        }).save();
        
        // Check if flight booking is created successfully
        if (newBooking) {
            return apiResponse.successResponse(res, 'Flight Booking successful!');
        }

    } catch (err) {
        // Log and handle errors
        console.error("Error from create:", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};

// Flight Booking List Controller Function
exports.list = async (req, res) => {
    try {
        const flightBookings = await FlightBooking.aggregate([
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight_id',
                    foreignField: '_id',
                    as: 'flightInfo',
                },
            },
            // {
            //     $lookup: {
            //         from: 'users',
            //         localField: 'created_by',
            //         foreignField: '_id',
            //         as: 'userInfo',
            //     },
            // },
            {
                $unwind: '$flightInfo',
            },
            // {
            //     $unwind: '$userInfo',
            // },
            {
                $project: {
                    _id: 1,
                    flight_id: 1,
                    created_by: 1,
                    first_name: 1,
                    last_name: 1,
                    phone: 1,
                    nationality: 1,
                    seats: 1,
                    status: 1,
                    'flightInfo.flight_number': 1,
                    'flightInfo.journey_date': 1,
                    // 'userInfo.username': 1,
                    // 'userInfo.email': 1,
                },
            },
        ]);

        // Check if flight bookings are available
        if (flightBookings.length > 0) {
            return apiResponse.successResponseWithData(res, 'Flight Booking retrieval successful!', flightBookings);
        } else {
            return apiResponse.errorResponse(res, 'No flight booking available');
        }
    } catch (err) {
        // Log and handle errors
        console.error('Error from list:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Flight Booking Read by ID Controller Function
exports.readById = async (req, res) => {
    try {
        const flightBookingId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(flightBookingId)) {
            return apiResponse.errorResponse(res, 'Invalid Flight Booking ID');
        }

        // Use aggregation to fetch flight booking data with related information
        const flightBooking = await FlightBooking.aggregate([
            {
                $match: {
                    _id: new ObjectId(flightBookingId),
                },
            },
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight_id',
                    foreignField: '_id',
                    as: 'flightInfo',
                },
            },
            // {
            //     $lookup: {
            //         from: 'users',
            //         localField: 'created_by',
            //         foreignField: '_id',
            //         as: 'userInfo',
            //     },
            // },
            {
                $unwind: '$flightInfo',
            },
            // {
            //     $unwind: '$userInfo',
            // },
            {
                $project: {
                    _id: 1,
                    flight_id: 1,
                    created_by: 1,
                    first_name: 1,
                    last_name: 1,
                    phone: 1,
                    nationality: 1,
                    seats: 1,
                    journey_date: 1,
                    return_date: 1,
                    status: 1,
                    'flightInfo.flight_number': 1,
                    'flightInfo.journey_date': 1,
                    // 'userInfo.username': 1,
                    // 'userInfo.email': 1,
                },
            },
        ]);

        // Check if the flight booking exists
        if (flightBooking.length === 0) {
            return apiResponse.errorResponse(res, 'Flight Booking not found');
        }

        // Return success response with flight booking data
        return apiResponse.successResponseWithData(res, 'Flight Booking retrieval by ID successful!', flightBooking[0]);
    } catch (err) {
        // Log and handle errors
        console.error('Error from readById:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Flight Booking Update Controller Function
exports.update = async (req, res) => {
    try {
        const flightBookingId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(flightBookingId)) {
            return apiResponse.errorResponse(res, 'Invalid Flight Booking ID');
        }

        // Update the flight booking
        const updatedFlightBooking = await FlightBooking.findByIdAndUpdate(
            flightBookingId,
            req.body,
            { new: true }
        );

        // Check if the flight booking is found and updated
        if (updatedFlightBooking) {
            return apiResponse.successResponse(res, 'Flight Booking update successful!');
        } else {
            return apiResponse.errorResponse(res, 'Flight Booking not found or could not be updated');
        }
    } catch (err) {
        // Log and handle errors
        console.error('Error from Update:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


// Flight Booking Delete Controller Function
exports.remove = async (req, res) => {
    try {
        const flightBookingId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(flightBookingId)) {
            return apiResponse.errorResponse(res, 'Invalid Flight Booking ID');
        }

        // Remove the flight booking
        const removedFlightBooking = await FlightBooking.findByIdAndRemove(flightBookingId);

        // Check if the flight booking is found and removed
        if (removedFlightBooking) {
            return apiResponse.successResponse(res, 'Flight Booking Delete Successful!');
        } else {
            return apiResponse.errorResponse(res, 'Flight Booking not found or could not be deleted');
        }
    } catch (err) {
        // Log and handle errors
        console.error('Error from Delete:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};

// Flight Booking Cancel Controller Function
exports.cancelBooking = async (req, res) => {
    try {
        const flightBookingId = req.params.id;

        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(flightBookingId)) {
            return apiResponse.errorResponse(res, 'Invalid Flight Booking ID');
        }

        // Find the flight booking by ID
        const flightBooking = await FlightBooking.findById(flightBookingId);

        // Check if the flight booking exists
        if (!flightBooking) {
            return apiResponse.errorResponse(res, 'Flight Booking not found');
        }

        // Check if the flight booking is already canceled
        if (flightBooking.status === 'canceled') {
            return apiResponse.errorResponse(res, 'Flight Booking is already canceled');
        }

        // Update the status to 'canceled'
        flightBooking.status = 'canceled';

        // Save the updated flight booking
        await flightBooking.save();

        // Return success response
        return apiResponse.successResponse(res, 'Flight Booking canceled successfully!');
    } catch (err) {
        // Log and handle errors
        console.error('Error from cancelBooking:', err.message);
        return apiResponse.errorResponse(res, 'Something went wrong');
    }
};


