const itineraryModel = require("../models/itineraryModel");

exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { location_name, duration, latitude, longitude } = req.body;

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
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};
