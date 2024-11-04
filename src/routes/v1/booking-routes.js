
const express = require('express');
const { BookingController, BulkInsertController } = require('../../controllers');

const router = express.Router();

// /api/v1/booking POST
router.post('/',
    BookingController.createBooking);

    
// /api/v1/booking PATCH
router.patch('/payments',
    BookingController.makePayment);


// /api/v1/booking post
router.get('/bulkInsert',
    BulkInsertController.BulkInsert);


module.exports = router;


