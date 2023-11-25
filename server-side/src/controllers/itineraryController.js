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
      let placeIndex = 0;

      for (let day = 1; day <= tripLength; day++) {
        let dailyPlaces = [];
        for (let count = 1; count <= 3; count++) {
          if (placeIndex < places.length) {
            dailyPlaces.push(places[placeIndex].name);
            placeIndex++;
          } else {
            break; // If all places are covered
          }
        }
        itinerary.push({ [`Day ${day}`]: dailyPlaces });
        if (placeIndex >= places.length) {
          break; // If all places are covered before trip ends
        }
      }

      res.send({
        itinerary,
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
