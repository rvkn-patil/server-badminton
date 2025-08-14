// =======================================================
// File: models/Court.js
// Description: Mongoose schema for courts.
// =======================================================
const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  // Add other court-related fields here
});

module.exports = mongoose.model('Court', CourtSchema);

// // --- models/Court.js ---
// const mongoose = require('mongoose');

// const courtSchema = new mongoose.Schema({
//   venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
//   name: { type: String, required: true },
//   description: { type: String },
// });

// module.exports = mongoose.model('Court', courtSchema);