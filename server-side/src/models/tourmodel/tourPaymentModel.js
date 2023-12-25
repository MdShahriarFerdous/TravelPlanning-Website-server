const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tourPaymentSchema = new mongoose.Schema(
	{
		bookingId: {
			type: ObjectId,
			ref: "TourBooking",
		},
		issued_by: {
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
		currency: {
			type: String,
			default: "BDT",
		},
		transactionId: {
			type: String,
			trim: true,
			default: "N/A",
		},
		cus_firstName: {
			type: String,
			trim: true,
		},
		cus_lastName: {
			type: String,
			trim: true,
		},
		cus_mail: {
			type: String,
			trim: true,
		},
		cus_gender: {
			type: String,
			trim: true,
		},
		cus_phoneNumber: {
			type: String,
			trim: true,
		},
		paymentAmount: {
			type: Number,
			required: true,
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

const TourPayment = mongoose.model("TourPayment", tourPaymentSchema);
module.exports = TourPayment;
