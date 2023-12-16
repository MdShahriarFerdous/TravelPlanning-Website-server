const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    thumbnail: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    roomSize: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
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

const RoomCategory = mongoose.model("RoomCategory", roomCategorySchema);

module.exports = RoomCategory;
