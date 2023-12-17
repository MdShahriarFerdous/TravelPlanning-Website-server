const mongoose = require("mongoose");

const flightReviewSchema = mongoose.Schema(
	{
		flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
		comment: { type: String },
		rating: { type: Number },
		status: { type: Boolean, default: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const FlightReview = mongoose.model("FlightReview", flightReviewSchema);

module.exports = FlightReview;
