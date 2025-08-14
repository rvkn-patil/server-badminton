// =======================================================
// File: middleware/authMiddleware.js
// Description: Verifies the JWT and attaches user data to req.
// =======================================================
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

module.exports = authMiddleware;