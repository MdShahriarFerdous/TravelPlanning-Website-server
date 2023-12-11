const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel Name is required"],
      trim: true,
      unique: true,
      minLength: [3, "Minimum Length should be 3"],
      maxLength: [50, "Maximum length should be 50"],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      index: true,
      required: true,
    },
    rentPerPerson: {
      type: Number,
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
