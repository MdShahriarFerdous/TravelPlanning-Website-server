const express = require('express');
const {payment} = require("../controllers/PaymentSettingController");
const {requireSignIn} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post('/payment', requireSignIn, payment);

module.exports = router;