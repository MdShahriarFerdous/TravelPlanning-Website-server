const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            image: String
        }
    ],
    pricePerNight: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    guestCapacity: {
        type: Number,
        required: true,
    },
    numOfBeds: {
        type: Number,
        required: true,
    },
    internet: {
        type: Boolean,
        default: false,
    },
    breakfast: {
        type: Boolean,
        default: false,
    },
    airConditioned: {
        type: Boolean,
        default: false,
    },
    petsAllowed: {
        type: Boolean,
        default: false
    },
    roomCleaning: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        enum: ['King', 'Single', 'Twins']
    },
    pricePerNightKing: {
        type: Number,

    },
    pricePerNightSingle: {
        type: Number,

    },
    pricePerNightTwins: {
        type: Number,

    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    numberOfNights: {
        type: Number, // Modify this according to your application's requirements
        default: 1, // Default value if not provided
        required: true // Adjust this based on your needs
    }
}, {
    timestamps: true,
    versionKey:false
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
