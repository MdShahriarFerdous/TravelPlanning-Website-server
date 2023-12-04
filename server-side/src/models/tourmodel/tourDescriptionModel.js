const mongoose = require("mongoose");

const tourDescriptionSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		details: {
			type: String,
			required: true,
			trim: true,
		},
		coveredLocations: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
		premiumResorts: {
			type: String,
			required: true,
			trim: true,
		},
		economyResorts: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourDescription = mongoose.model(
	"TourDescription",
	tourDescriptionSchema
);
module.exports = TourDescription;
