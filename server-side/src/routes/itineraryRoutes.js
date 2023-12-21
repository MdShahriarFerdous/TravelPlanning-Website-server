const router = require("express").Router();

const { requireSignIn } = require("../middlewares/authMiddlewares");
const itineraryController = require("../controllers/itineraryController");

router.post("/itinerary", requireSignIn, itineraryController.addToWishlist);

module.exports = router;
