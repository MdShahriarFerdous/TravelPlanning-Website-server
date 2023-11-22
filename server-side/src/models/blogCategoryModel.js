const mongoose = require("mongoose");

const blogCategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      default: "Technology",
      required: [true, "Blog Category Title is required"],
      trim: true,
      minLength: [3, "Minimum Length should be 3"],
      maxLength: [10, "Maximum length should be 10"],
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

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
module.exports = BlogCategory;
