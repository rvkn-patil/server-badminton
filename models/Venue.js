// --- models/Venue.js ---
const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
});

module.exports = mongoose.model('Venue', venueSchema);