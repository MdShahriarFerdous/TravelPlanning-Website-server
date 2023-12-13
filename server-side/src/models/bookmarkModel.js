const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({

    userId: { 
        type: String, 
        required: true,
        ref: "User" 
    },
    hotelId : [{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Hotel" 
    }],
    tourId : [{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TourInfo" 
    }]
    
}, 
    {
        timestamps : true,
        versionKey : false
    }
)
const bookmarkModel = mongoose.model('bookmark', bookmarkSchema);

module.exports = bookmarkModel;
