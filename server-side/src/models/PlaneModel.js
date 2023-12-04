const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const planeSchema = new mongoose.Schema({
    airline_id: {
        type: ObjectId,
        ref: "Airline",
        required: true
    },
    plane_model: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    manufacturing_year: {
        type: Number,
        required: true
    },
    registration_number: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    thumbnail: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false});

const Plane = mongoose.model("Plane", planeSchema);

module.exports = Plane;