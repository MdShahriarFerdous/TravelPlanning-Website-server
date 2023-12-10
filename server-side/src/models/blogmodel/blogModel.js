const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    tags: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      required: [true, "Blog Title is required"],
      trim: true,
      unique: true,
      minLength: [10, "Minimum Length should be 10"],
      maxLength: [50, "Maximum length should be 50"],
    },
    thumbnailImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    galleryImage: {
      type: String,
    },
    details: {
      type: String,
      default:
        "Nisl at sapien ornare convallis. Nullam rutrum commodo faucibus. Quisque ac diam in eros ultricies aliquam. Nulla volutpat ornare lectus, non elementum dolor eleifend. Fusce nec pellentesque diam. Vestibulum finibus mi at consequat. Nunc eu ipsum purus.",
      required: [true, "Blog Details is required"],
      trim: true,
      minLength: [100, "Minimum Length should be 100"],
      maxLength: [255, "Maximum length should be 255"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isGallery: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
