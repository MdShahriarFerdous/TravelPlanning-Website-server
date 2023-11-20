const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({

    userId: { 
        type: String, 
        required: true 
    },
    hotelId : [{
        type : mongoose.Schema.Types.ObjectId,
        required: true
    }],
    tourId : [{
        type : mongoose.Schema.Types.ObjectId,
        required: true
    }]
    
}, 
    {
        timestamps : true,
        versionKey : false
    }
)
const bookmarkModel = mongoose.model('bookmark', bookmarkSchema);

module.exports = bookmarkModel;
