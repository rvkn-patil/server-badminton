require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const cors = require('cors');
const { DateTime } = require('luxon');

const Venue = require('./models/Venue');
const Court = require('./models/Court');
const Booking = require('./models/Booking');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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
  // Seed the database with some sample data
  seedDatabase();
})
.catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  const venuesCount = await Venue.countDocuments();
  if (venuesCount === 0) {
    const venue1 = await Venue.create({ name: 'Phoenix Courts', address: '123 Court St' });
    const venue2 = await Venue.create({ name: 'Shuttle Smashers', address: '456 Racket Rd' });
    console.log('Sample venues seeded.');

    await Court.insertMany([
      { venueId: venue1._id, name: 'Court 1A', description: 'Main court with premium lighting.' },
      { venueId: venue1._id, name: 'Court 1B', description: 'Standard court, well-maintained.' },
      { venueId: venue2._id, name: 'Court 2A', description: 'Tournament court with umpire chairs.' },
      { venueId: venue2._id, name: 'Court 2B', description: 'Training court.' },
    ]);
    console.log('Sample courts seeded.');
  }
};

app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes
app.get('/api/venues', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching venues.' });
  }
});

app.get('/api/courts/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const courts = await Court.find({ venueId });
    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courts.' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { venueId, date } = req.query;
    if (!venueId || !date) {
      return res.status(400).json({ message: 'Venue ID and date are required.' });
    }
    // Fetch bookings for the given venue and date
    const bookings = await Booking.find({ venueId, date });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { venueId, courtId, date, startTime, userId } = req.body;
    const duration = 1; // Fixed 1-hour duration

    if (!venueId || !courtId || !date || !startTime || !userId) {
      return res.status(400).json({ message: 'Missing required booking details.' });
    }

    const bookingStart = DateTime.fromISO(`${date}T${startTime}:00.000`).toJSDate();
    const bookingEnd = DateTime.fromJSDate(bookingStart).plus({ hours: duration }).toJSDate();

    // Check for an existing booking that overlaps
    const existingBooking = await Booking.findOne({
      venueId,
      courtId,
      date,
      $or: [
        { startTime: { $lt: bookingEnd }, endTime: { $gt: bookingStart } }
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'This court is already booked for the selected time.' });
    }

    const newBooking = new Booking({
      venueId,
      courtId,
      userId,
      date,
      startTime: bookingStart,
      endTime: bookingEnd,
      duration,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully.', booking: newBooking });
  } catch (err) {
    console.error('Failed to create booking:', err);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});

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
