const mongoose = require("mongoose");

const tourThumbnailSchema = new mongoose.Schema(
	{
		tourInfoId: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
			trim: true,
		},
		locationName: {
			type: String,
			required: true,
			trim: true,
		},
		tourTitle: {
			type: String,
			required: true,
			trim: true,
		},
		durations: {
			type: String,
			required: true,
			trim: true,
		},
		peopleSize: {
			type: Number,
			required: true,
		},
		ratings: {
			type: Number,
			min: 1,
			max: 5,
		},
		reviewsCount: {
			type: Number,
		},
		price: {
			type: Number,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourThumbnail = mongoose.model("TourThumbnail", tourThumbnailSchema);
module.exports = TourThumbnail;
