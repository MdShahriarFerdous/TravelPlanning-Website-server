const mongoose = require("mongoose");

const tourReviewSchema = mongoose.Schema(
	{
		user: { 
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		tourInfoId: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: "TourInfo"
		},
		tourId: { 
			type: String, 
			trim: true
		}, //it is the matching code (Italy1)
		comment: { 
			type: String 
		},
		rating: { 
			type: Number 
		},
		status: { 
			type: Boolean, 
			default: true 
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourReview = mongoose.model("TourReview", tourReviewSchema);

module.exports = TourReview;
