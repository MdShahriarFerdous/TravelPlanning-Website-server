const mongoose = require("mongoose");

const hotelReviewSchema = new mongoose.Schema(
  {
    hotelId: {
      type: ObjectId,
      ref: "Hotel",
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
    reviewTitle: {
      type: String,
      required: true,
    },
    reviewComment: {
      type: String,
      required: true,
    },
    serviceRating: {
      required: true,
      type: Number,
      min: 0,
      max: 5,
    },
    accomodationRating: {
      required: true,
      type: Number,
      min: 0,
      max: 5,
    },
    locationRating: {
      required: true,
      type: Number,
      min: 0,
      max: 5,
    },
    priceRating: {
      required: true,
      type: Number,
      min: 0,
      max: 5,
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

const HotelReview = mongoose.model("HotelReview", hotelReviewSchema);

module.exports = HotelReview;
