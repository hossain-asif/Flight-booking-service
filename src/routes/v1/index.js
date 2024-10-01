const express = require('express');
const bookingRoutes = require('./booking-routes');

const { InfoController } = require('../../controllers');

const router = express.Router();

router.use('/booking', bookingRoutes);




router.get('/info',InfoController.info);

module.exports = router;
