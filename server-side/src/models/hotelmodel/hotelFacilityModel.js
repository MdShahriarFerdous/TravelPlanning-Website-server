const mongoose = require("mongoose");

const hotelFacilitySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
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

const HotelFacility = mongoose.model("HotelFacility", hotelFacilitySchema);

module.exports = HotelFacility;
