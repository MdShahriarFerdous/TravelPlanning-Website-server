const mongoose = require("mongoose");

const tourBannerSchema = new mongoose.Schema(
	{
		tourMatchingCode: {
			type: String,
			required: true,
			trim: true,
		},
		locationName: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourBanner = mongoose.model("TourBanner", tourBannerSchema);
module.exports = TourBanner;
