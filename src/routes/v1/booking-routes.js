
const express = require('express');
const { BookingController } = require('../../controllers');

const router = express.Router();

// /api/v1/booking POST
router.post('/',
    BookingController.createBooking);

    
// /api/v1/booking PATCH
router.patch('/payments',
    BookingController.makePayment);


module.exports = router;