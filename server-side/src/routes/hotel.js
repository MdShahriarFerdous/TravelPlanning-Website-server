const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel'); // Renamed to hotelController for better clarity

// Routes for hotels
router.post('/hotels/create', hotelController.createHotel);
router.get('/hotels/all', hotelController.getAllHotels);
router.get('/hotels/:hotelId/details', hotelController.getHotelById);
router.put('/hotels/:hotelId/update', hotelController.updateHotel);
router.delete('/hotels/:hotelId/delete', hotelController.deleteHotel);

module.exports = router;
