const mongoose = require("mongoose");

const packageOptionSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		packageName: {
			type: String,
			required: true,
			trim: true,
		},
		packageDetails: {
			type: String,
			required: true,
			trim: true,
		},
		packagePrice: {
			type: Number,
			default: 0,
		},
		vehicleDetails: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const PackageOption = mongoose.model("PackageOption", packageOptionSchema);
module.exports = PackageOption;
