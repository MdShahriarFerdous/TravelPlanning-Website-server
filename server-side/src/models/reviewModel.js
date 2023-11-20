const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    comment: { type: String },
    rating: { type: Number },
    status: { type: Boolean, default: true },
    // Relation with User collection
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;
