// // =======================================================
// // File: package.json
// // Note: This file lists the new dependencies you'll need.
// // =======================================================
// /*
//   "dependencies": {
//     "bcryptjs": "^2.4.3",
//     "cookie-parser": "~1.4.4",
//     "cors": "^2.8.5",
//     "debug": "~2.6.9",
//     "dotenv": "^16.0.3",
//     "express": "~4.16.1",
//     "http-errors": "~1.6.3",
//     "jade": "~1.11.0",
//     "jsonwebtoken": "^9.0.0",
//     "luxon": "^3.0.4",
//     "mongoose": "^7.0.0",
//     "morgan": "~1.9.1"
//   }
// */

// // =======================================================
// // File: .env
// // Note: You must create a .env file and add these variables.
// // =======================================================
// /*
//   MONGODB_URI=mongodb://localhost:27017/court_booking_db
//   JWT_SECRET=your_super_secret_jwt_key
// */


// // =======================================================
// // File: models/User.js
// // Description: Mongoose schema for standard users.
// // =======================================================
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phoneNumber: { type: String }
// });

// // Hash the password before saving the user
// UserSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// // Method to compare password
// UserSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);


// // =======================================================
// // File: models/Owner.js
// // Description: Mongoose schema for venue owners and admins.
// // =======================================================
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const OwnerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   venueIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
//   role: { type: String, enum: ['owner', 'admin'], required: true, default: 'owner' }
// });

// // Hash the password before saving the owner/admin
// OwnerSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// // Method to compare password
// OwnerSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('Owner', OwnerSchema);


// // =======================================================
// // File: models/Venue.js
// // Description: Updated Mongoose schema for venues with owner/admin IDs.
// // =======================================================
// const mongoose = require('mongoose');

// const VenueSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   address: { type: String, required: true },
//   ownerIds: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Owner'
//   }],
//   adminIds: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Owner'
//   }],
//   totalMaximumCourts: { // New field to store the maximum number of courts
//     type: Number,
//     required: false
//   }
// });

// module.exports = mongoose.model('Venue', VenueSchema);


// // =======================================================
// // File: models/Court.js
// // Description: Mongoose schema for courts.
// // =======================================================
// const mongoose = require('mongoose');

// const CourtSchema = new mongoose.Schema({
//   venueId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Venue',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   description: String,
//   // Add other court-related fields here
// });

// module.exports = mongoose.model('Court', CourtSchema);

// // =======================================================
// // File: models/Booking.js
// // Description: New Mongoose schema for bookings.
// // =======================================================
// const mongoose = require('mongoose');

// const BookingSchema = new mongoose.Schema({
//   venueId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Venue',
//     required: true
//   },
//   courtId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Court',
//     required: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   date: {
//     type: String, // e.g., 'YYYY-MM-DD'
//     required: true
//   },
//   startTime: {
//     type: Date,
//     required: true
//   },
//   endTime: {
//     type: Date,
//     required: true
//   },
//   duration: {
//     type: Number,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Booking', BookingSchema);


// // =======================================================
// // File: middleware/authMiddleware.js
// // Description: Verifies the JWT and attaches user data to req.
// // =======================================================
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication failed: No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, role }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Authentication failed: Invalid token.' });
//   }
// };

// module.exports = authMiddleware;


// // =======================================================
// // File: middleware/roleMiddleware.js
// // Description: Checks if the user has the required role.
// // =======================================================
// const roleMiddleware = (requiredRole) => {
//   return (req, res, next) => {
//     // req.user is set by authMiddleware
//     if (!req.user || req.user.role !== requiredRole) {
//       return res.status(403).json({ message: 'Authorization failed: You do not have the required permissions.' });
//     }
//     next();
//   };
// };

// module.exports = roleMiddleware;


// // =======================================================
// // File: routes/auth.js
// // Description: Handles user and owner/admin registration and login.
// // =======================================================
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Owner = require('../models/Owner');
// const router = express.Router();

// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
// };

// // @route   POST /api/auth/register/user
// // @desc    Register a new user
// router.post('/register/user', async (req, res) => {
//   try {
//     const { name, email, password, phoneNumber } = req.body;
//     const user = new User({ name, email, password, phoneNumber });
//     await user.save();
//     const token = generateToken(user._id, 'user');
//     res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ message: 'Error registering user.' });
//   }
// });

