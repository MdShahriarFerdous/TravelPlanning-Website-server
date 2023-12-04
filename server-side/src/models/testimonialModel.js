const mongoose = require("mongoose");

const testimonialSchema = mongoose.Schema(
  {
    comment: String,
    image: String,
    rating_star: Number,
    name: String,
    designation: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const testimonialModel = mongoose.model("testimonial", testimonialSchema);

module.exports = testimonialModel;
