const express = require('express');
const { create, list, readById, update, remove, cancelBooking, confirmBooking} = require('../controllers/FlightBookingController');
const {requireSignIn} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post('/flight-booking', requireSignIn, create);
router.get('/flight-bookings', list);
router.get('/flight-booking/:id', readById);
router.put('/flight-booking/:id', update);
router.delete('/flight-booking/:id', remove);
router.put('/flight-booking-cancel/:id', cancelBooking);
router.post('/flight-booking-confirm/:id', confirmBooking);

module.exports = router;