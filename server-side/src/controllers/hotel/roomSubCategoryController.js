const RoomCategory = require("../../models/hotelmodel/roomCategoryModel");
const RoomSubCategory = require("../../models/hotelmodel/roomSubCategoryModel");
const Hotel = require("../../models/hotelmodel/hotelModel");
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
        maxAllowed,
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

      // Rent Per Person Validations
      if (!rentPerPerson) {
        return res.json({
          error: "Please Provide Room Rent Per Person",
        });
      }
      const rent = Number(rentPerPerson);
      if (!Number.isInteger(rent)) {
        return res.json({
          error: "Rent Per Person Must be an Integer",
        });
      }
      if (rent < 0) {
        return res.json({
          error: "Rent Per Person Must be a Positive Integer",
        });
      }

      // Maximum Guest Allowed Validations
      if (!maxAllowed) {
        return res.json({
          error: "Please Provide How Many Guests Allowed Per Room",
        });
      }
      const maxGuestAllowed = Number(maxAllowed);
      if (!Number.isInteger(maxGuestAllowed)) {
        return res.json({
          error: "Maximum Guest Allowed Must be an Integer",
        });
      }
      if (maxGuestAllowed < 0) {
        return res.json({
          error: "Maximum Guest Allowed Must be a Positive Integer",
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

      // Update Hotel Rent Per Person
      const data = [];
      const categoriesWithSubcategories = await RoomCategory.find({
        hotelId,
        status: true,
      }).lean();
      for (const category of categoriesWithSubcategories) {
        category.subCategories = await RoomSubCategory.find({
          roomCategoryId: category._id,
          status: true,
        }).lean();
        data.push(...category.subCategories);
      }
      const newRent = Number(rent.toFixed(2));

      // Hotel Rent Per Person data
      // const sum = data.reduce((acc, obj) => acc + obj["rentPerPerson"], 0);
      // const updatedRent = (sum + newRent) / (data.length + 1);
      const updatedRent = data.reduce((min, currentObject) => {
        const currentValue = currentObject.value;
        return currentValue < min ? currentValue : min;
      }, newRent);
      await Hotel.findByIdAndUpdate(
        hotelId,
        { rentPerPerson: Number(updatedRent.toFixed(2)) },
        { new: true }
      );

      // if all validation passed
      const hoteRoomSubCategory = await RoomSubCategory.create({
        hotelId,
        roomCategoryId,
        title,
        keyFeatures: keyFeaturesList,
        facilities: facilitiesList,
        rentPerPerson: Number(rent.toFixed(2)),
        maxAllowed: Number(maxGuestAllowed.toFixed()),
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