// // @route   POST /api/auth/register/owner
// // @desc    Register a new owner
// router.post('/register/owner', async (req, res) => {
//   try {
//     const { name, email, password, venueIds } = req.body;
//     const owner = new Owner({ name, email, password, venueIds, role: 'owner' });
//     await owner.save();
//     const token = generateToken(owner._id, 'owner');
//     res.status(201).json({ token, owner: { id: owner._id, name: owner.name, email: owner.email, role: owner.role } });
//   } catch (err) {
//     res.status(500).json({ message: 'Error registering owner.' });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Login for both users and owners/admins
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Try to find in Users
//     let user = await User.findOne({ email });
//     let role = 'user';
//     if (!user) {
//       // If not a User, try to find in Owners
//       user = await Owner.findOne({ email });
//       if (user) {
//         role = user.role;
//       }
//     }

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).json({ message: 'Invalid credentials.' });
//     }

//     const token = generateToken(user._id, role);
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email, role } });

//   } catch (err) {
//     res.status(500).json({ message: 'Error logging in.' });
//   }
// });

// module.exports = router;


// // =======================================================
// // File: routes/profile.js
// // Description: Handles user and owner/admin profile updates and deletions.
// // =======================================================
// const express = require('express');
// const User = require('../models/User');
// const Owner = require('../models/Owner');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// // @route   PUT /api/profile/:id
// // @desc    Update a user/owner/admin profile
// // @access  Private
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, password, phoneNumber, venueIds, role } = req.body;

//     // A user can only update their own profile
//     if (req.user.id !== id) {
//       return res.status(403).json({ message: 'You are not authorized to update this profile.' });
//     }

//     let updatedUser;
//     if (req.user.role === 'user') {
//       updatedUser = await User.findById(id);
//       if (name) updatedUser.name = name;
//       if (email) updatedUser.email = email;
//       if (password) updatedUser.password = password;
//       if (phoneNumber) updatedUser.phoneNumber = phoneNumber;
//       await updatedUser.save();
//     } else {
//       updatedUser = await Owner.findById(id);
//       if (name) updatedUser.name = name;
//       if (email) updatedUser.email = email;
//       if (password) updatedUser.password = password;
//       // Note: Only an 'owner' can modify roles or venueIds
//       if (req.user.role === 'owner') {
//         if (venueIds) updatedUser.venueIds = venueIds;
//         if (role) updatedUser.role = role;
//       }
//       await updatedUser.save();
//     }

//     res.json({ message: 'Profile updated successfully.', user: updatedUser });
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating profile.' });
//   }
// });

// // @route   DELETE /api/profile/:id
// // @desc    Delete a user/owner/admin profile
// // @access  Private
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;

//     // A user can only delete their own profile
//     if (req.user.id !== id) {
//       return res.status(403).json({ message: 'You are not authorized to delete this profile.' });
//     }

//     if (req.user.role === 'user') {
//       await User.findByIdAndDelete(id);
//     } else {
//       await Owner.findByIdAndDelete(id);
//     }

//     res.json({ message: 'Profile deleted successfully.' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting profile.' });
//   }
// });

// module.exports = router;


// // =======================================================
// // File: routes/admin.js
// // Description: Handles owner-only actions, like adding admins.
// // =======================================================
// const express = require('express');
// const Owner = require('../models/Owner');
// const authMiddleware = require('../middleware/authMiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');
// const router = express.Router();

// // @route   POST /api/admin/add
// // @desc    Owner can add a new admin
// // @access  Private, Owner only
// router.post('/add', authMiddleware, roleMiddleware('owner'), async (req, res) => {
//   try {
//     const { name, email, password, venueIds } = req.body;
//     const newAdmin = new Owner({ name, email, password, venueIds, role: 'admin' });
//     await newAdmin.save();
//     res.status(201).json({ message: 'New admin created successfully.', admin: newAdmin });
//   } catch (err) {
//     res.status(500).json({ message: 'Error adding new admin.' });
//   }
// });

// module.exports = router;


