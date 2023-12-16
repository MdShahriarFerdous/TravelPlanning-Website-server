const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const flightBookingSchema = new mongoose.Schema({
    flight_id: {
        type: ObjectId,
        ref: "flights",
        required: true
    },
    created_by: {
        type: ObjectId,
        ref: "users",
        required: true
    },
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    nationality: {
        type: String,
        trim: true,
        required: true
    },
    nid: {
        type: String,
        trim: true,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    total_fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending'
    }
}, {timestamps: true, versionKey: false});

const FlightBooking = mongoose.model("FlightBooking", flightBookingSchema);

module.exports = FlightBooking;