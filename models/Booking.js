// =======================================================
// File: models/Booking.js
// Description: New Mongoose schema for bookings.
// Only Users can book courts, and bookings are linked to users.
// Bookings include the venue, court, user, date, start time, end time, duration, and who booked it.
// =======================================================
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookedBy: {
    type: String, // Name of the user who booked
    required: true
  },
  date: {
    type: String, // e.g., 'YYYY-MM-DD'
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);

// // --- models/Booking.js ---
// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
//   courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
//   userId: { type: String, required: true },
//   date: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   duration: { type: Number, required: true, min: 1 },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Booking', bookingSchema);