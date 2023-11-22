const mongoose = require("mongoose");

const vehiclePriceSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			trim: true,
			required: true,
		},
		vehicle1Name: {
			type: String,
			default: "N/A",
		},
		vehicle1Price: {
			type: Number,
			required: true,
			default: 0,
		},
		vehicle2Name: {
			type: String,
			default: "N/A",
		},
		vehicle2Price: {
			type: Number,
			required: true,
			default: 0,
		},
		vehicle3Name: {
			type: String,
			default: "N/A",
		},
		vehicle3Price: {
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

const VehiclePrice = mongoose.model("VehiclePrice", vehiclePriceSchema);
module.exports = VehiclePrice;
