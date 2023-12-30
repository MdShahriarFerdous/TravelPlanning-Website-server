const Hotel = require("../../models/hotelmodel/hotelModel");
const RoomCategory = require("../../models/hotelmodel/roomCategoryModel");
const { cloudinaryFolder } = require("../../../secrets");
const cloudinary = require("../../helpers/cloudinaryConfig");
const { ObjectId } = require("mongoose").Types;
const RoomSubCategory = require("../../models/hotelmodel/roomSubCategoryModel");

const roomCategoryController = {
  // create a Hotel Room Category
  create: async (req, res, next) => {
    try {
      const { hotelId, thumbnailLink, name, shortDesc, features, roomSize } =
        req.body;

      // Check if Hotel exists
      const hotel = await Hotel.findOne({ _id: hotelId });
      if (!hotel) {
        return res.json({
          error: "Hotel Not Found",
        });
      }

      // Check if Hotel Room Category description is between 100 - 255 characters
      if (shortDesc && (shortDesc.length > 400 || shortDesc.length < 250)) {
        return res.json({
          error:
            "Hotel Room Category description must be in between 250 - 400 characters",
        });
      }

      // Check if given string value is a Number, after parsing
      const size = Number(roomSize);
      if (isNaN(size)) {
        return res.json({
          error: "Room Category Size Must be a Number !",
        });
      }

      // Features Validation
      if (!features) {
        return res.json({
          error: "Please Provide at least 1 feature of this Room Category",
        });
      }
      const featuresList = features.split(",");

      // Room Category Name Validation
      if (!name) {
        return res.json({
          error: "Please Provide a Name for the Room Category",
        });
      }

      // Room Category thumbnail validation
      let thumb = thumbnailLink;
      const { path, size: imageSize } = req.file || {};
      if (imageSize && imageSize > 1000000) {
        return res.json({
          error: "Hotel Room Category Image should be less than 1mb in size",
        });
      }
      if (path) {
        const uploadToCloudinary = await cloudinary.uploader.upload(path, {
          folder: `${cloudinaryFolder}/hotel/room/category`,
        });
        thumb = uploadToCloudinary.secure_url;
      } else {
        if (!thumbnailLink) {
          return res.json({
            error:
              "Please Provide a Link Or Upload a Hotel Room Category Image",
          });
        }
      }

      // if all Room Category validation passed
      const hotelRoomCategory = await RoomCategory.create({
        hotelId,
        thumbnail: thumb,
        name,
        shortDesc,
        features: featuresList,
        roomSize: Number(size.toFixed(2)),
      });

      // generate response
      res.status(200).json({
        status: "Success",
        message: `Hotel Room Category: '${name}' Successfully Created`,
        data: hotelRoomCategory,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // delete All Hotel Room Categories
  deleteAll: async (req, res, next) => {
    try {
      await RoomCategory.deleteMany({});
      res.status(200).json({
        status: "Success",
        message: "All Hotel Room Categories Deleted",
        data: [],
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // List Hotel Room Cateogries for a particular hotel
  list: async (req, res, next) => {
    try {
      const { hotelId } = req.query || {};
      let categories = [];
      if (hotelId) {
        // Validate if the provided ID is a valid ObjectId (MongoDB ID)
        if (!ObjectId.isValid(hotelId)) {
          return res.json({
            error: "Invalid Hotel ID",
          });
        }
        const categoriesWithSubcategories = await RoomCategory.find({
          hotelId,
          status: true,
        }).lean();
        for (const category of categoriesWithSubcategories) {
          category.subCategories = await RoomSubCategory.find({
            roomCategoryId: category._id,
            status: true,
          }).lean();
        }
        categories = categoriesWithSubcategories;
      } else {
        const categoriesWithSubcategories = await RoomCategory.find({
          status: true,
        }).lean();
        for (const category of categoriesWithSubcategories) {
          category.subCategories = await RoomSubCategory.find({
            roomCategoryId: category._id,
            status: true,
          }).lean();
        }
        categories = categoriesWithSubcategories;
      }
      return res.status(200).json({ categories });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = roomCategoryController;
