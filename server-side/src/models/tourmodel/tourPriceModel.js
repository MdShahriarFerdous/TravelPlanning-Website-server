const mongoose = require("mongoose");

const tourPersonPriceSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			trim: true,
			required: true,
		},
		packageName: {
			type: String,
			trim: true,
			required: true,
		},
		adultPay: {
			type: Number,
			required: true,
			default: 0,
		},
		childrenPay: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const TourPersonPrice = mongoose.model(
	"TourPersonPrice",
	tourPersonPriceSchema
);
module.exports = TourPersonPrice;
