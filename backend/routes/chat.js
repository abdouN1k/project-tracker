const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// GET conversation between 2 users
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEND message
router.post('/', auth, async (req, res) => {
  try {
    const { content, receiver } = req.body;
    const message = new Message({
      content,
      sender: req.user.id,
      receiver
    });
    await message.save();
    const populated = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;