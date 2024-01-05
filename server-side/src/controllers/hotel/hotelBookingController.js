const HotelBooking = require("../../models/hotelmodel/hotelBookingModel");
const Hotel = require("../../models/hotelmodel/hotelModel");
const RoomCategory = require("../../models/hotelmodel/roomCategoryModel");
const RoomSubCategory = require("../../models/hotelmodel/roomSubCategoryModel");
const { ObjectId } = require("mongoose").Types;
const { isValidDateFormat } = require("../../helpers/checkDateFormat");
const { defaultPageSize } = require("../../../secrets");
const moment = require("moment");

const hotelBookingController = {
  // View a Single Hotel Booking
  read: async (req, res, next) => {
    try {
      const { hotelBookingId } = req.params;

      // Retrieve Hotel Booking's Data
      const data = await HotelBooking.findOne({ _id: hotelBookingId })
        .populate("hotelId", "name")
        .populate("roomCategoryId", "name")
        .populate("roomSubCategoryId", "title");
      if (!data) {
        return res.json({ error: "Hotel Booking Not Found" });
      }

      // generate response
      res.status(200).json({
        status: "Success",
        data,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Create Hotel Info Doc
  create: async (req, res, next) => {
    try {
      const userId = req.user;
      // Destructure variables from req.body
      const {
        hotelId,
        roomCategoryId,
        roomSubCategoryId,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        nid,
        guests,
        rooms,
        checkIn,
        checkOut,
        guestsInfo,
        additional,
      } = req.body;

      // Required field validation
      const requiredFields = [
        "hotelId",
        "roomCategoryId",
        "roomSubCategoryId",
        "firstName",
        "lastName",
        "phone",
        "nationality",
        "nid",
        "guests",
        "rooms",
        "checkIn",
        "checkOut",
        "guestsInfo",
      ];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.json({ error: `${field} is required` });
        }
      }

      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(hotelId)) {
        return res.json({
          error: "Invalid Hotel ID",
        });
      }
      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(roomCategoryId)) {
        return res.json({
          error: "Invalid Room Category ID",
        });
      }
      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(roomSubCategoryId)) {
        return res.json({
          error: "Invalid Room Sub Category ID",
        });
      }
      const hotelData = await Hotel.findOne({ _id: hotelId });
      if (!hotelData) {
        return res.json({ error: "No Such Hotel Found" });
      }
      const hotelCategoryData = await RoomCategory.findOne({
        _id: roomCategoryId,
      });
      if (!hotelCategoryData) {
        return res.json({ error: "No Such Room Category Found" });
      }
      const hotelSubData = await RoomSubCategory.findOne({
        _id: roomSubCategoryId,
      });
      if (!hotelSubData) {
        return res.json({ error: "No Such Sub Category Room Found" });
      }
      // Validate if Check In Date Format is Ok or Not
      if (!isValidDateFormat(checkIn, "YYYY-MM-DD")) {
        return res.json({
          error: "Please Provide a Valid Check In Date!",
        });
      }
      // Validate if Check Out Date Format is Ok or Not
      if (!isValidDateFormat(checkOut, "YYYY-MM-DD")) {
        return res.json({
          error: "Please Provide a Valid Check Out Date!",
        });
      }
      // Validate if Check Out Date is Greater than Check In Date
      const roomAvailablity = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (roomAvailablity > checkOutDate) {
        return res.json({
          error: "You Can not Check Out Before Check In !!",
        });
      }
      // Validate if Room is Available Or Not in the given date
      if (roomAvailablity < hotelData.availableFrom) {
        return res.json({
          error: `Hotel Booking Failed, Rooms will be Available From: ${moment(
            hotelData.availableFrom
          ).format("Do MMMM, YYYY")}`,
        });
      }
      // Validate if Room Number is Integer or Not
      const roomsNumber = Number(rooms);
      if (!Number.isInteger(roomsNumber)) {
        return res.json({
          error: "Room Number Must be a Positive Integer",
        });
      }
      // Validate if Room Number is a Positive Integer
      if (roomsNumber < 0) {
        return res.json({
          error: "Room Number Must be a Positive Integer",
        });
      }
      // Validate if Hotel Has Enough Room To Book
      if (hotelData.availableRooms < roomsNumber) {
        return res.json({
          error: `Hotel Booking Failed, Rooms Left: ${hotelData.availableRooms}`,
        });
      }
      // Validate if Guests Number is Integer or Not
      const guestsNumber = Number(guests);
      if (!Number.isInteger(guestsNumber)) {
        return res.json({
          error: "Guest Number Must be a Positive Integer",
        });
      }
      // Validate if Guests Number is a Positive Integer
      if (guestsNumber < 0) {
        return res.json({
          error: "Guest Number Must be a Positive Integer",
        });
      }
      // Validate if Guests Number is More Than Rooms
      if (guestsNumber < roomsNumber) {
        return res.json({
          error: "Maximum 1 Room is given to a Single Guest",
        });
      }

      let rentPerGuest = "0.00";
      let totalCost = "0.00";
      if (roomSubCategoryId) {
        const maxGuest = Number(hotelSubData.maxAllowed);
        if (roomsNumber * maxGuest < guestsNumber) {
          return res.json({
            error: `More Than ${maxGuest} Guest${
              maxGuest > 1 ? "s" : ""
            } Per Room is Not Allowed`,
          });
        }
        // Validate if Guests Number & Rooms Number is 0
        if (guestsNumber === 0 || roomsNumber === 0) {
          return res.json({
            error: "Please Input at least 1 Room & 1 Guest",
          });
        }
        // Cost Calculation if room sub category provided
        rentPerGuest = hotelSubData.rentPerPerson.toFixed(2);
        totalCost = (guestsNumber * Number(rentPerGuest)).toFixed(2);
      } else {
        if (roomsNumber * 3 < guestsNumber) {
          return res.json({
            error: "More Than 3 Guests Per Room is Not Allowed",
          });
        }
        // Validate if Guests Number & Rooms Number is 0
        if (guestsNumber === 0 || roomsNumber === 0) {
          return res.json({
            error: "Please Input at least 1 Room & 1 Guest",
          });
        }
        // Cost Calculation if room sub category not provided
        rentPerGuest = hotelData.rentPerPerson.toFixed(2);
        totalCost = (guestsNumber * Number(rentPerGuest)).toFixed(2);
      }

      // Use findOneAndUpdate to update the Hotel by its ID
      const nextAvailableDate = new Date(checkOutDate);
      nextAvailableDate.setDate(checkOutDate.getDate() + 1);
      const updatedRoom = {
        $inc: { availableRooms: -roomsNumber },
        $set: { availableFrom: nextAvailableDate },
      };
      const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updatedRoom, {
        new: true,
        runValidators: true,
      });
      if (!updatedHotel) {
        return res.json({
          error: "Hotel Booking Failed Due to Unknown Reason",
        });
      }

      // Create a new Hotel booking
      const newHotelBooking = await HotelBooking.create({
        createdBy: userId,
        hotelId,
        roomCategoryId,
        roomSubCategoryId,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        nid,
        guests: guestsNumber,
        guestsInfo,
        rooms: roomsNumber,
        checkIn,
        checkOut,
        rentPerGuest,
        totalCost,
        additional,
      });

      // Check if Hotel booking is created successfully
      if (!newHotelBooking) {
        return res.json({ error: "Hotel Booking Failed !!!" });
      }

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Hotel Booking successful!",
        data: newHotelBooking,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // List of All Hotel Bookings Without Paginate
  listWithoutPaginate: async (req, res, next) => {
    try {
      const hotelBookings = await HotelBooking.aggregate([
        {
          $lookup: {
            from: "hotels",
            localField: "hotelId",
            foreignField: "_id",
            as: "hotelInfo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: "$hotelInfo",
        },
        {
          $unwind: "$userInfo",
        },
        {
          $project: {
            _id: 1,
            hotelId: 1,
            roomSubCategoryId: 1,
            createdBy: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            nationality: 1,
            nid: 1,
            guests: 1,
            rooms: 1,
            checkIn: 1,
            checkOut: 1,
            rentPerGuest: 1,
            totalCost: 1,
            status: 1,
            "hotelInfo.name": 1,
            "userInfo.username": 1,
            "userInfo.email": 1,
          },
        },
      ]);
      res.status(200).json({
        status: "Success",
        message:
          hotelBookings.length < 1
            ? "No Hotel Bookings Created Yet !!"
            : "Hotel Bookings List Retrieval Successful",
        data: hotelBookings,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // List of All Hotel Bookings With Paginate
  list: async (req, res, next) => {
    try {
      const pageSize = Number(defaultPageSize); // Number of items per page
      const { pageNumber } = req.query || {};
      const page = Number(pageNumber) || 1;
      let count = 0;
      let totalPages = 0;
      let hotelBookings = [];
      count = await HotelBooking.countDocuments({});
      totalPages = Math.ceil(count / pageSize);
      hotelBookings = await HotelBooking.find({})
        .sort({ updatedAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      res.status(200).json({
        hotelBookings,
        page,
        totalPages,
        count,
        itemsPerPage: pageSize,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // List of All Hotel Bookings By a User With Paginate
  userHotelBookingsList: async (req, res, next) => {
    try {
      const userId = req.user;
      const pageSize = Number(defaultPageSize); // Number of items per page
      const { pageNumber } = req.query || {};
      const page = Number(pageNumber) || 1;
      let count = 0;
      let totalPages = 0;
      let hotelBookings = [];
      count = await HotelBooking.countDocuments({});
      totalPages = Math.ceil(count / pageSize);
      hotelBookings = await HotelBooking.find({
        createdBy: userId,
      })
        .sort({ updatedAt: -1 })
        .populate("hotelId", "name")
        .populate("roomCategoryId", "name")
        .populate("roomSubCategoryId", "title")
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .select(
          "_id hotelId roomCategoryId roomSubCategoryId checkIn checkOut rooms guests totalCost createdAt status"
        );
      res.status(200).json({
        hotelBookings,
        page,
        totalPages,
        count,
        itemsPerPage: pageSize,
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // Create Hotel Info Doc
  checkAvailablity: async (req, res, next) => {
    try {
      const userId = req.user;
      // Destructure variables from req.body
      const { hotelId, roomSubCategoryId, guests, rooms, checkIn, checkOut } =
        req.body;

      // Required field validation
      const requiredFields = [
        "hotelId",
        "guests",
        "rooms",
        "checkIn",
        "checkOut",
      ];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.json({ error: `${field} is required` });
        }
      }

      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(hotelId)) {
        return res.json({
          error: "Invalid Hotel ID",
        });
      }
      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (roomSubCategoryId) {
        if (!ObjectId.isValid(roomSubCategoryId)) {
          return res.json({
            error: "Invalid Room Sub Category ID",
          });
        }
      }
      const hotelData = await Hotel.findOne({ _id: hotelId });
      if (!hotelData) {
        return res.json({ error: "No Such Hotel Found" });
      }
      let hotelSubData = {};
      if (roomSubCategoryId) {
        hotelSubData = await RoomSubCategory.findOne({
          _id: roomSubCategoryId,
        });
        if (!hotelSubData) {
          return res.json({ error: "No Such Room Sub Category Found" });
        }
      }

      // Validate if Check In Date Format is Ok or Not
      if (!isValidDateFormat(checkIn, "YYYY-MM-DD")) {
        return res.json({
          error: "Please Provide a Valid Check In Date!",
        });
      }
      // Validate if Check Out Date Format is Ok or Not
      if (!isValidDateFormat(checkOut, "YYYY-MM-DD")) {
        return res.json({
          error: "Please Provide a Valid Check Out Date!",
        });
      }
      // Validate if Check Out Date is Greater than Check In Date
      const roomAvailablity = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (roomAvailablity > checkOutDate) {
        return res.json({
          error: "You Can not Check Out Before Check In !!",
        });
      }
      // Validate if Room is Available Or Not in the given date
      if (roomAvailablity < hotelData.availableFrom) {
        return res.json({
          error: `Hotel Rooms will be Available From: ${moment(
            hotelData.availableFrom
          ).format("Do MMMM, YYYY")}`,
        });
      }
      // Validate if Room Number is Integer or Not
      const roomsNumber = Number(rooms);
      if (!Number.isInteger(roomsNumber)) {
        return res.json({
          error: "Room Number Must be a Positive Integer",
        });
      }
      // Validate if Room Number is a Positive Integer
      if (roomsNumber < 0) {
        return res.json({
          error: "Room Number Must be a Positive Integer",
        });
      }
      // Validate if Hotel Has Enough Room To Book
      if (hotelData.availableRooms < roomsNumber) {
        return res.json({
          error: `Hotel Rooms Left: ${hotelData.availableRooms}`,
        });
      }
      // Validate if Guests Number is Integer or Not
      const guestsNumber = Number(guests);
      if (!Number.isInteger(guestsNumber)) {
        return res.json({
          error: "Guest Number Must be a Positive Integer",
        });
      }
      // Validate if Guests Number is a Positive Integer
      if (guestsNumber < 0) {
        return res.json({
          error: "Guest Number Must be a Positive Integer",
        });
      }
      // Validate if Guests Number is More Than Rooms
      if (guestsNumber < roomsNumber) {
        return res.json({
          error: "Maximum 1 Room is given to a Single Guest",
        });
      }

      let rentPerGuest = "0.00";
      let totalCost = "0.00";
      if (roomSubCategoryId) {
        const maxGuest = Number(hotelSubData.maxAllowed);
        if (roomsNumber * maxGuest < guestsNumber) {
          return res.json({
            error: `More Than ${maxGuest} Guest${
              maxGuest > 1 ? "s" : ""
            } Per Room is Not Allowed`,
          });
        }
        // Validate if Guests Number & Rooms Number is 0
        if (guestsNumber === 0 || roomsNumber === 0) {
          return res.json({
            error: "Please Input at least 1 Room & 1 Guest",
          });
        }
        // Cost Calculation if room sub category provided
        rentPerGuest = hotelSubData.rentPerPerson.toFixed(2);
        totalCost = (guestsNumber * Number(rentPerGuest)).toFixed(2);
      } else {
        if (roomsNumber * 3 < guestsNumber) {
          return res.json({
            error: "More Than 3 Guests Per Room is Not Allowed",
          });
        }
        // Validate if Guests Number & Rooms Number is 0
        if (guestsNumber === 0 || roomsNumber === 0) {
          return res.json({
            error: "Please Input at least 1 Room & 1 Guest",
          });
        }
        // Cost Calculation
        rentPerGuest = hotelData.rentPerPerson.toFixed(2);
        totalCost = (guestsNumber * Number(rentPerGuest)).toFixed(2);
      }
      // generate response
      res.status(200).json({
        status: "Success",
        message: "Hotel Room Available!",
        data: {
          totalCost,
          rentPerGuest,
          guestsNumber,
          roomsNumber,
          startDate: moment(roomAvailablity).format("Do MMMM, YYYY"),
          endDate: moment(checkOutDate).format("Do MMMM, YYYY"),
        },
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // Cancel Hotel Booking
  cancelBooking: async (req, res, next) => {
    try {
      const hotelBookingId = req.params.id;
      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(hotelBookingId)) {
        return res.json({
          error: "Invalid Hotel Booking ID",
        });
      }
      // Find the Hotel booking by ID
      const hotelBooking = await HotelBooking.findById(hotelBookingId);
      // Check if the Hotel booking exists
      if (!hotelBooking) {
        return res.json({
          error: "Hotel Booking not found",
        });
      }
      // Check if the Hotel booking is already canceled
      if (hotelBooking.status === "canceled") {
        return res.json({
          error: "Hotel Booking is already canceled",
        });
      }
      // Update the status to 'canceled'
      hotelBooking.status = "canceled";
      // Save the updated hotel booking
      await HotelBooking.findByIdAndUpdate(hotelBookingId, hotelBooking, {
        new: true,
      });
    } catch (err) {
      console.error("Error from cancel hotel Booking:", err.message);
      return res.json({
        error: "Something Went Wrong",
      });
    }
  },
  // Hotel Booking Failed
  failBooking: async (req, res, next) => {
    try {
      const hotelBookingId = req.params.id;
      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(hotelBookingId)) {
        return res.json({
          error: "Invalid Hotel Booking ID",
        });
      }
      // Find the Hotel booking by ID
      const hotelBooking = await HotelBooking.findById(hotelBookingId);
      // Check if the Hotel booking exists
      if (!hotelBooking) {
        return res.json({
          error: "Hotel Booking not found",
        });
      }
      // Check if the Hotel booking is already failed
      if (hotelBooking.status === "failed") {
        return res.json({
          error: "Hotel Booking is already failed",
        });
      }
      // Update the status to 'failed'
      hotelBooking.status = "failed";
      // Save the updated hotel booking
      await HotelBooking.findByIdAndUpdate(hotelBookingId, hotelBooking, {
        new: true,
      });
    } catch (err) {
      console.error("Error from failed hotel Booking:", err.message);
      return res.json({
        error: "Something Went Wrong",
      });
    }
  },
  // Confirm Hotel Booking
  confirmBooking: async (req, res, next) => {
    try {
      const hotelBookingId = req.params.id;
      // Validate if the provided ID is a valid ObjectId (MongoDB ID)
      if (!ObjectId.isValid(hotelBookingId)) {
        return res.json({
          error: "Invalid Hotel Booking ID",
        });
      }
      // Find the Hotel booking by ID
      const hotelBooking = await HotelBooking.findById(hotelBookingId);
      // Check if the Hotel booking exists
      if (!hotelBooking) {
        return res.json({
          error: "Hotel Booking not found",
        });
      }
      // Check if the Hotel booking is already confirmed
      if (hotelBooking.status === "confirmed") {
        return res.json({
          error: "Hotel Booking is already Confirmed",
        });
      }
      // Update the status to 'confirmed'
      hotelBooking.status = "confirmed";
      // Save the updated hotel booking
      await HotelBooking.findByIdAndUpdate(hotelBookingId, hotelBooking, {
        new: true,
      });
      res.redirect(
        "https://we-travel-tech-taqwa.vercel.app/user/hotel/payment/success"
      );
    } catch (err) {
      console.error("Error from confirm hotel Booking:", err.message);
      return res.json({
        error: "Something Went Wrong",
      });
    }
  },
};
module.exports = hotelBookingController;
