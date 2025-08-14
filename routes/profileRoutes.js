// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');

// Get the authenticated user's profile
router.get('/:id', authController.authMiddleware, profileController.getProfile);

// Update the authenticated user's profile
router.put('/:id', authController.authMiddleware, profileController.updateProfile);

// Delete the authenticated user's profile
router.delete('/:id', authController.authMiddleware, profileController.deleteProfile);

module.exports = router;