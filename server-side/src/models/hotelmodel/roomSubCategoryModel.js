const mongoose = require("mongoose");

const roomSubCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomCategory",
      required: true,
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
    rentPerPerson: {
      type: Number,
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

const RoomSubCategory = mongoose.model(
  "RoomSubCategory",
  roomSubCategorySchema
);

module.exports = RoomSubCategory;
