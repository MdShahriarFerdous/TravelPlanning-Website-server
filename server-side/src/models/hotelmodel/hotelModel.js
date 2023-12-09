const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      index: true,
      required: true,
    },
    rentPerPerson: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
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

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
