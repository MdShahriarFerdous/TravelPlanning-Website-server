const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourBookingSchema = new mongoose.Schema(
	{
		tourInfoId: {
			type: ObjectId,
			ref: "TourInfo",
		},
		userProfileId: {
			type: ObjectId,
			ref: "UserProfile",
		},
		numberOfPerson: {
			type: Number,
			required: true,
		},
		bookingDate: {
			type: Date,
			default: Date.now,
		},
		startTourDate: {
			type: Date,
		},
		status: {
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
