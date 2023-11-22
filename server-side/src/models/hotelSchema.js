const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    // location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Assuming a user is required for a hotel
    },
    name: { type: String, required: true, index: true },
    city: {
        type: String,
        required: true // Making city a mandatory field
    },
    room_rent: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    status: {type: String, required: true,index: true,
        enum: ['available for booking', 'not available for booking']
    }
}, {
    timestamps: true,
    versionKey: false,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;