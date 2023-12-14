const mongoose = require("mongoose");

const roomSubCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    title: {
      type: String,
      required: true,
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    facilities: {
      type: [String],
      default: [],
    },
    roomRentPerNight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RoomSubCategory = mongoose.model(
  "RoomSubCategory",
  roomSubCategorySchema
);

module.exports = RoomSubCategory;
