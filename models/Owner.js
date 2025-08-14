// =======================================================
// File: models/Owner.js
// Description: Mongoose schema for venue owners and admins.
// =======================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  venueIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
  role: { type: String, enum: ['owner', 'admin'], required: true, default: 'owner' }
});

// Hash the password before saving the owner/admin
OwnerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
OwnerSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Owner', OwnerSchema);