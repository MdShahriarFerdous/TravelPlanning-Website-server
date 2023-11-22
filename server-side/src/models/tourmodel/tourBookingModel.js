const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourBookingSchema = new mongoose.Schema(
	{
		userId: {
			type: ObjectId,
			ref: "User",
		},
		tourInfoId: {
			type: ObjectId,
			ref: "TourInfo",
		},
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		packageName: {
			type: String,
			trim: true,
		},
		bookingDate: {
			type: Date,
			default: Date.now,
		},
		journeyDate: {
			type: Date,
		},
		adultParticipants: {
			type: Number,
			required: true,
			default: 1,
		},
		childrenParticipants: {
			type: Number,
			required: true,
			default: 0,
		},
		vehicleOption: {
			type: String,
			trim: true,
		},
		bookingStatus: {
			type: String,
			default: "Pending",
		},
		totalToPay: {
			type: Number,
		},
		paymentStatus: {
			type: String,
			default: "Pending",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourBooking = mongoose.model("TourBooking", tourBookingSchema);
module.exports = TourBooking;
