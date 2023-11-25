const locationModel = require("../models/locationModel");
const historicalPlacesModel = require("../models/historicalPlacesModel");

exports.createitinerary = async (req, res, next) => {
  try {
    let { locationName, tripLength } = req.body;
    let existingLocation = await locationModel.findOne({
      name: locationName,
    });

    if (existingLocation?._id) {
      let places = await historicalPlacesModel.find({
        location: existingLocation._id,
      });
      if (places.length === 0) {
        // If no historical places found for the location
        return res.status(200).json({
          success: true,
          message: "No historical places found for this location.",
        });
      }

      let itinerary = [];
      let day = 1;

      for (let i = 1; i <= tripLength; i++) {
        itinerary[day] = [];

        for (let j = 0; j < places.length; j++) {
          itinerary[day].push(places[j].name);
        }

        day++;
      }
      res.status(200).json({
        success: true,
        message: itinerary,
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
