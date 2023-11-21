const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourInfoSchema = new mongoose.Schema(
	{
		user: {
			type: ObjectId,
			ref: "User",
		},
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
			type: Number,
			required: true,
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
		tourdate: {
			type: Date,
		},
		packageOptions: {},
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
				required: true,
				trim: true,
			},
		],
		travelTips: {
			type: String,
		},
		maxGroupSize: {
			type: Number,
			required: true,
		},
		reviews: [
			{
				type: ObjectId,
				ref: "reviews",
			},
		],
		status: {
			type: String,
			default: "pending",
			enum: ["Booked", "Canceled"],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourInfo = mongoose.model("TourInfo", tourInfoSchema);
module.exports = TourInfo;
