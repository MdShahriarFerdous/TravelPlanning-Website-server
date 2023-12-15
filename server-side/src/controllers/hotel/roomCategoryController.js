const Hotel = require("../../models/hotelmodel/hotelModel");
const RoomCategory = require("../../models/hotelmodel/roomCategoryModel");
const Location = require("../../models/LocationModel");
const { cloudinaryFolder, defaultPageSize } = require("../../../secrets");
const cloudinary = require("../../helpers/cloudinaryConfig");

const {
  updateSrcCloudinary,
  deleteSrcCloudinary,
} = require("../../utilities/updateCloudinaryImage");
const roomCategoryController = {
  // View a Single Hotel
  // read: async (req, res, next) => {
  //   try {
  //     const { hotelId } = req.params;

  //     // Retrieve Hotel's Data
  //     const hotelData = await Hotel.findOne({ _id: hotelId }).populate(
  //       "location",
  //       "location_name"
  //     );
  //     if (!hotelData) {
  //       return res.json({ error: "Hotel Not Found" });
  //     }

  //     // generate response
  //     res.status(200).json({
  //       status: "Success",
  //       data: { hotelData },
  //     });
  //   } catch (error) {
  //     next(error);
  //     console.error(error.message);
  //   }
  // },
  // List Hotel Room Cateories for public (All with filtering)
  list: async (req, res, next) => {
    try {
      const pageSize = Number(defaultPageSize); // Number of items per page
      const { hotel, pageNumber } = req.query || {};
      const page = Number(pageNumber) || 1;
      let count = 0;
      let totalPages = 0;
      let roomCategories = [];

      // if hotel id provided
      if (hotel) {
        count = await RoomCategory.countDocuments({
          hotelId: hotel,
          status: true,
        });
        totalPages = Math.ceil(count / pageSize);
        roomCategories = await RoomCategory.find({
          hotelId: hotel,
          status: true,
        })
          .limit(pageSize)
          .skip(pageSize * (page - 1));
      } else {
        count = await RoomCategory.countDocuments({ status: true });
        totalPages = Math.ceil(count / pageSize);
        roomCategories = await RoomCategory.find({ status: true })
          .limit(pageSize)
          .skip(pageSize * (page - 1));
      }
      res.status(200).json({
        roomCategories,
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

      // Room Category Validation
      if (!name) {
        return res.json({
          error: "Please Provide a Name for the Room Category",
        });
      }

      // Hotel thumbnail validation
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

      // if all validation passed
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
  // create a Hotel
  // update: async (req, res, next) => {
  //   try {
  //     const { hotelId } = req.params;
  //     const {
  //       name: newName,
  //       rentPerPerson: newRentPerPerson,
  //       thumbnailLink: newThumbnailLink,
  //       isFeatured: newIsFeatured,
  //       isTopRated: newIsTopRated,
  //       location: newLocation,
  //       status: newStatus,
  //     } = req.body;

  //     // Retrieve Old Hotel's Data
  //     const oldHotelInfo = await Hotel.findOne({ _id: hotelId });
  //     if (!oldHotelInfo) {
  //       return res.json({ error: "Hotel Not Found" });
  //     }
  //     const {
  //       name,
  //       thumbnail,
  //       isFeatured,
  //       isTopRated,
  //       rentPerPerson,
  //       location,
  //       status,
  //     } = oldHotelInfo || {};
  //     const updatedHotelInfo = {};

  //     // Hotel Status validation
  //     if (newStatus) {
  //       if (newStatus === "true" && status === false) {
  //         updatedHotelInfo.status = true;
  //       }
  //       if (newStatus === "false" && status === true) {
  //         updatedHotelInfo.status = false;
  //       }
  //     }

  //     // Hotel Featured validation
  //     if (newIsFeatured) {
  //       if (newIsFeatured === "true" && isFeatured === false) {
  //         updatedHotelInfo.isFeatured = true;
  //       }
  //       if (newIsFeatured === "false" && isFeatured === true) {
  //         updatedHotelInfo.isFeatured = false;
  //       }
  //     }

  //     // Hotel Top rated validation
  //     if (newIsTopRated) {
  //       if (newIsTopRated === "true" && isTopRated === false) {
  //         updatedHotelInfo.isTopRated = true;
  //       }
  //       if (newIsTopRated === "false" && isTopRated === true) {
  //         updatedHotelInfo.isTopRated = false;
  //       }
  //     }

  //     // Hotel Name validation
  //     if (newName && newName !== name) {
  //       const hotelNameExists = await Hotel.findOne({ name: newName });
  //       if (hotelNameExists) {
  //         return res.json({
  //           error: "Hotel Name must be Unique",
  //         });
  //       }
  //       updatedHotelInfo.name = newName;
  //     }

  //     // Hotel Location validation
  //     if (newLocation && newLocation !== location) {
  //       const hotelLocation = await Location.findOne({
  //         location_name: newLocation,
  //       });
  //       if (!hotelLocation) {
  //         return res.json({
  //           error: "Updated Hotel Location Not Found",
  //         });
  //       }
  //       updatedHotelInfo.location = hotelLocation._id;
  //     }

  //     // Hotel Rent validation
  //     if (newRentPerPerson) {
  //       const rent = Number(newRentPerPerson);
  //       if (isNaN(rent)) {
  //         return res.json({
  //           error: "Rent Per Person Must be a Number",
  //         });
  //       }
  //       if (rentPerPerson !== rent) {
  //         updatedHotelInfo.rentPerPerson = rent;
  //       }
  //     }

  //     // Hotel Thumbnail Image Validation
  //     const isUpdatedThumbnail = await updateSrcCloudinary(
  //       req.file,
  //       thumbnail,
  //       newThumbnailLink,
  //       "hotel/list",
  //       1000000
  //     );
  //     if (isUpdatedThumbnail.status) {
  //       updatedHotelInfo.thumbnail = isUpdatedThumbnail.path;
  //     }

  //     // No Changes made to Update Hotel
  //     if (Object.keys(updatedHotelInfo).length === 0) {
  //       return res.json({
  //         error: "No Changes have been made for this Hotel",
  //       });
  //     }

  //     const updatedHotel = await Hotel.findByIdAndUpdate(
  //       hotelId,
  //       updatedHotelInfo,
  //       { new: true }
  //     );

  //     // generate response
  //     res.status(200).json({
  //       status: "Success",
  //       message: "Hotel is Updated",
  //       data: updatedHotel,
  //     });
  //   } catch (error) {
  //     console.error(error.message);
  //     next(error);
  //   }
  // },
  // delete a Hotel by Hotel Id
  // delete: async (req, res, next) => {
  //   try {
  //     const { hotelId } = req.params;

  //     // Retrieve Old Hotel's Info
  //     const hotelInfo = await Hotel.findOne({ _id: hotelId });
  //     if (!hotelInfo) {
  //       return res.json({ error: "Hotel Not Found" });
  //     }
  //     const { thumbnail } = hotelInfo || {};

  //     // Deleting the Images from the Location
  //     await deleteSrcCloudinary(thumbnail);
  //     await Hotel.findByIdAndDelete(hotelId);

  //     // generate response
  //     res.status(200).json({
  //       status: "Success",
  //       message: "Hotel is Deleted Successfully",
  //       data: {
  //         deletedHotelId: hotelId,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error.message);
  //     next(error);
  //   }
  // },
  // delete All Hotels
  // deleteAll: async (req, res, next) => {
  //   try {
  //     await Hotel.deleteMany({});
  //     res.status(200).json({
  //       status: "Success",
  //       message: "All Hotels Deleted",
  //       data: [],
  //     });
  //   } catch (error) {
  //     console.error(error.message);
  //     next(error);
  //   }
  // },
};

module.exports = roomCategoryController;
