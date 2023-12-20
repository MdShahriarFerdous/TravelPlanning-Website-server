const mongoose = require("mongoose");

const hotelInfoSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    address: {
      type: String,
      required: true,
    },
    about1: {
      type: String,
      required: true,
    },
    about2: {
      type: String,
    },
    establishYear: {
      type: Number,
      required: true,
    },
    renovationYear: {
      type: Number,
      required: true,
    },
    floors: {
      type: Number,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    bars: {
      type: Number,
      required: true,
    },
    staff: {
      type: Number,
      required: true,
    },
    branch: {
      type: Number,
      required: true,
    },
    googleMap: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HotelInfo = mongoose.model("HotelInfo", hotelInfoSchema);

module.exports = HotelInfo;
