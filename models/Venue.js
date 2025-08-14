// =======================================================
// File: models/Venue.js
// Description: Updated Mongoose schema for venues with owner/admin IDs.
// =======================================================
const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  ownerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  }],
  adminIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  }],
  totalMaximumCourts: {
    type: Number
  }
});

module.exports = mongoose.model('Venue', VenueSchema);


// // --- models/Venue.js ---
// const mongoose = require('mongoose');

// const venueSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   address: { type: String },
// });

// module.exports = mongoose.model('Venue', venueSchema);