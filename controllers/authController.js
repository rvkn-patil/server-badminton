// controllers/authController.js

const User = require('../models/User');
const Owner = require('../models/Owner');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Utility Functions
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: '1h',
    });
};

// Auth Middleware
exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

exports.ownerOrAdminMiddleware = async (req, res, next) => {
    const user = await Owner.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if (user.role === 'owner' || user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied.' });
    }
};

exports.ownerOnlyMiddleware = async (req, res, next) => {
    const user = await Owner.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if (user.role === 'owner') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied.' });
    }
};

// Controller Functions
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password: password, role: 'user' });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed.', error: error.message });
    }
};

exports.registerOwner = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const owner = new Owner({ name, email, password: password, role: 'owner' });
        await owner.save();
        res.status(201).json({ message: 'Owner registered successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed.', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        let role = 'user';

        if (!user) {
            user = await Owner.findOne({ email });
            if (user) {
                role = user.role;
            }
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid email.' });
        }

        // Use bcrypt.compare directly to check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const token = generateToken(user._id, role);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in.' });
    }
};