// // =======================================================
// // File: routes/venues.js
// // Description: Handles venue and court management by owners/admins.
// // =======================================================
// const express = require('express');
// const Venue = require('../models/Venue');
// const Court = require('../models/Court');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// // @route   POST /api/venues
// // @desc    Owner/Admin can add a new venue and its courts.
// // @access  Private, Owner or Admin
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { name, address, courts, totalMaximumCourts } = req.body;
//     const { id, role } = req.user;

//     // Only owners and admins can create venues
//     if (role !== 'owner' && role !== 'admin') {
//       return res.status(403).json({ message: 'Authorization failed: Only owners and admins can add venues.' });
//     }

//     // Create the new venue
//     const newVenue = new Venue({
//       name,
//       address,
//       [role === 'owner' ? 'ownerIds' : 'adminIds']: [id], // Add user's ID to the correct role array
//       totalMaximumCourts, // Add the new field
//     });
//     await newVenue.save();

//     // Create courts and link them to the new venue
//     if (courts && courts.length > 0) {
//       const courtsWithVenueId = courts.map(court => ({
//         ...court,
//         venueId: newVenue._id
//       }));
//       await Court.insertMany(courtsWithVenueId);
//     }

//     res.status(201).json({ message: 'Venue and courts created successfully.', venue: newVenue });
//   } catch (err) {
//     console.error('Error adding new venue:', err);
//     res.status(500).json({ message: 'Failed to create venue.' });
//   }
// });

// // @route   GET /api/venues
// // @desc    Get a list of all venues.
// // @access  Public
// router.get('/', async (req, res) => {
//   try {
//     const venues = await Venue.find();
//     res.json(venues);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching venues.' });
//   }
// });

// // @route   GET /api/venues/:venueId/courts
// // @desc    Get a list of courts for a specific venue.
// // @access  Public
// router.get('/:venueId/courts', async (req, res) => {
//   try {
//     const { venueId } = req.params;
//     const courts = await Court.find({ venueId });
//     res.json(courts);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching courts.' });
//   }
// });

// module.exports = router;


// // =======================================================
// // File: routes/bookings.js
// // Description: Handles all booking-related logic.
// // =======================================================
// const express = require('express');
// const { DateTime } = require('luxon');
// const authMiddleware = require('../middleware/authMiddleware');
// const Booking = require('../models/Booking');
// const Owner = require('../models/Owner');
// const router = express.Router();

// // @route   GET /api/bookings
// // @desc    Get bookings based on user role. Requires venueId and date query params.
// // @access  Private (auth required)
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const { venueId, date } = req.query;
//     const { role, id } = req.user;

//     // A check to make sure both venueId and date are provided.
//     if (!venueId || !date) {
//       return res.status(400).json({ message: 'venueId and date are required query parameters.' });
//     }

//     let bookings;
//     if (role === 'user') {
//       // User can only see their own bookings for the specified venue and date.
//       bookings = await Booking.find({ userId: id, venueId: venueId, date: date });
//     } else if (role === 'owner' || role === 'admin') {
//       // Owner/Admin can see all bookings for a specific venue on a specific date.
//       const owner = await Owner.findById(id);
//       if (!owner) {
//         return res.status(404).json({ message: 'Owner/Admin not found.' });
//       }

//       // Check if the requested venueId is one of the venues the owner/admin manages.
//       if (!owner.venueIds.map(v => v.toString()).includes(venueId)) {
//         return res.status(403).json({ message: 'You are not authorized to view bookings for this venue.' });
//       }

//       bookings = await Booking.find({ venueId: venueId, date: date });
//     } else {
//       return res.status(403).json({ message: 'Unauthorized role.' });
//     }
    
//     res.json(bookings);

//   } catch (err) {
//     console.error('Error fetching bookings:', err);
//     res.status(500).json({ message: 'Error fetching bookings.' });
//   }
// });


// // @route   POST /api/bookings
// // @desc    Create a new booking.
// // @access  Private (auth required)
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { venueId, courtId, date, startTime } = req.body;
//     const userId = req.user.id; // Get userId from the authenticated user

//     if (!venueId || !courtId || !date || !startTime) {
//       return res.status(400).json({ message: 'Missing required booking details.' });
//     }

//     const duration = 1; // Fixed 1-hour duration
//     const bookingStart = DateTime.fromISO(`${date}T${startTime}:00.000`).toJSDate();
//     const bookingEnd = DateTime.fromJSDate(bookingStart).plus({ hours: duration }).toJSDate();

