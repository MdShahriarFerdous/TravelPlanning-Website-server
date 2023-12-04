const mongoose = require("mongoose");
const { defaultImagePath } = require("../../../secrets");
const { ObjectId } = mongoose.Schema;

const userProfileSchema = new mongoose.Schema(
	{
		user: {
			type: ObjectId,
			ref: "User",
		},
		city: {
			type: String,
			trim: true,
		},
		bio: {
			type: String,
			trim: true,
			maxLength: [120, "Maximum length should be 120"],
		},
		image: {
			type: String,
			default: defaultImagePath,
		},
		phone: {
			type: String,
			trim: true,
			default: "xxx-xxx-xxx-xx",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
