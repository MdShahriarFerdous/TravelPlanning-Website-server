const mongoose = require("mongoose");

const tourTipSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		thingsCandDo: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
		thingsToAvoid: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourTip = mongoose.model("TourTip", tourTipSchema);
module.exports = TourTip;
