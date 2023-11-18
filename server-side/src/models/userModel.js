const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "User Name is required"],
			trim: true,
			minLength: [6, "Minimum Length should be 6"],
			maxLength: [12, "Maximum length should be 12"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: function (value) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
						value
					);
				},
				message: "Given Email is not valid",
			},
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [6, "Password Length should be atleast 6 characters"],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
