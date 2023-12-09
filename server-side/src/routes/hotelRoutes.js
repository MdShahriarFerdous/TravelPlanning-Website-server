const router = require("express").Router();
const { getAllHotels } = require("../controllers/hotel/hotelController");

// Routes for hotels
router.get("/hotels", getAllHotels);

module.exports = router;
