const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    photo: [{
        type: String,
        trim: true
    }],
    map: {
        type: String,
        trim: true
    },
    location: {
        type: ObjectId,
        ref: 'Location',
        required: true
    },
    // Other details as needed
}, {timestamps: true, versionKey: false});

const Destination = mongoose.model('Destination', destinationSchema);


module.exports = Destination;