const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourBookingSchema = new mongoose.Schema(
	{
		user: {
			type: ObjectId,
			ref: "User",
		},
		tourInfoId: {
			type: ObjectId,
			ref: "TourInfo",
		},
		bookingDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourBooking = mongoose.model("TourBooking", tourBookingSchema);
module.exports = TourBooking;
