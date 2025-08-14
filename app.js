require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const cors = require('cors');
const { DateTime } = require('luxon');

// const User = require('./models/User');
// const Owner = require('./models/Owner');
// const Venue = require('./models/Venue');
// const Court = require('./models/Court');
// const Booking = require('./models/Booking');

const authRoutes = require('./routes/authRoutes');
const venueRoutes = require('./routes/venueRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully.');
  // // Seed the database with some sample data
  // seedDatabase();
})
.catch(err => console.error('MongoDB connection error:', err));

// const seedDatabase = async () => {
//   const venuesCount = await Venue.countDocuments();
//   if (venuesCount === 0) {
//     const user1 = await Owner.create({ name: 'Patil', email: "patil@gmail.com", password: "Patil@123", role: "owner"});
//     console.log("Sample owner seeded");

//     const venue1 = await Venue.create({ name: 'Phoenix Courts', address: '123 Court St', /* totalMaximumCourts: 2, */ ownerIds: [user1._id] });
//     const venue2 = await Venue.create({ name: 'Shuttle Smashers', address: '456 Racket Rd', /* totalMaximumCourts: 2, */ ownerIds: [user1._id] });
//     console.log('Sample venues seeded.');

//     await Court.insertMany([
//       { venueId: venue1._id, name: 'Court 1A', description: 'Main court with premium lighting.' },
//       { venueId: venue1._id, name: 'Court 1B', description: 'Standard court, well-maintained.' },
//       { venueId: venue2._id, name: 'Court 2A', description: 'Tournament court with umpire chairs.' },
//       { venueId: venue2._id, name: 'Court 2B', description: 'Training court.' },
//     ]);
//     console.log('Sample courts seeded.');
//   }
// };

app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profile', profileRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
