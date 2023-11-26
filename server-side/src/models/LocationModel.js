const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    location_name: {
        type: String,
        required: true,
        unique: true
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
