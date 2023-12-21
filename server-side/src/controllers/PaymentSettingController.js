const apiResponse = require("../helpers/apiResponse");
const { ObjectId } = require("mongoose").Types;
// Payment Lib import
const SSLCommerzPayment = require('sslcommerz-lts')
const FlightBooking = require("../models/FlightBookingModel");

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false //true for live, false for sandbox

exports.payment = async (req, res) => {

    try {
        const formData = req.body;
        const flightBooking = await FlightBooking.findOne({
            flight_id: formData.flight_id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            nationality: formData.nationality,
            nid: formData.nid,
            seats: formData.seats,
            total_fare: formData.total_fare,
            status: "pending",
            // You may need to adjust or add more conditions based on your schema
        });
        const tran_id = new ObjectId().toString();
        const data = {
            total_amount: flightBooking?.total_fare,
            currency: 'BDT',
            tran_id: tran_id, // use unique tran_id for each api call
            success_url: `https://travelplanning-website-server.onrender.com/api/v1/flight-booking-confirm/${flightBooking?._id}`,
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        console.log(data)
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        sslcz.init(data).then(apiResponse => {
            // Redirect the user to payment gateway
            let GatewayPageURL = apiResponse.GatewayPageURL
            res.send({url: GatewayPageURL})
            console.log('Redirecting to: ', GatewayPageURL)
        });
    }  catch (err) {
        // Log and handle errors
        console.error("Error From Read", err.message);
        return apiResponse.errorResponse(res, "Something went wrong");
    }
};