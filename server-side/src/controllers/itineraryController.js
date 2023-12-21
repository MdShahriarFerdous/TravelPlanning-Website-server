const itineraryModel = require("../models/itineraryModel");

exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { location_name, duration, latitude, longitude } = req.body;

    // check if an itinerary exists for the user and location
    const existingItinerary = await itineraryModel.findOne({
      user: userId,
      location_name,
    });
    if (existingItinerary) {
      return res.status(200).json({
        status: "success",
        message: "Itinerary exists",
      });
    } else {
      const result = await itineraryModel.create({
        duration,
        location_name,
        latitude,
        longitude,
        user: userId,
      });

      return res.status(201).json({
        status: "success",
        message: result,
      });
    }
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};
