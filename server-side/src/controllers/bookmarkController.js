const bookmarkModel = require("../models/bookmarkModel");
const Hotel = require("../models/hotelmodel/hotelModel");

//  add hotel to bookmark
exports.addToHotelBookmark = async (req, res, next) => {
  try {
    // extract userId from request headers and hotelId from request params
    const userId = req.user._id;
    const { hotelId } = req.params;

    // search hotelInfo
    const search = await Hotel.findOne({ _id: hotelId });

    if (!search) {
      return res.json({
        error: "Hotel ID not found",
      });
    }
    const foundHotelId = search._id;

    // insert a new hotel to bookmark
    await bookmarkModel.updateOne(
      { userId },
      {
        $set: { userId },
        // add hotelId to the bookmark
        $addToSet: { hotelId: foundHotelId },
      },
      { upsert: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Added hotel to Bookmark",
    });
  } catch (error) {
    // pass the error to the next middleware
    next(error);
    console.log(error.message);
  }
};

//  add tour to bookmark
exports.addToTourBookmark = async (req, res, next) => {
  try {
    // extract userId from request headers and tourId from request params
    const userId = req.user._id;
    const { tourId } = req.params;

    // search tourInfo
    const search = await TourInfo.findOne({ tourId });

    if (!search) {
      return res.json({
        error: "Tour package info not found",
      });
    }
    const foundTourId = search._id;

    // insert a new hotel to bookmark
    await bookmarkModel.updateOne(
      { userId },
      {
        $set: { userId },
        // add tourId to the bookmark
        $addToSet: { tourId: foundTourId },
      },
      { upsert: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Added tour to Bookmark",
    });
  } catch (error) {
    // pass the error to the next middleware
    next(error);
    console.log(error.message);
  }
};

// get all bookmarks list
exports.getAllBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(req.query);

    const { type } = req.query || {};
    if (!type) {
      let data = await bookmarkModel.findOne({ userId });

      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else if (type === "tour") {
      let data = await bookmarkModel
        .findOne({ userId })
        .populate("tourId", "title typeOfTour about")
        .select("tourId");

      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else if (type === "hotel") {
      let data = await bookmarkModel
        .findOne({ userId })
        .populate("hotelId", "name")
        .select("hotelId");

      return res.status(200).json({
        status: "success",
        data: data,
      });
    }
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// remove the hotel bookmark
exports.removeHotelBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const hotelId = req.params.hotelId;

    await bookmarkModel.findOneAndUpdate(
      { userId },
      { $pull: { hotelId } },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Hotel removed from Bookmark",
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// remove the tour bookmark
exports.removeTourBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const tourId = req.params.tourId;

    await bookmarkModel.findOneAndUpdate(
      { userId },
      { $pull: { tourId } },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Tour removed from Bookmark",
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};
