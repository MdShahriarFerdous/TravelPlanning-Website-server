const mongoose = require("mongoose");

const tourInfoSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		typeOfTour: {
			type: String,
			required: true,
			trim: true,
		},
		about: {
			type: String,
			required: true,
			trim: true,
		},
		city: {
			type: String,
			required: true,
			trim: true,
		},
		locations: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
		duration: {
			type: String,
			required: true,
			trim: true,
		},
		distance: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		price: {
			type: Number,
			required: true,
		},
		tourDate: {
			type: String,
		},
		additionalInfo: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
		maxGroupSize: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourInfo = mongoose.model("TourInfo", tourInfoSchema);
module.exports = TourInfo;
