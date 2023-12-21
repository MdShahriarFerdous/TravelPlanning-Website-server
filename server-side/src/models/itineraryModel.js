const mongoose = require("mongoose");

const itinerarySchema = mongoose.Schema(
  {
    duration: Number,
    location_name: String,
    latitude: Number,
    longitude: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const itineraryModel = mongoose.model("itineraryWishList", itinerarySchema);
module.exports = itineraryModel;
