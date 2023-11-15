const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    commment: { type: String },
    rating: { type: Number },
    status: { type: Boolean, default: true },
    user: { type: String },
    // When user collection will be define, comment out the below line and comment the above line
    //   user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;
