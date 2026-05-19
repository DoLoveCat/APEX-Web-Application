const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes - requires a valid JWT
exports.requireAuth = async (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if it exists and has the right format: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided. Please log in.'
      });
    }

    // 3. Extract just the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using our JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Find the user in DB (in case they were deleted)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        error: 'User no longer exists'
      });
    }

    // 6. Attach the user to the request so controllers can access it
    req.user = user;

    // 7. Continue to the actual route handler
    next();

  } catch (error) {
    // jwt.verify throws if the token is invalid or expired
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

// Middleware to restrict routes to specific roles (e.g. admin only)
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // This middleware ALWAYS runs after requireAuth, so req.user exists
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }
    next();
  };
};