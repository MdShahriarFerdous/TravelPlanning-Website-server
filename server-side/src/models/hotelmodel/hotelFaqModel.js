const mongoose = require("mongoose");

const hotelFaqSchema = new mongoose.Schema(
  {
    hotelId: {
      type: ObjectId,
      ref: "Hotel",
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const hotelFaq = mongoose.model("HotelFaq", hotelFaqSchema);

module.exports = hotelFaq;
