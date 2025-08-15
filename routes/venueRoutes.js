// routes/venueRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const venueController = require('../controllers/venueController');

router.post('/', authController.authMiddleware, authController.ownerOrAdminMiddleware, venueController.createVenue);
router.get('/', venueController.getAllVenues, authController.authMiddleware);
router.get('/:id', venueController.getVenue, authController.authMiddleware);
router.post('/:venueId/add-admin', authController.authMiddleware, authController.ownerOnlyMiddleware, venueController.addAdmin);
router.post('/:venueId/courts', authController.authMiddleware, authController.ownerOrAdminMiddleware, venueController.createCourt);
router.get('/:venueId/courts', venueController.getCourtsByVenue, authController.authMiddleware);

module.exports = router;