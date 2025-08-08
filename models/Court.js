// --- models/Court.js ---
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  name: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Court', courtSchema);