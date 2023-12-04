const mongoose = require("mongoose");

const tourFoodSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		dayNo: {
			type: Number,
			required: true,
		},
		breakfast: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
		lunch: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],
		dinner: [
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

const TourFood = mongoose.model("TourFood", tourFoodSchema);
module.exports = TourFood;
