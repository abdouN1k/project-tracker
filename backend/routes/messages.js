const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
      isDeleted: false
    })
    .populate('sender', 'name email')
    .sort('createdAt');

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;