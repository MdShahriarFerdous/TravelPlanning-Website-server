const bookmarkModel = require("../models/bookmarkModel");

//  add hotel to bookmark
exports.addToHotelBookmark = async (req, res, next) => {
  try {
    // extract userId from request headers and hotelId from request params
    const userId = req.user._id;
    const { hotelId } = req.params;

    // insert a new hotel to bookmark
    await bookmarkModel.updateOne(
      { userId },
      {
        $set: { userId },
        // add hotelId to the bookmark
        $addToSet: { hotelId },
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

    // insert a new hotel to bookmark
    await bookmarkModel.updateOne(
      { userId },
      {
        $set: { userId },
        // add tourId to the bookmark
        $addToSet: { tourId },
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

    // find all bookmarks for the specified user ID
    let data = await bookmarkModel.findOne({ userId });

    res.status(200).json({
      status: "success",
      data: data,
    });
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
