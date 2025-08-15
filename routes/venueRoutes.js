// routes/venueRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const venueController = require('../controllers/venueController');

router.post('/', authController.authMiddleware, authController.ownerOrAdminMiddleware, venueController.createVenue);
router.get('/', authController.authMiddleware, venueController.getAllVenues);
router.get('/:id', authController.authMiddleware, venueController.getVenue);
router.post('/:venueId/add-admin', authController.authMiddleware, authController.ownerOnlyMiddleware, venueController.addAdmin);
router.post('/:venueId/courts', authController.authMiddleware, authController.ownerOrAdminMiddleware, venueController.createCourt);
router.get('/:venueId/courts', authController.authMiddleware, venueController.getCourtsByVenue);

module.exports = router;