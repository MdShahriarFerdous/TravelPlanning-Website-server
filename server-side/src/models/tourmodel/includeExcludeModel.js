const mongoose = require("mongoose");

const incluAndExcluSchema = new mongoose.Schema(
	{
		tourId: {
			type: String,
			required: true,
			trim: true,
		},
		inclusions: [
			{
				type: String,
				required: true,
				trim: true,
			},
		],

		exclusions: [
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

const IncluAndExclu = mongoose.model("IncluAndExclu", incluAndExcluSchema);
module.exports = IncluAndExclu;
