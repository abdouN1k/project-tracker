const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// GET /api/chat/:userId
router.get('/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/chat
router.post('/', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { content, receiver, type, reportData } = req.body;

    if (!receiver) {
      return res.status(400).json({ message: 'receiver is required' });
    }

    const message = new Message({
      content: content || '',
      type: type || 'text',
      reportData: reportData || null,
      sender: currentUserId,
      receiver
    });

    await message.save();

    const populated = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;