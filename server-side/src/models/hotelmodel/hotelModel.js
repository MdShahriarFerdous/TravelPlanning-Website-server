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
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      index: true,
      required: true,
    },
    rentPerPerson: {
      type: Number,
      default: 0,
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
    // if at least 1 room left, this won't update
    // it will update only if a no rooms left
    // when 0 rooms left it will available on the next date of
    // hotel booking last check out date
    availableFrom: {
      type: Date,
      default: "2023-12-14",
    },
    availableRooms: {
      type: Number,
      default: 60,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer.',
      },
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
