const mongoose = require("mongoose");

const tourReviewSchema = mongoose.Schema(
	{
		tourInfoId: { type: mongoose.Schema.Types.ObjectId, ref: "TourInfo" },
		tourId: { type: String, trim: true, required: true }, //it is the matching code (Italy1)
		comment: { type: String },
		rating: { type: Number },
		status: { type: Boolean, default: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourReview = mongoose.model("TourReview", tourReviewSchema);

module.exports = TourReview;
