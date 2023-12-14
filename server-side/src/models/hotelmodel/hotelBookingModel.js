const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    roomSubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomSubCategory",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
      //   default: Date.now,
    },
    checkOut: {
      type: Date,
      required: true,
      //   default: Date.now,
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

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
