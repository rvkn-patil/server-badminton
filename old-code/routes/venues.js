// =======================================================
// File: routes/venues.js
// Description: Handles venue and court management by owners/admins.
// =======================================================
const express = require('express');
const Venue = require('../models/Venue');
const Court = require('../models/Court');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/venues
// @desc    Owner/Admin can add a new venue and its courts.
// @access  Private, Owner or Admin
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, address, courts, totalMaximumCourts } = req.body;
    const { id, role } = req.user;

    // Only owners and admins can create venues
    if (role !== 'owner' && role !== 'admin') {
      return res.status(403).json({ message: 'Authorization failed: Only owners and admins can add venues.' });
    }

    // Create the new venue
    const newVenue = new Venue({
      name,
      address,
      [role === 'owner' ? 'ownerIds' : 'adminIds']: [id], // Add user's ID to the correct role array
      // totalMaximumCourts
    });
    await newVenue.save();

    // Create courts and link them to the new venue
    if (courts && courts.length > 0) {
      const courtsWithVenueId = courts.map(court => ({
        ...court,
        venueId: newVenue._id
      }));
      await Court.insertMany(courtsWithVenueId);
    }

    res.status(201).json({ message: 'Venue and courts created successfully.', venue: newVenue });
  } catch (err) {
    console.error('Error adding new venue:', err);
    res.status(500).json({ message: 'Failed to create venue.' });
  }
});

// @route   GET /api/venues
// @desc    Get a list of all venues.
// @access  Public
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching venues.' });
  }
});

// @route   GET /api/venues/:venueId/courts
// @desc    Get a list of courts for a specific venue.
// @access  Public
router.get('/:venueId/courts', async (req, res) => {
  try {
    const { venueId } = req.params;
    const courts = await Court.find({ venueId });
    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courts.' });
  }
});

module.exports = router;