// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

router.post('/', authController.authMiddleware, bookingController.createBooking);
router.get('/', authController.authMiddleware, bookingController.getBookings);

module.exports = router;