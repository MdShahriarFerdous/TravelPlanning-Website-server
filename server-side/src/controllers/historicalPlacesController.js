const locationModel = require("../models/LocationModel");
const historicalPlacesModel = require("../models/historicalPlacesModel");

exports.createPlaces = async (req, res, next) => {
  try {
    let { placeName, locationName } = req.body;

    const existingLocation = await locationModel.exists({ name: locationName });

    if (existingLocation?._id) {
      let result = await historicalPlacesModel.create({
        name: placeName,
        location: existingLocation._id,
      });
      res.status(200).json({
        success: true,
        message: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No location found",
      });
    }
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};
