const Hotel = require("../../models/hotelmodel/hotelModel");
const Location = require("../../models/LocationModel");
const { cloudinaryFolder } = require("../../../secrets");
const cloudinary = require("../../helpers/cloudinaryConfig");
const {
  updateSrcCloudinary,
  deleteSrcCloudinary,
} = require("../../utilities/updateCloudinaryImage");
const { isValidDateFormat } = require("../../helpers/checkDateFormat");
const slugify = require("slugify");
const hotelController = {
  // View a Single Hotel
  read: async (req, res, next) => {
    try {
      const { hotelId } = req.params;

      // Retrieve Hotel's Data
      const hotelData = await Hotel.findOne({ slug: hotelId }).populate(
        "location",
        "location_name"
      );
      if (!hotelData) {
        return res.json({ error: "Hotel Not Found" });
      }

      // generate response
      res.status(200).json({
        status: "Success",
        data: { hotelData },
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
  // List Hotels for public (All with filtering)
  list: async (req, res, next) => {
    try {
      const pageSize = 6; // Number of items per page
      const { location, guests, startDate, pageNumber } = req.query || {};
      const page = Number(pageNumber) || 1;
      let count = 0;
      let totalPages = 0;
      let hotels = [];

      // if no location provided
      if (!location) {
        count = await Hotel.countDocuments({
          status: true,
        });
        totalPages = Math.ceil(count / pageSize);
        hotels = await Hotel.find({
          status: true,
        })
          .populate("location", "location_name")
          .limit(pageSize)
          .skip(pageSize * (page - 1));
      }

      const hotelLocation = await Location.findOne({
        location_name: { $regex: new RegExp(`^${location}$`, "i") },
      });
      if (location && hotelLocation) {
        if (guests) {
          if (startDate) {
            // if location , guests Number & startDate provided
            const guestsNumber = Number(guests);
            if (isNaN(guestsNumber)) {
              return res.json({
                error: "Guests Number Must be a Type of Number !",
              });
            }
            if (guestsNumber <= 0) {
              return res.json({
                error: "At Least 1 Guests Number Should be Provided !",
              });
            }
            if (!isValidDateFormat(startDate, "YYYY-MM-DD")) {
              return res.json({
                error: "Please Provide a Valid Date!",
              });
            }
            const criteria = {
              location: hotelLocation._id,
              availableRooms: { $gte: guests },
              availableFrom: { $lte: new Date(startDate) },
              status: true,
            };
            count = await Hotel.countDocuments(criteria);
            totalPages = Math.ceil(count / pageSize);
            hotels = await Hotel.find(criteria)
              .populate("location", "location_name")
              .limit(pageSize)
              .skip(pageSize * (page - 1));
          } else {
            // if location & guests Number provided, but not Start Date provided
            const guestsNumber = Number(guests);
            if (isNaN(guestsNumber)) {
              return res.json({
                error: "Guests Number Must be a Type of Number !",
              });
            }
            if (guestsNumber <= 0) {
              return res.json({
                error: "At Least 1 Guests Number Should be Provided !",
              });
            }
            const criteria = {
              availableRooms: { $gte: guests },
              location: hotelLocation._id,
              status: true,
            };
            count = await Hotel.countDocuments(criteria);
            totalPages = Math.ceil(count / pageSize);
            hotels = await Hotel.find(criteria)
              .populate("location", "location_name")
              .limit(pageSize)
              .skip(pageSize * (page - 1));
          }
        } else {
          if (startDate) {
            // if location , start date provided, but not guests Number provided
            if (!isValidDateFormat(startDate, "YYYY-MM-DD")) {
              return res.json({
                error: "Please Provide a Valid Date!",
              });
            }
            const criteria = {
              availableFrom: { $lte: new Date(startDate) },
              location: hotelLocation._id,
              status: true,
            };
            count = await Hotel.countDocuments(criteria);
            totalPages = Math.ceil(count / pageSize);
            hotels = await Hotel.find(criteria)
              .populate("location", "location_name")
              .limit(pageSize)
              .skip(pageSize * (page - 1));
          } else {
            // if location only provided
            const criteria = {
              location: hotelLocation._id,
              status: true,
            };
            count = await Hotel.countDocuments(criteria);
            totalPages = Math.ceil(count / pageSize);
            hotels = await Hotel.find(criteria)
              .populate("location", "location_name")
              .limit(pageSize)
              .skip(pageSize * (page - 1));
          }
        }
      }

      res.status(200).json({
        hotels,
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
  // create a Hotel
  create: async (req, res, next) => {
    try {
      const {
        name,
        location,
        rentPerPerson,
        thumbnailLink,
        isFeatured,
        isTopRated,
      } = req.body;

      // Check if Hotel Name exists
      const hotelName = await Hotel.findOne({ name });
      if (hotelName) {
        return res.json({
          error: "Hotel Name must be Unique",
        });
      }

      // Location Validation
      const hotelLocation = await Location.findOne({ location_name: location });
      if (!hotelLocation) {
        return res.json({
          error: "Hotel Location Not Found",
        });
      }

      // Check if given string value is a decimal, after pasing
      const rent = Number(rentPerPerson);
      if (isNaN(rent)) {
        return res.json({
          error: "Rent Per Person Must be a Number",
        });
      }

      // isFeatured Validation
      if (isFeatured !== "true" && isFeatured !== "false") {
        return res.json({
          error: "isFeatured is Boolean Only, set 'true' or 'false'",
        });
      }

      // isTopRated Validation
      if (isTopRated !== "true" && isTopRated !== "false") {
        return res.json({
          error: "isTopRated is Boolean Only, set 'true' or 'false'",
        });
      }

      // Hotel thumbnail validation
      let thumb = thumbnailLink;
      const { path, size } = req.file || {};
      if (size && size > 1000000) {
        return res.json({
          error: "Image should be less than 1mb in size",
        });
      }
      if (path) {
        const uploadToCloudinary = await cloudinary.uploader.upload(path, {
          folder: `${cloudinaryFolder}/hotel/list`,
        });
        thumb = uploadToCloudinary.secure_url;
      } else {
        if (!thumbnailLink) {
          return res.json({
            error: "Please Provide a Link Or Upload an Image",
          });
        }
      }

      // if all validation passed
      const hotel = await Hotel.create({
        name,
        slug: slugify(name, { lower: true }),
        location: hotelLocation._id,
        rentPerPerson: Number(rent.toFixed(2)),
        thumbnail: thumb,
        isFeatured: isFeatured === "true" ? true : false,
        isTopRated: isTopRated === "true" ? true : false,
      });

      // generate response
      res.status(200).json({
        status: "Success",
        message: `Hotel: '${name}' Successfully Created`,
        data: hotel,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // create a Hotel
  update: async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const {
        name: newName,
        rentPerPerson: newRentPerPerson,
        availableRooms: newAvailableRooms,
        thumbnailLink: newThumbnailLink,
        isFeatured: newIsFeatured,
        isTopRated: newIsTopRated,
        location: newLocation,
        status: newStatus,
      } = req.body;

      // Retrieve Old Hotel's Data
      const oldHotelInfo = await Hotel.findOne({ _id: hotelId });
      if (!oldHotelInfo) {
        return res.json({ error: "Hotel Not Found" });
      }
      const {
        name,
        availableRooms,
        thumbnail,
        isFeatured,
        isTopRated,
        rentPerPerson,
        location,
        status,
      } = oldHotelInfo || {};
      const updatedHotelInfo = {};

      // Hotel Status validation
      if (newStatus) {
        if (newStatus === "true" && status === false) {
          updatedHotelInfo.status = true;
        }
        if (newStatus === "false" && status === true) {
          updatedHotelInfo.status = false;
        }
      }

      // Hotel Featured validation
      if (newIsFeatured) {
        if (newIsFeatured === "true" && isFeatured === false) {
          updatedHotelInfo.isFeatured = true;
        }
        if (newIsFeatured === "false" && isFeatured === true) {
          updatedHotelInfo.isFeatured = false;
        }
      }

      // Hotel Top rated validation
      if (newIsTopRated) {
        if (newIsTopRated === "true" && isTopRated === false) {
          updatedHotelInfo.isTopRated = true;
        }
        if (newIsTopRated === "false" && isTopRated === true) {
          updatedHotelInfo.isTopRated = false;
        }
      }

      // Hotel Name validation
      if (newName && newName !== name) {
        const hotelNameExists = await Hotel.findOne({ name: newName });
        if (hotelNameExists) {
          return res.json({
            error: "Hotel Name must be Unique",
          });
        }
        updatedHotelInfo.slug = slugify(newName, { lower: true });
        updatedHotelInfo.name = newName;
      }

      // Hotel Location validation
      if (newLocation && newLocation !== location) {
        const hotelLocation = await Location.findOne({
          location_name: newLocation,
        });
        if (!hotelLocation) {
          return res.json({
            error: "Updated Hotel Location Not Found",
          });
        }
        updatedHotelInfo.location = hotelLocation._id;
      }

      // Hotel Rent validation
      if (newRentPerPerson) {
        const rent = Number(newRentPerPerson);
        if (isNaN(rent)) {
          return res.json({
            error: "Rent Per Person Must be a Number",
          });
        }
        if (rentPerPerson !== rent) {
          updatedHotelInfo.rentPerPerson = rent;
        }
      }

      // Hotel Available Room validation
      if (newAvailableRooms) {
        const roomsAvailable = Number(newAvailableRooms);
        if (isNaN(roomsAvailable)) {
          return res.json({
            error: "Room Number Must be a Number",
          });
        }
        if (availableRooms !== roomsAvailable) {
          updatedHotelInfo.availableRooms = roomsAvailable;
        }
      }

      // Hotel Thumbnail Image Validation
      const isUpdatedThumbnail = await updateSrcCloudinary(
        req.file,
        thumbnail,
        newThumbnailLink,
        "hotel/list",
        1000000
      );
      if (isUpdatedThumbnail.status) {
        updatedHotelInfo.thumbnail = isUpdatedThumbnail.path;
      }

      // No Changes made to Update Hotel
      if (Object.keys(updatedHotelInfo).length === 0) {
        return res.json({
          error: "No Changes have been made for this Hotel",
        });
      }

      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotelId,
        updatedHotelInfo,
        { new: true }
      );

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Hotel is Updated",
        data: updatedHotel,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // delete a Hotel by Hotel Id
  delete: async (req, res, next) => {
    try {
      const { hotelId } = req.params;

      // Retrieve Old Hotel's Info
      const hotelInfo = await Hotel.findOne({ _id: hotelId });
      if (!hotelInfo) {
        return res.json({ error: "Hotel Not Found" });
      }
      const { thumbnail } = hotelInfo || {};

      // Deleting the Images from the Location
      await deleteSrcCloudinary(thumbnail);
      await Hotel.findByIdAndDelete(hotelId);

      // generate response
      res.status(200).json({
        status: "Success",
        message: "Hotel is Deleted Successfully",
        data: {
          deletedHotelId: hotelId,
        },
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  // delete All Hotels
  deleteAll: async (req, res, next) => {
    try {
      await Hotel.deleteMany({});
      res.status(200).json({
        status: "Success",
        message: "All Hotels Deleted",
        data: [],
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
};

module.exports = hotelController;
