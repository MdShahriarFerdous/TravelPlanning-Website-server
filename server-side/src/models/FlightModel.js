const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const flightSchema = new mongoose.Schema({
    flight_number: {
        type: String,
        required: true,
        unique: true
    },
    plane_id: {
        type: ObjectId,
        ref: "Plane",
        required: true
    },
    source_destination_id: {
        type: ObjectId,
        ref: "Location",
        required: true
    },
    destination_id: {
        type: ObjectId,
        ref: "Location",
        required: true
    },
    journey_date: {
        type: Date,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    seatLeft: {
        type: Number,
        required: true
    },
    departure_time: {
        type: String,
        trim: true,
        required: true
    },
    arrival_time: {
        type: String,
        trim: true,
        required: true
    },
    flight_class: {
        type: String,
        enum: ['economy', 'business'],
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;