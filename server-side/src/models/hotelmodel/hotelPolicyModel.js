const mongoose = require("mongoose");

const hotelPolicySchema = new mongoose.Schema(
  {
    hotelId: {
      type: ObjectId,
      ref: "Hotel",
    },
    title: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HotelPolicy = mongoose.model("HotelPolicy", hotelPolicySchema);

module.exports = HotelPolicy;
