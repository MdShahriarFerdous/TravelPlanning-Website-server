const mongoose = require("mongoose");

const tourTypeCardSchema = new mongoose.Schema(
	{
		tourType: {
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

const TourTypeCard = mongoose.model("TourTypeCard", tourTypeCardSchema);
module.exports = TourTypeCard;
