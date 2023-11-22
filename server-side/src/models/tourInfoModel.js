const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourInfoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		city: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		distance: {
			type: String,
			required: true,
			trim: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		desc: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		timing: {
			type: String,
			required: true,
			trim: true,
		},
		stayingLocation: {
			type: String,
			trim: true,
			required: true,
		},
		inclusions: [
			{
				type: String,
			},
		],
		exclusions: [
			{
				type: String,
			},
		],
		additionalInfo: [
			{
				type: String,
			},
		],
		reviews: [
			{
				type: ObjectId,
				ref: "reviews",
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);
const TourInfo = mongoose.model("TourInfo", tourInfoSchema);
module.exports = TourInfo;
