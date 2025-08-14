// =======================================================
// File: routes/auth.js
// Description: Handles user and owner/admin registration and login.
// =======================================================
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Owner = require('../models/Owner');
const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @route   POST /api/auth/register/user
// @desc    Register a new user
router.post('/register/user', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = new User({ name, email, password, phoneNumber });
    await user.save();
    const token = generateToken(user._id, 'user');
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// @route   POST /api/auth/register/owner
// @desc    Register a new owner
router.post('/register/owner', async (req, res) => {
  try {
    const { name, email, password, venueIds } = req.body;
    const owner = new Owner({ name, email, password, venueIds, role: 'owner' });
    await owner.save();
    const token = generateToken(owner._id, 'owner');
    res.status(201).json({ token, owner: { id: owner._id, name: owner.name, email: owner.email, role: owner.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error registering owner.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login for both users and owners/admins
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Try to find in Users
    let user = await User.findOne({ email });
    let role = 'user';
    if (!user) {
      // If not a User, try to find in Owners
      user = await Owner.findOne({ email });
      if (user) {
        role = user.role;
      }
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id, role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role } });

  } catch (err) {
    res.status(500).json({ message: 'Error logging in.' });
  }
});

module.exports = router;