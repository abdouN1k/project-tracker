const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123456789');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
        } catch (error) {
          return res.status(401).json({ message: 'Token machiyal7, connecta mn jdid' });
        }
  }

  if (!token) {
    return res.status(401).json({ message: 'Machi autorisé, khassek t connecta' });
  }
};

module.exports = { protect };