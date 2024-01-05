const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema(
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
    roomSubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomSubCategory",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    nationality: {
      type: String,
      trim: true,
      required: true,
    },
    nid: {
      type: String,
      trim: true,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    guestsInfo: {
      type: Object,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Date,
      default: Date.now,
    },
    checkOut: {
      type: Date,
      default: Date.now,
    },
    rentPerGuest: {
      type: String,
      required: true,
    },
    totalCost: {
      type: String,
      required: true,
    },
    additional: {
      type: Object,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled", "failed"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
