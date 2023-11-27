const router = require('express').Router();

const historicalPlaces = require("../controllers/historicalPlacesController");

router.post("/historical-places", historicalPlaces.createPlaces);

module.exports = router;