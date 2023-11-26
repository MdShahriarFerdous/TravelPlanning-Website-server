const mongoose = require("mongoose");

const tourThumbnailSchema = new mongoose.Schema(
	{
		tourMatchingCode: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
		},
		tourName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourThumbnail = mongoose.model("TourThumbnail", tourThumbnailSchema);
module.exports = TourThumbnail;
