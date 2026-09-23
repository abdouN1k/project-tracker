const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // support both shapes
    req.user = decoded.user ? decoded.user : decoded;
    if (!req.user.id && req.user._id) req.user.id = req.user._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};