//     // Check for an existing booking that overlaps
//     const existingBooking = await Booking.findOne({
//       venueId,
//       courtId,
//       date,
//       $or: [
//         { startTime: { $lt: bookingEnd }, endTime: { $gt: bookingStart } }
//       ]
//     });

//     if (existingBooking) {
//       return res.status(409).json({ message: 'This court is already booked for the selected time.' });
//     }

//     const newBooking = new Booking({
//       venueId,
//       courtId,
//       userId,
//       date,
//       startTime: bookingStart,
//       endTime: bookingEnd,
//       duration,
//     });

//     await newBooking.save();
//     res.status(201).json({ message: 'Booking created successfully.', booking: newBooking });
//   } catch (err) {
//     console.error('Failed to create booking:', err);
//     res.status(500).json({ message: 'Failed to create booking.' });
//   }
// });

// module.exports = router;


// // =======================================================
// // File: app.js
// // Description: Updated main application file.
// // =======================================================
// require('dotenv').config();
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// const mongoose = require('mongoose');
// const cors = require('cors');
// const { DateTime } = require('luxon');

// // Import new models and routers
// const User = require('./models/User');
// const Owner = require('./models/Owner');
// const Venue = require('./models/Venue');
// const Court = require('./models/Court');
// const Booking = require('./models/Booking');

// const authRouter = require('./routes/auth');
// const profileRouter = require('./routes/profile');
// const adminRouter = require('./routes/admin');
// const venuesRouter = require('./routes/venues'); // Import venues router
// const bookingsRouter = require('./routes/bookings'); // Import new bookings router

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// // MongoDB connection
// const MONGODB_URI = process.env.MONGODB_URI;
// mongoose.connect(MONGODB_URI)
// .then(() => {
//   console.log('MongoDB connected successfully.');
//   // Seed the database with some sample data
//   seedDatabase();
// })
// .catch(err => console.error('MongoDB connection error:', err));

// const seedDatabase = async () => {
//   const venuesCount = await Venue.countDocuments();
//   if (venuesCount === 0) {
//     const venue1 = await Venue.create({ name: 'Phoenix Courts', address: '123 Court St', totalMaximumCourts: 2 });
//     const venue2 = await Venue.create({ name: 'Shuttle Smashers', address: '456 Racket Rd', totalMaximumCourts: 2 });
//     console.log('Sample venues seeded.');

//     const courts = await Court.insertMany([
//       { venueId: venue1._id, name: 'Court 1A', description: 'Main court with premium lighting.' },
//       { venueId: venue1._id, name: 'Court 1B', description: 'Standard court, well-maintained.' },
//       { venueId: venue2._id, name: 'Court 2A', description: 'Tournament court with umpire chairs.' },
//       { venueId: venue2._id, name: 'Court 2B', description: 'Training court.' },
//     ]);
//     console.log('Sample courts seeded.');

//     const user = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123', phoneNumber: '1234567890' });
//     console.log('Sample user created.');

//     const owner = await Owner.create({ name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'owner', venueIds: [venue1._id, venue2._id] });
//     console.log('Sample owner created.');

//     const today = DateTime.now().toISODate();
//     const tomorrow = DateTime.now().plus({ days: 1 }).toISODate();

//     await Booking.insertMany([
//       { venueId: venue1._id, courtId: courts[0]._id, userId: user._id, date: today, startTime: DateTime.fromISO(`${today}T10:00:00.000`).toJSDate(), endTime: DateTime.fromISO(`${today}T11:00:00.000`).toJSDate(), duration: 1 },
//       { venueId: venue2._id, courtId: courts[2]._id, userId: user._id, date: tomorrow, startTime: DateTime.fromISO(`${tomorrow}T14:00:00.000`).toJSDate(), endTime: DateTime.fromISO(`${tomorrow}T15:00:00.000`).toJSDate(), duration: 1 },
//     ]);
//     console.log('Sample bookings seeded.');
//   }
// };

// // === API ROUTES ===
// app.use('/api/auth', authRouter);
// app.use('/api/profile', profileRouter);
// app.use('/api/admin', adminRouter);
// app.use('/api/venues', venuesRouter); // Use the new venues router
// app.use('/api/bookings', bookingsRouter); // Use the new bookings router

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
