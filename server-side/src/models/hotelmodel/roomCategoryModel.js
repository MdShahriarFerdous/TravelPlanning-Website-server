const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: ObjectId,
      ref: "Hotel",
    },
    thumb: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RoomCategory = mongoose.model("RoomCategory", roomCategorySchema);

module.exports = RoomCategory;
