const express = require('express');
const { create, list, readById, update, remove, cancelBooking} = require('../controllers/FlightBookingController');

const router = express.Router();

router.post('/flight-booking', create);
router.get('/flight-bookings', list);
router.get('/flight-booking/:id', readById);
router.put('/flight-booking/:id', update);
router.delete('/flight-booking/:id', remove);
router.put('/flight-booking-cancel/:id', cancelBooking);

module.exports = router;