const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
    airline_name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        trim: true
    },
    airline_code: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    address: {
        type: String,
        trim: true,
    },
}, {timestamps: true, versionKey: false});

const Airline = mongoose.model("Airline", airlineSchema);

module.exports = Airline;