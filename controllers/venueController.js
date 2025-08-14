// controllers/venueController.js

const Venue = require('../models/Venue');
const Court = require('../models/Court');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Owner = require('../models/Owner');

exports.createVenue = async (req, res) => {
  const { name, address } = req.body; // totalMaximumCourts
  const ownerId = req.user.id; // Get the ID of the user creating the venue

  try {
    const newVenue = new Venue({
      name,
      address,
    //   totalMaximumCourts,
      ownerIds: [ownerId], // Automatically add the owner's ID
    });
    await newVenue.save();

    // Find the owner and add the new venue ID to their venueIds array
    const owner = await Owner.findById(ownerId);
    if (owner) {
      owner.venueIds.push(newVenue._id);
      await owner.save();
    }

    res.status(201).json(newVenue);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create venue.', error: error.message });
  }
};

exports.getVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found.' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { name, email, password } = req.body;
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found.' });
    }
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const newAdmin = new Owner({ name, email, password: password, venueIds: [venueId], role: 'admin' });
    await newAdmin.save();
    venue.adminIds.push(newAdmin._id);
    await venue.save();

    res.status(201).json({ message: 'Admin added successfully.', newAdminId: newAdmin._id });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Failed to add admin.', error: error.message });
  }
};

exports.createCourt = async (req, res) => {
  const { venueId } = req.params;
  const { name, description } = req.body;
  try {
    const newCourt = new Court({ venueId, name, description });
    await newCourt.save();
    res.status(201).json(newCourt);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create court.', error: error.message });
  }
};

exports.getCourtsByVenue = async (req, res) => {
  try {
    const courts = await Court.find({ venueId: req.params.venueId });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};