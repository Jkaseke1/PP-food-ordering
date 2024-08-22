const authMiddleware = require('./authMiddleware');

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  });
};

module.exports = adminMiddleware;