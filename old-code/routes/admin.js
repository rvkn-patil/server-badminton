// =======================================================
// File: routes/admin.js
// Description: Handles owner-only actions, like adding admins.
// =======================================================
const express = require('express');
const Owner = require('../models/Owner');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// @route   POST /api/admin/add
// @desc    Owner can add a new admin
// @access  Private, Owner only
router.post('/add', authMiddleware, roleMiddleware('owner'), async (req, res) => {
  try {
    const { name, email, password, venueIds } = req.body;
    const newAdmin = new Owner({ name, email, password, venueIds, role: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'New admin created successfully.', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error adding new admin.' });
  }
});

module.exports = router;