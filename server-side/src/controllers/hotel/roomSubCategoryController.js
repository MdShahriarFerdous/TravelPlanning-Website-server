const RoomCategory = require("../../models/hotelmodel/roomCategoryModel");
const RoomSubCategory = require("../../models/hotelmodel/roomSubCategoryModel");
const { ObjectId } = require("mongoose").Types;
const {
  updateSrcCloudinary,
  deleteSrcCloudinary,
} = require("../../utilities/updateCloudinaryImage");
const roomSubCategoryController = {
  // create a Hotel Room Sub Category
  create: async (req, res, next) => {
    try {
      const {
        hotelId,
        roomCategoryId,
        title,
        keyFeatures,
        facilities,
        rentPerPerson,
      } = req.body;

      // Check if Hotel & Hotel Room Sub Category exists
      const response = await RoomCategory.findOne({
        _id: roomCategoryId,
        hotelId,
      });
      if (!response) {
        return res.json({
          error: "Hotel Or Room Category Does Not Exist",
        });
      }

      // Check if given string value is a decimal, after pasing
      const rent = Number(rentPerPerson);
      if (isNaN(rent)) {
        return res.json({
          error: "Room Rent Per Night Must be a Number",
        });
      }

      // Key Features Validation
      if (!keyFeatures) {
        return res.json({
          error:
            "Please Provide at least 1 key Feature of this Room Sub Category",
        });
      }
      const keyFeaturesList = keyFeatures.split(",");

      // Facilities Validation
      if (!facilities) {
        return res.json({
          error: "Please Provide at least 1 facility of this Room Sub Category",
        });
      }
      const facilitiesList = facilities.split(",");

      // Room Sub Category Title Validation
      if (!title) {
        return res.json({
          error: "Please Provide a Title for the Room Sub Category",
        });
      }

      // if all validation passed
      const hoteRoomSubCategory = await RoomSubCategory.create({
        hotelId,
        roomCategoryId,
        title,
        keyFeatures: keyFeaturesList,
        facilities: facilitiesList,
        rentPerPerson: Number(rent.toFixed(2)),
      });

      // generate response
      res.status(200).json({
        status: "Success",
        message: `Hotel Room Sub Category: '${title}' Successfully Created`,
        data: hoteRoomSubCategory,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
};

module.exports = roomSubCategoryController;
