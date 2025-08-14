// =======================================================
// File: routes/bookings.js
// Description: Handles all booking-related logic.
// =======================================================
const express = require('express');
const { DateTime } = require('luxon');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const Owner = require('../models/Owner');
const router = express.Router();

// @route   GET /api/bookings
// @desc    Get bookings based on user role.
// @access  Private (auth required)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { venueId, date } = req.query;
    const { role, id } = req.user;

    // A check to make sure both venueId and date are provided.
    if (!venueId || !date) {
      return res.status(400).json({ message: 'venueId and date are required query parameters.' });
    }

    let bookings;
    if (role === 'user') {
      // User can only see their own bookings for the specified venue and date.
      bookings = await Booking.find({ userId: id, venueId: venueId, date: date });
    } else if (role === 'owner' || role === 'admin') {
      // Owner/Admin can see all bookings for a specific venue on a specific date.
      const owner = await Owner.findById(id);
      if (!owner) {
        return res.status(404).json({ message: 'Owner/Admin not found.' });
      }

      // Check if the requested venueId is one of the venues the owner/admin manages.
      // if (!owner.venueIds.map(v => v.toString()).includes(venueId)) {
      //   return res.status(403).json({ message: 'You are not authorized to view bookings for this venue.' });
      // }

      bookings = await Booking.find({ venueId: venueId, date: date });
    } else {
      return res.status(403).json({ message: 'Unauthorized role.' });
    }
    
    res.json(bookings);

  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
});


// @route   POST /api/bookings
// @desc    Create a new booking.
// @access  Private (auth required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { venueId, courtId, date, startTime } = req.body;
    const userId = req.user.id; // Get userId from the authenticated user

    if (!venueId || !courtId || !date || !startTime) {
      return res.status(400).json({ message: 'Missing required booking details.' });
    }

    const duration = 1; // Fixed 1-hour duration
    const bookingStart = DateTime.fromISO(`${date}T${startTime}:00.000`).toJSDate();
    const bookingEnd = DateTime.fromJSDate(bookingStart).plus({ hours: duration }).toJSDate();

    // Check for an existing booking that overlaps
    const existingBooking = await Booking.findOne({
      venueId,
      courtId,
      date,
      $or: [
        { startTime: { $lt: bookingEnd }, endTime: { $gt: bookingStart } }
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'This court is already booked for the selected time.' });
    }

    const newBooking = new Booking({
      venueId,
      courtId,
      userId,
      date,
      startTime: bookingStart,
      endTime: bookingEnd,
      duration,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully.', booking: newBooking });
  } catch (err) {
    console.error('Failed to create booking:', err);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});

module.exports = router;