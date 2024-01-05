const express = require('express');
const {payment,hotelBookingPayment} = require("../controllers/PaymentSettingController");
const {requireSignIn} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post('/payment', requireSignIn, payment);
router.post('/hotel-booking-payment', requireSignIn, hotelBookingPayment);

module.exports = router;