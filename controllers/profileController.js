// controllers/profileController.js

const User = require('../models/User');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('venueIds');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // If the user is an admin, also fetch the venues they are admins for
        if (user.role === 'admin') {
            const venuesAsAdmin = await Venue.find({ adminIds: user._id });
            return res.json({ user, venuesAsAdmin });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phoneNumber, venueIds, role } = req.body;

        // A user can only update their own profile
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'You are not authorized to update this profile.' });
        }

        let updatedUser;
        if (req.user.role === 'user') {
            updatedUser = await User.findById(id);
            if (name) updatedUser.name = name;
            if (email) updatedUser.email = email;
            if (password) updatedUser.password = password;
            if (phoneNumber) updatedUser.phoneNumber = phoneNumber;
            await updatedUser.save();
        } else {
            updatedUser = await Owner.findById(id);
            if (name) updatedUser.name = name;
            if (email) updatedUser.email = email;
            if (password) updatedUser.password = password;
            // Note: Only an 'owner' can modify roles or venueIds
            if (req.user.role === 'owner') {
                if (venueIds) updatedUser.venueIds = venueIds;
                if (role) updatedUser.role = role;
            }
            await updatedUser.save();
        }

        res.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile.' });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove user's bookings
        await Booking.deleteMany({ userId: user._id });

        // Remove user from venues
        await Venue.updateMany(
            { $or: [{ ownerIds: user._id }, { adminIds: user._id }] },
            { $pull: { ownerIds: user._id, adminIds: user._id } }
        );

        // Delete the user
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'Profile deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete profile.', error: error.message });
    }

    // try {
    //     const { id } = req.params;

    //     // A user can only delete their own profile
    //     if (req.user.id !== id) {
    //         return res.status(403).json({ message: 'You are not authorized to delete this profile.' });
    //     }

    //     if (req.user.role === 'user') {
    //         await User.findByIdAndDelete(id);
    //     } else {
    //         await Owner.findByIdAndDelete(id);
    //     }

    //     res.json({ message: 'Profile deleted successfully.' });
    // } catch (err) {
    //     res.status(500).json({ message: 'Error deleting profile.' });
    // }
};