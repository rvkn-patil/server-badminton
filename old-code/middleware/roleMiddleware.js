// =======================================================
// File: middleware/roleMiddleware.js
// Description: Checks if the user has the required role.
// =======================================================
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // req.user is set by authMiddleware
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Authorization failed: You do not have the required permissions.' });
    }
    next();
  };
};

module.exports = roleMiddleware;