const HotelBooking = require("../../models/hotelmodel/hotelBookingModel");
const Hotel = require("../../models/hotelmodel/hotelModel");
const { ObjectId } = require("mongoose").Types;
const { isValidDateFormat } = require("../../helpers/checkDateFormat");
const { defaultPageSize } = require("../../../secrets");
const moment = require("moment");

const hotelBookingController = {
  // Create Hotel Info Doc
  create: async (req, res, next) => {
    try {
      const userId = req.user;
      // Destructure variables from req.body
      const {
        hotelId,
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
      } = req.body;

      // Required field validation
      const requiredFields = [
        "hotelId",
        "firstName",
        "lastName",
        "phone",
        "nationality",
        "nid",
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
      const hotelData = await Hotel.findOne({ _id: hotelId });
      if (!hotelData) {
        return res.json({ error: "No Such Hotel Found" });
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
          error: "Maximum 1 Rooom is given to a Single Guest",
        });
      }
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
      const rentPerGuest = hotelData.rentPerPerson.toFixed(2);
      const totalCost = (guestsNumber * hotelData.rentPerPerson).toFixed(2);

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
        firstName,
        lastName,
        email,
        phone,
        nationality,
        nid,
        guests: guestsNumber,
        rooms: roomsNumber,
        checkIn,
        checkOut,
        rentPerGuest,
        totalCost,
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
            flight_id: 1,
            created_by: 1,
            first_name: 1,
            last_name: 1,
            phone: 1,
            nationality: 1,
            seats: 1,
            total_fare: 1,
            status: 1,
            "flightInfo.flight_number": 1,
            "flightInfo.journey_date": 1,
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
  // Create Hotel Info Doc
  checkAvailablity: async (req, res, next) => {
    try {
      const userId = req.user;
      // Destructure variables from req.body
      const { hotelId, guests, rooms, checkIn, checkOut } = req.body;

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
      const hotelData = await Hotel.findOne({ _id: hotelId });
      if (!hotelData) {
        return res.json({ error: "No Such Hotel Found" });
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
          error: "Maximum 1 Rooom is given to a Single Guest",
        });
      }
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
      const rentPerGuest = hotelData.rentPerPerson.toFixed(2);
      const totalCost = (guestsNumber * hotelData.rentPerPerson).toFixed(2);

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
};
module.exports = hotelBookingController;
