const mongoose = require("mongoose");

const historicalPlacesSchema = mongoose.Schema(
  {
    name: String,
    location: { type: mongoose.Schema.Types.ObjectId, ref: "locations" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const historicalPlacesModel = mongoose.model("HistoricalPlaces", historicalPlacesSchema);

module.exports = historicalPlacesModel;
