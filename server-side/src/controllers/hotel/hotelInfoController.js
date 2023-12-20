const HotelInfo = require("../../models/hotelmodel/hotelInfoModel");
const { defaultPageSize } = require("../../../secrets");
const { ObjectId } = require("mongoose").Types;
const hotelInfoController = {
  // Create Hotel Info Doc
  create: async (req, res, next) => {
    try {
      const {
        hotelId,
        address,
        about1,
        about2,
        establishYear,
        renovationYear,
        floors,
        rooms,
        bars,
        staff,
        branch,
        googleMap,
      } = req.body;

      // Validate Hotel ID
      if (!ObjectId.isValid(hotelId)) {
        return res.json({
          error: "Invalid Hotel ID",
        });
      }
      const duplicateHotel = await HotelInfo.findOne({
        hotelId,
        status: true,
      });
      if (duplicateHotel) {
        return res.json({
          error: "Duplicate Hotel Info Can't be Made",
        });
      }

      // Hotel address Validation
      if (!address) {
        return res.json({
          error: "Please Provide an address for the Hotel",
        });
      }

      // Hotel about1 Validation
      if (!about1) {
        return res.json({
          error: "Please Provide about for the Hotel",
        });
      }

      // Hotel about1 Validation
      if (!about2) {
        return res.json({
          error: "Please Provide about for the Hotel",
        });
      }

      // Check if Year of Establishment is a decimal, after pasing
      const yearOfEstablishment = Number(establishYear);
      if (isNaN(yearOfEstablishment)) {
        return res.json({
          error: "Year of Establishment Must be a Number",
        });
      }

      // Check if Year of Renovation is a decimal, after pasing
      const yearOfRenovation = Number(renovationYear);
      if (isNaN(yearOfRenovation)) {
        return res.json({
          error: "Year of Renovation Must be a Number",
        });
      }

      // Check if Floors Number is a decimal, after pasing
      const floorsNumber = Number(floors);
      if (isNaN(floorsNumber)) {
        return res.json({
          error: "Floors Number Must be a Number",
        });
      }

      // Check if Rooms Number is a decimal, after pasing
      const roomsNumber = Number(rooms);
      if (isNaN(roomsNumber)) {
        return res.json({
          error: "Rooms Number Must be a Number",
        });
      }

      // Check if Bars Number is a decimal, after pasing
      const barsNumber = Number(bars);
      if (isNaN(barsNumber)) {
        return res.json({
          error: "Bars Number Must be a Number",
        });
      }

      // Check if Staff Number is a decimal, after pasing
      const staffNumber = Number(staff);
      if (isNaN(staffNumber)) {
        return res.json({
          error: "Staff Number Must be a Number",
        });
      }

      // Check if Staff Number is a decimal, after pasing
      const branchNumber = Number(branch);
      if (isNaN(branchNumber)) {
        return res.json({
          error: "Branch Number Must be a Number",
        });
      }

      // Hotel Google Map Validation
      const googleMapPattern =
        /<iframe.*src="https:\/\/www\.google\.com\/maps\/embed\?.*<\/iframe>/;
      if (!googleMapPattern.test(googleMap)) {
        return res.json({
          error: "Please Provide a Valid Embeded Google Map",
        });
      }

      // if all validation passed
      const hoteInfo = await HotelInfo.create({
        hotelId,
        address,
        about1,
        about2,
        establishYear: Number(yearOfEstablishment.toFixed()),
        renovationYear: Number(yearOfRenovation.toFixed()),
        floors: Number(floorsNumber.toFixed()),
        rooms: Number(roomsNumber.toFixed()),
        bars: Number(barsNumber.toFixed()),
        staff: Number(staffNumber.toFixed()),
        branch: Number(branchNumber.toFixed()),
        googleMap,
      });

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Hotel Info Added Successfully",
        data: hoteInfo,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // Update Hotel Info Doc
  updateByHotelId: async (req, res, next) => {
    try {
      // Extract hotel ID from request query
      const { hotelId } = req.query || {};

      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(hotelId)) {
        return res.json({
          error: "Invalid Hotel ID",
        });
      }

      // Use findOneAndUpdate to update the Hotel Info by Hotel ID
      const updatedHotel = await HotelInfo.findOneAndUpdate(
        { hotelId: ObjectId.createFromHexString(hotelId) },
        req.body, // Use the request body for the update
        { new: true, runValidators: true } // Options to return the updated document and run validators
      );

      // Check if the flight is found and updated
      if (updatedHotel) {
        res.status(200).json({
          status: "Success",
          message: "Hotel Info Update Successful",
          data: updatedHotel,
        });
      } else {
        res.status(200).json({
          status: "Success",
          message: "Hotel Info not found or could not be updated",
          data: updatedHotel,
        });
      }
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // List of All Hotel Info
  list: async (req, res, next) => {
    try {
      const pageSize = Number(defaultPageSize); // Number of items per page
      const { pageNumber } = req.query || {};
      const page = Number(pageNumber) || 1;
      const skipped = pageSize * (page - 1);
      const searchQuery = { status: true };
      const count = await HotelInfo.countDocuments(searchQuery);
      const hotelInfoList = await HotelInfo.find(searchQuery)
        .limit(pageSize)
        .skip(skipped);
      res.status(200).json({
        hotelInfoList,
        count,
        page,
        totalPages: Math.ceil(count / pageSize),
        itemsPerPage: pageSize,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = hotelInfoController;
