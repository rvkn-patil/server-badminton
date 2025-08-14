// =======================================================
// File: routes/profile.js
// Description: Handles user and owner/admin profile updates and deletions.
// =======================================================
const express = require('express');
const User = require('../models/User');
const Owner = require('../models/Owner');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   PUT /api/profile/:id
// @desc    Update a user/owner/admin profile
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phoneNumber, venueIds, role } = req.body;

    // A user can only update their own profile
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You are not authorized to update this profile.' });
    }

    let updatedUser;
    if (req.user.role === 'user') {
      updatedUser = await User.findById(id);
      if (name) updatedUser.name = name;
      if (email) updatedUser.email = email;
      if (password) updatedUser.password = password;
      if (phoneNumber) updatedUser.phoneNumber = phoneNumber;
      await updatedUser.save();
    } else {
      updatedUser = await Owner.findById(id);
      if (name) updatedUser.name = name;
      if (email) updatedUser.email = email;
      if (password) updatedUser.password = password;
      // Note: Only an 'owner' can modify roles or venueIds
      if (req.user.role === 'owner') {
        if (venueIds) updatedUser.venueIds = venueIds;
        if (role) updatedUser.role = role;
      }
      await updatedUser.save();
    }

    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

// @route   DELETE /api/profile/:id
// @desc    Delete a user/owner/admin profile
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // A user can only delete their own profile
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You are not authorized to delete this profile.' });
    }

    if (req.user.role === 'user') {
      await User.findByIdAndDelete(id);
    } else {
      await Owner.findByIdAndDelete(id);
    }

    res.json({ message: 'Profile deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting profile.' });
  }
});

module.exports = router;