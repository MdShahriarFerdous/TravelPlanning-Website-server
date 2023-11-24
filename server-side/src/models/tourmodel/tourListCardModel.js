const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourListCardSchema = new mongoose.Schema(
	{
		tourInfoId: {
			type: ObjectId,
			ref: "TourInfo",
			unique: true,
		},
		tourMatchingCode: {
			type: String,
			required: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
		},
		locationName: {
			type: String,
			required: true,
			trim: true,
		},
		startingPrice: {
			type: Number,
			default: 0,
		},
		durations: {
			type: String,
			required: true,
			trim: true,
		},
		maxPeople: {
			type: String,
			required: true,
			trim: true,
		},
		notes: {
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

const TourListCard = mongoose.model("TourListCard", tourListCardSchema);
module.exports = TourListCard;
