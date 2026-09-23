const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users
router.get('/', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('-password')
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;