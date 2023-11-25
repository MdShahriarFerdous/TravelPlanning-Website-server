const router = require("express").Router();

const itineraryController = require("../controllers/itineraryController");

router.post("/itinerary", itineraryController.createitinerary);

module.exports = router;
